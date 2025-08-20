import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '../../config/database';
import { users, refreshTokens, NewUser, NewRefreshToken } from '../../models/schema';
import { CacheService } from '../../config/redis';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface JWTPayload { userId: string; email: string; role: string; iat?: number; exp?: number }

export interface AuthenticatedRequest extends Request { user?: { id: string; email: string; role: string; firstName: string; lastName: string; }; }

export class AuthService {
  static async hashPassword(password: string): Promise<string> { const saltRounds = 12; return await bcrypt.hash(password, saltRounds); }
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> { return await bcrypt.compare(password, hashedPassword); }

  static generateAccessToken(payload: JWTPayload): string {
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any, issuer: 'aijobchommie-api', audience: 'aijobchommie-app' };
    return jwt.sign(payload as any, JWT_SECRET as unknown as Secret, options);
  }

  static generateRefreshToken(payload: JWTPayload): string {
    const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as any, issuer: 'aijobchommie-api', audience: 'aijobchommie-app' };
    return jwt.sign(payload as any, JWT_REFRESH_SECRET as unknown as Secret, options);
  }

  static verifyAccessToken(token: string): JWTPayload { return jwt.verify(token, JWT_SECRET as unknown as Secret, { issuer: 'aijobchommie-api', audience: 'aijobchommie-app' }) as JWTPayload; }
  static verifyRefreshToken(token: string): JWTPayload { return jwt.verify(token, JWT_REFRESH_SECRET as unknown as Secret, { issuer: 'aijobchommie-api', audience: 'aijobchommie-app' }) as JWTPayload; }

  static async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date(); expiresAt.setDate(expiresAt.getDate() + 7);
    const newRefreshToken: NewRefreshToken = { userId, token, expiresAt, isRevoked: false };
    await db.insert(refreshTokens).values(newRefreshToken);
  }

  static async revokeRefreshToken(token: string): Promise<void> { await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.token, token)); }
  static async revokeAllUserRefreshTokens(userId: string): Promise<void> { await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.userId, userId)); }

  static async validateRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await db.select().from(refreshTokens).where(and(eq(refreshTokens.token, token), eq(refreshTokens.isRevoked, false), gt(refreshTokens.expiresAt, new Date()))).limit(1);
    return refreshToken.length > 0;
  }

  // Minimal helper used by middleware/routes during type-check and runtime.
  static async getUserById(userId: string): Promise<any | null> {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      return result && result.length ? result[0] : null;
    } catch (err) {
      return null;
    }
  }

  // Basic register/login/refresh/logout helpers to satisfy existing routes.
  static async register(payload: { email: string; password: string; firstName?: string; lastName?: string; phone?: string; }): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const hashed = await this.hashPassword(payload.password);
    const newUser: NewUser = {
      email: payload.email,
      password: hashed,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      phone: payload.phone || null,
      isActive: true,
      role: 'user'
    } as any;

    const [created] = await db.insert(users).values(newUser).returning();

    const jwtPayload = { userId: created.id, email: created.email, role: created.role };
    const accessToken = this.generateAccessToken(jwtPayload as any);
    const refreshToken = this.generateRefreshToken(jwtPayload as any);
    await this.storeRefreshToken(created.id, refreshToken);

    return { user: created, accessToken, refreshToken };
  }

  static async login(email: string, password: string): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) throw new Error('Invalid credentials');
    const valid = await this.verifyPassword(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const jwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = this.generateAccessToken(jwtPayload as any);
    const refreshToken = this.generateRefreshToken(jwtPayload as any);
    await this.storeRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  static async refreshTokens(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const valid = await this.validateRefreshToken(token);
    if (!valid) throw new Error('Invalid refresh token');
    const payload = this.verifyRefreshToken(token);
    const jwtPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const accessToken = this.generateAccessToken(jwtPayload as any);
    const refreshToken = this.generateRefreshToken(jwtPayload as any);
    await this.storeRefreshToken(payload.userId, refreshToken);
    // revoke the old token
    await this.revokeRefreshToken(token);
    return { accessToken, refreshToken };
  }

  static async logout(token: string): Promise<void> {
    await this.revokeRefreshToken(token);
  }

  // ...register/login/refresh/logout/getUserById (omitted for brevity, original logic preserved in repo)
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization; const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, error: 'Access denied', message: 'No token provided' });
    const payload = AuthService.verifyAccessToken(token);
    const user = await AuthService.getUserById(payload.userId);
    if (!user) return res.status(401).json({ success: false, error: 'Access denied', message: 'Invalid token' });
    req.user = user; next();
  } catch (error) { return res.status(401).json({ success: false, error: 'Access denied', message: 'Invalid or expired token' }); }
};

export const authorize = (roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Access denied', message: 'Authentication required' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, error: 'Access forbidden', message: 'Insufficient permissions' });
  next();
};
