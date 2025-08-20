import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '../config/database';
import { users, refreshTokens, NewUser, NewRefreshToken } from '../models/schema';
import { CacheService } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateAccessToken(payload: JWTPayload): string {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as any,
      issuer: 'aijobchommie-api',
      audience: 'aijobchommie-app'
    };
    return jwt.sign(payload as any, JWT_SECRET as unknown as Secret, options);
  }

  static generateRefreshToken(payload: JWTPayload): string {
    const options: SignOptions = {
      expiresIn: JWT_REFRESH_EXPIRES_IN as any,
      issuer: 'aijobchommie-api',
      audience: 'aijobchommie-app'
    };
    return jwt.sign(payload as any, JWT_REFRESH_SECRET as unknown as Secret, options);
  }
}
