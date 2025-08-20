/**
 *  AUTHENTICATION ROUTES
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService, AuthenticatedRequest, authenticateToken } from '../services/authService';
import winston from 'winston';

const router = Router();
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const loginValidation = [ body('email').isEmail().normalizeEmail(), body('password').notEmpty() ];
const refreshTokenValidation = [ body('refreshToken').notEmpty() ];

router.post('/register', registerValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

    const { email, password, firstName, lastName, phone } = req.body;
    const result = await AuthService.register({ email, password, firstName, lastName, phone });

    logger.info('User registered', { userId: result.user.id, email: result.user.email });
    res.status(201).json({ success: true, message: 'User registered successfully', data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken } });
  } catch (error: any) {
    logger.error('Registration failed', { error: error.message, email: req.body.email });
    res.status(400).json({ success: false, error: 'Registration failed', message: error.message });
  }
});

router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    logger.info('User logged in', { userId: result.user.id, email: result.user.email });
    res.json({ success: true, message: 'Login successful', data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken } });
  } catch (error: any) {
    logger.error('Login failed', { error: error.message, email: req.body.email });
    res.status(401).json({ success: false, error: 'Authentication failed', message: error.message });
  }
});

router.post('/refresh', refreshTokenValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

    const { refreshToken } = req.body;
    const result = await AuthService.refreshTokens(refreshToken);

    res.json({ success: true, message: 'Tokens refreshed successfully', data: { accessToken: result.accessToken, refreshToken: result.refreshToken } });
  } catch (error: any) {
    logger.error('Token refresh failed', { error: error.message });
    res.status(401).json({ success: false, error: 'Token refresh failed', message: error.message });
  }
});

router.post('/logout', refreshTokenValidation, async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    logger.info('User logged out');
    res.json({ success: true, message: 'Logout successful' });
  } catch (error: any) {
    logger.error('Logout failed', { error: error.message });
    res.status(400).json({ success: false, error: 'Logout failed', message: error.message });
  }
});

router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'User profile retrieved successfully', data: { user: req.user } });
  } catch (error: any) {
    logger.error('Get user profile failed', { error: error.message, userId: req.user?.id });
    res.status(500).json({ success: false, error: 'Failed to get user profile', message: 'Something went wrong' });
  }
});

export default router;
