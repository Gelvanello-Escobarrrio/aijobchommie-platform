/**
 * 🔐 AUTHENTICATION ROUTES
 * 
 * Complete REST API for authentication and user management
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService, AuthenticatedRequest, authenticateToken } from '../services/authService';
import winston from 'winston';

const router = Router();
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

// =====================================
// 📝 VALIDATION MIDDLEWARE
// =====================================

const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone(['en-ZA'])
    .withMessage('Please provide a valid South African phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

// =====================================
// 🌍 AUTHENTICATION ROUTES
// =====================================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', registerValidation, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName, phone } = req.body;

    // Register user
    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      phone
    });

    logger.info('User registered successfully', {
      userId: result.user.id,
      email: result.user.email
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }
    });

  } catch (error: any) {
    logger.error('Registration failed', {
      error: error.message,
      email: req.body.email
    });

    res.status(400).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Login user
    const result = await AuthService.login(email, password);

    logger.info('User logged in successfully', {
      userId: result.user.id,
      email: result.user.email
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }
    });

  } catch (error: any) {
    logger.error('Login failed', {
      error: error.message,
      email: req.body.email
    });

    res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', refreshTokenValidation, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const { refreshToken } = req.body;

    // Refresh tokens
    const result = await AuthService.refreshTokens(refreshToken);

    res.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }
    });

  } catch (error: any) {
    logger.error('Token refresh failed', {
      error: error.message
    });

    res.status(401).json({
      success: false,
      error: 'Token refresh failed',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', refreshTokenValidation, async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Logout user
    await AuthService.logout(refreshToken);

    logger.info('User logged out successfully');

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error: any) {
    logger.error('Logout failed', {
      error: error.message
    });

    res.status(400).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user }
    });

  } catch (error: any) {
    logger.error('Get user profile failed', {
      error: error.message,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
      message: 'Something went wrong'
    });
  }
});

export default router;
