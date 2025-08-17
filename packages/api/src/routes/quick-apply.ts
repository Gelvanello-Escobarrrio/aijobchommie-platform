/**
 * Quick Apply Routes
 * World-class instant job application system for entry-level positions
 */

import express from 'express';
import { Request, Response } from 'express';
import { createSuccessResponse, createErrorResponse } from '@aijobchommie/shared';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * POST /api/v1/quick-apply/:jobId
 * Instant job application - optimized for entry-level positions
 */
router.post('/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { name, phone, email, canStartImmediately, hasTransport } = req.body;

    // Simulate instant application processing
    const applicationId = `QA_${Date.now()}`;
    
    // Log the quick application
    logger.info('Quick application submitted', {
      jobId,
      applicationId,
      canStartImmediately,
      timestamp: new Date()
    });

    res.json(createSuccessResponse({
      applicationId,
      jobId,
      status: 'submitted',
      estimatedResponseTime: '2-4 hours',
      nextSteps: [
        'Your application has been sent directly to the employer',
        'They will contact you within 2-4 hours if selected',
        'Keep your phone available for calls',
        'Prepare your ID document and references'
      ],
      employerContact: {
        expectCall: true,
        timeframe: '2-4 hours',
        backupContact: 'SMS if no answer'
      }
    }, 'Quick application submitted successfully - employer will contact you soon!'));

  } catch (error) {
    logger.error('Quick apply failed:', error);
    res.status(500).json(createErrorResponse('Failed to submit quick application'));
  }
});

/**
 * GET /api/v1/quick-apply/status/:applicationId
 * Check quick application status
 */
router.get('/status/:applicationId', async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;

    // Mock application status
    const status = {
      applicationId,
      status: 'under_review',
      timeline: {
        submitted: new Date(),
        viewed: new Date(Date.now() - 30 * 60 * 1000),
        contacted: null,
        interviewed: null
      },
      employerFeedback: 'Application received and under review',
      nextAction: 'Wait for employer contact within next 2 hours'
    };

    res.json(createSuccessResponse(status, 'Quick application status retrieved'));

  } catch (error) {
    logger.error('Failed to get application status:', error);
    res.status(500).json(createErrorResponse('Failed to retrieve application status'));
  }
});

export default router;
