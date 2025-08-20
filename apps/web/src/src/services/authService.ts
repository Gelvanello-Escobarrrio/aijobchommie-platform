/**
 *  AUTHENTICATION SERVICE
 * 
 * JWT authentication with refresh tokens and comprehensive security
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '../config/database';
import { users, refreshTokens, NewUser, NewRefreshToken } from '../models/schema';
import { CacheService } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Interfaces
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

export class AuthService {
  
  /**
   * Hash password
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate access token
   */
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'aijobchommie-api',
      audience: 'aijobchommie-app'
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { 
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'aijobchommie-api',
      audience: 'aijobchommie-app'
    });
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'aijobchommie-api',
      audience: 'aijobchommie-app'
    }) as JWTPayload;
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'aijobchommie-api',
      audience: 'aijobchommie-app'
    }) as JWTPayload;
  }

  /**
   * Store refresh token in database
   */
  static async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const newRefreshToken: NewRefreshToken = {
      userId,
      token,
      expiresAt,
      isRevoked: false
    };

    await db.insert(refreshTokens).values(newRefreshToken);
  }

  /**
   * Revoke refresh token
   */
  static async revokeRefreshToken(token: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.token, token));
  }

  /**
   * Revoke all user refresh tokens
   */
  static async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.userId, userId));
  }

  /**
   * Validate refresh token in database
   */
  static async validateRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, token),
          eq(refreshTokens.isRevoked, false),
          gt(refreshTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    return refreshToken.length > 0;
  }

  /**
   * Register new user
   */
  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const newUser: NewUser = {
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      isVerified: false,
      isActive: true,
      role: 'user'
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    // Generate tokens
    const payload: JWTPayload = {
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role!
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Store refresh token
    await this.storeRefreshToken(createdUser.id, refreshToken);

    // Cache user data
    await CacheService.set(`user:${createdUser.id}`, createdUser, 3600); // 1 hour

    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role,
        isVerified: createdUser.isVerified
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role!
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken);

    // Cache user data
    await CacheService.set(`user:${user.id}`, user, 3600); // 1 hour

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        subscriptionPlan: user.subscriptionPlan,
        lastLoginAt: user.lastLoginAt
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh tokens
   */
  static async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = this.verifyRefreshToken(refreshToken);

      // Validate refresh token in database
      const isValid = await this.validateRefreshToken(refreshToken);
      if (!isValid) {
        throw new Error('Invalid refresh token');
      }

      // Get user data
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Revoke old refresh token
      await this.revokeRefreshToken(refreshToken);

      // Generate new tokens
      const newPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role!
      };

      const newAccessToken = this.generateAccessToken(newPayload);
      const newRefreshToken = this.generateRefreshToken(newPayload);

      // Store new refresh token
      await this.storeRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user
   */
  static async logout(refreshToken: string): Promise<void> {
    await this.revokeRefreshToken(refreshToken);
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<any | null> {
    // Try to get from cache first
    const cached = await CacheService.get(`user:${userId}`);
    if (cached) {
      return cached;
    }

    // Get from database
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        profileImage: users.profileImage,
        location: users.location,
        province: users.province,
        city: users.city,
        isVerified: users.isVerified,
        role: users.role,
        subscriptionPlan: users.subscriptionPlan,
        subscriptionStatus: users.subscriptionStatus,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user) {
      // Cache user data
      await CacheService.set(`user:${userId}`, user, 3600);
    }

    return user || null;
  }
}

/**
 * Authentication middleware
 */
export const authenticateToken = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verify token
    const payload = AuthService.verifyAccessToken(token);

    // Get user data
    const user = await AuthService.getUserById(payload.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Invalid token'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Access denied',
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access forbidden',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};
