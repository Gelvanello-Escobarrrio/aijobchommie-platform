/**
 *  EMAIL NOTIFICATION SERVICE
 * 
 * Comprehensive email service for AI Job Chommie platform
 * Handles job alerts, application notifications, and system emails
 */

import nodemailer from 'nodemailer';
import { db } from '../config/database';
import { emailLogs, users, jobs, jobApplications } from '../models/schema';
import { eq } from 'drizzle-orm';
import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.FROM_EMAIL || 'admin@aijobchommie.co.za',
  fromName: process.env.FROM_NAME || 'AI Job Chommie',
  replyTo: process.env.REPLY_TO_EMAIL || 'admin@aijobchommie.co.za'
};

// Create email transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email service (SendGrid, Mailgun, etc.)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development - use Gmail or local testing
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_APP_PASSWORD || ''
      }
    });
  }
};

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface JobAlertData {
  user: any;
  matchingJobs: any[];
  searchCriteria: string;
}

export interface ApplicationNotificationData {
  applicant: any;
  job: any;
  application: any;
  employer?: any;
}

/**
 * Email Service Class
 */
export class EmailService {
  
  /**
   * Send job alert email to users
   */
  static async sendJobAlert(emailData: JobAlertData): Promise<boolean> {
    try {
      const template = this.generateJobAlertTemplate(emailData);
      
      const success = await this.sendEmail({
        to: emailData.user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: emailData.user.id,
        emailType: 'job_alert'
      });

      if (success) {
        logger.info(` Job alert sent to ${emailData.user.email}`);
      }

      return success;
    } catch (error) {
      logger.error('Failed to send job alert:', error);
      return false;
    }
  }

  /**
   * Send application confirmation to job seeker
   */
  static async sendApplicationConfirmation(data: ApplicationNotificationData): Promise<boolean> {
    try {
      const template = this.generateApplicationConfirmationTemplate(data);
      
      const success = await this.sendEmail({
        to: data.applicant.email || data.application.applicantEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: data.applicant.id,
        emailType: 'application_confirmation'
      });

      if (success) {
        logger.info(` Application confirmation sent to ${data.applicant.email}`);
      }

      return success;
    } catch (error) {
      logger.error('Failed to send application confirmation:', error);
      return false;
    }
  }

  /**
   * Send new application notification to employer
   */
  static async sendNewApplicationNotification(data: ApplicationNotificationData): Promise<boolean> {
    try {
      if (!data.job.contactEmail) {
        logger.warn('No employer email available for job:', data.job.id);
        return false;
      }

      const template = this.generateNewApplicationTemplate(data);
      
      const success = await this.sendEmail({
        to: data.job.contactEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: null,
        emailType: 'new_application'
      });

      if (success) {
        logger.info(` New application notification sent to ${data.job.contactEmail}`);
      }

      return success;
    } catch (error) {
      logger.error('Failed to send new application notification:', error);
      return false;
    }
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(user: any): Promise<boolean> {
    try {
      const template = this.generateWelcomeTemplate(user);
      
      const success = await this.sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: user.id,
        emailType: 'welcome'
      });

      if (success) {
        logger.info(` Welcome email sent to ${user.email}`);
      }

      return success;
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(user: any, resetToken: string): Promise<boolean> {
    try {
      const template = this.generatePasswordResetTemplate(user, resetToken);
      
      const success = await this.sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: user.id,
        emailType: 'password_reset'
      });

      if (success) {
        logger.info(` Password reset email sent to ${user.email}`);
      }

      return success;
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Send application status update
   */
  static async sendApplicationStatusUpdate(
    application: any, 
    newStatus: string, 
    message?: string
  ): Promise<boolean> {
    try {
      const template = this.generateStatusUpdateTemplate(application, newStatus, message);
      
      const success = await this.sendEmail({
        to: application.applicantEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: application.userId,
        emailType: 'status_update'
      });

      if (success) {
        logger.info(` Status update sent to ${application.applicantEmail}`);
      }

      return success;
    } catch (error) {
      logger.error('Failed to send status update:', error);
      return false;
    }
  }

  /**
   * Core email sending function
   */
  private static async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
    userId?: string | null;
    emailType: string;
  }): Promise<boolean> {
    try {
      const transporter = createTransporter();

      const mailOptions = {
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
        to: emailData.to,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      };

      // Send email
      const result = await transporter.sendMail(mailOptions);
      
      // Log email
      await this.logEmail({
        userId: emailData.userId,
        emailType: emailData.emailType,
        recipientEmail: emailData.to,
        subject: emailData.subject,
        status: 'sent',
        metadata: {
          messageId: result.messageId,
          response: result.response
        }
      });

      return true;
    } catch (error) {
      // Log failed email
      await this.logEmail({
        userId: emailData.userId,
        emailType: emailData.emailType,
        recipientEmail: emailData.to,
        subject: emailData.subject,
        status: 'failed',
        metadata: {
          error: error.message
        }
      });

      logger.error('Email sending failed:', error);
      return false;
    }
  }

  /**
   * Log email in database
   */
  private static async logEmail(logData: {
    userId?: string | null;
    emailType: string;
    recipientEmail: string;
    subject: string;
    status: string;
    metadata?: any;
  }) {
    try {
      await db.insert(emailLogs).values({
        userId: logData.userId,
        emailType: logData.emailType,
        recipientEmail: logData.recipientEmail,
        subject: logData.subject,
        status: logData.status,
        metadata: logData.metadata
      });
    } catch (error) {
      logger.error('Failed to log email:', error);
    }
  }

  /**
   * Generate job alert email template
   */
  private static generateJobAlertTemplate(data: JobAlertData): EmailTemplate {
    const { user, matchingJobs, searchCriteria } = data;
    
    const subject = ` ${matchingJobs.length} New Job${matchingJobs.length > 1 ? 's' : ''} Match Your Profile!`;

    const jobListHtml = matchingJobs.map(jobMatch => `
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f9f9f9;">
        <h3 style="color: #2c3e50; margin: 0 0 8px 0;">${jobMatch.job.title}</h3>
        <p style="color: #7f8c8d; margin: 0 0 8px 0; font-size: 14px;">
          <strong>${jobMatch.job.company}</strong> • ${jobMatch.job.location}
        </p>
        <p style="color: #27ae60; margin: 0 0 8px 0; font-weight: bold;">
          R${jobMatch.job.salaryMin?.toLocaleString() || 'TBC'} - R${jobMatch.job.salaryMax?.toLocaleString() || 'TBC'}/month
        </p>
        <p style="color: #34495e; margin: 0 0 12px 0; font-size: 14px;">
          ${jobMatch.job.description.substring(0, 150)}...
        </p>
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          ${jobMatch.job.isUrgent ? '<span style="background: #e74c3c; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">URGENT</span>' : ''}
          ${jobMatch.job.noExperienceRequired ? '<span style="background: #3498db; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">NO EXPERIENCE</span>' : ''}
        </div>
        <p style="color: #8e44ad; margin: 0 0 12px 0; font-style: italic; font-size: 13px;">
          AI Match: ${Math.round(jobMatch.matchScore * 100)}% • ${jobMatch.matchReason}
        </p>
        <a href="https://aijobchommie.co.za/jobs/${jobMatch.job.id}" 
           style="background: #27ae60; color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; display: inline-block;">
          View Job & Apply
        </a>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Job Alert - AI Job Chommie</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin: 0;"> AI Job Chommie</h1>
            <p style="color: #7f8c8d; margin: 5px 0 0 0;">Your AI-Powered Job Search Assistant</p>
          </div>
          
          <h2 style="color: #27ae60;">Hi ${user.firstName}! </h2>
          
          <p>Great news! We found <strong>${matchingJobs.length} new job${matchingJobs.length > 1 ? 's' : ''}</strong> 
          that match your profile and preferences:</p>
          
          ${jobListHtml}
          
          <div style="background: #ecf0f1; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2c3e50;">
              <strong> Pro Tip:</strong> Jobs marked as "URGENT" typically have faster hiring processes. 
              Apply quickly to increase your chances!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://aijobchommie.co.za/jobs" 
               style="background: #3498db; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">
              View All Jobs
            </a>
            <a href="https://aijobchommie.co.za/profile" 
               style="background: #95a5a6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold; margin-left: 10px;">
              Update Profile
            </a>
          </div>
          
          <hr style="border: none; height: 1px; background: #ecf0f1; margin: 30px 0;">
          
          <div style="text-align: center; color: #7f8c8d; font-size: 12px;">
            <p>You're receiving this because you signed up for job alerts.</p>
            <p>
              <a href="https://aijobchommie.co.za/unsubscribe" style="color: #3498db;">Unsubscribe</a> | 
              <a href="https://aijobchommie.co.za/settings" style="color: #3498db;">Email Preferences</a>
            </p>
            <p> 2025 AI Job Chommie • Empowering South African Job Seekers</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${user.firstName}!

Great news! We found ${matchingJobs.length} new jobs that match your profile:

${matchingJobs.map(jobMatch => `
${jobMatch.job.title} at ${jobMatch.job.company}
Location: ${jobMatch.job.location}
Salary: R${jobMatch.job.salaryMin?.toLocaleString()} - R${jobMatch.job.salaryMax?.toLocaleString()}/month
AI Match: ${Math.round(jobMatch.matchScore * 100)}%

${jobMatch.job.description.substring(0, 200)}...

Apply now: https://aijobchommie.co.za/jobs/${jobMatch.job.id}
`).join('\n---\n')}

View all jobs: https://aijobchommie.co.za/jobs
Update your profile: https://aijobchommie.co.za/profile

Best regards,
AI Job Chommie Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate application confirmation template
   */
  private static generateApplicationConfirmationTemplate(data: ApplicationNotificationData): EmailTemplate {
    const { applicant, job, application } = data;
    
    const subject = ` Application Submitted: ${job.title} at ${job.company}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #27ae60;"> Application Submitted Successfully!</h1>
          </div>
          
          <h2>Hi ${application.applicantName}!</h2>
          
          <p>Your job application has been successfully submitted. Here are the details:</p>
          
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">${job.title}</h3>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Application ID:</strong> ${application.trackingNumber}</p>
            <p><strong>Applied on:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <h3>What happens next?</h3>
          <ul>
            <li>Your application will be reviewed by the hiring team</li>
            <li>You'll receive updates via email if your status changes</li>
            <li>Keep your phone available - employers may call directly</li>
            <li>Continue applying to other positions to increase your chances</li>
          </ul>
          
          <div style="background: #e8f5e8; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2c3e50;">
              <strong> Pro Tip:</strong> Check your email regularly and keep your phone nearby. 
              Many South African employers prefer calling applicants directly!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://aijobchommie.co.za/applications" 
               style="background: #3498db; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
              Track Your Applications
            </a>
          </div>
          
          <hr style="border: none; height: 1px; background: #ecf0f1; margin: 30px 0;">
          
          <div style="text-align: center; color: #7f8c8d; font-size: 12px;">
            <p> 2025 AI Job Chommie • Good luck with your application! </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${application.applicantName}!

Your job application has been successfully submitted:

Job: ${job.title} at ${job.company}
Location: ${job.location}
Application ID: ${application.trackingNumber}
Applied on: ${new Date().toLocaleDateString()}

What happens next?
- Your application will be reviewed by the hiring team
- You'll receive email updates if your status changes
- Keep your phone available - employers may call directly
- Continue applying to other positions

Track your applications: https://aijobchommie.co.za/applications

Good luck!
AI Job Chommie Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate new application notification for employers
   */
  private static generateNewApplicationTemplate(data: ApplicationNotificationData): EmailTemplate {
    const { applicant, job, application } = data;
    
    const subject = `New Application: ${job.title} - ${application.applicantName}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h1 style="color: #2c3e50;">New Job Application Received</h1>
          
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Application Details</h3>
            <p><strong>Position:</strong> ${job.title}</p>
            <p><strong>Applicant:</strong> ${application.applicantName}</p>
            <p><strong>Email:</strong> ${application.applicantEmail}</p>
            <p><strong>Phone:</strong> ${application.applicantPhone}</p>
            <p><strong>Application ID:</strong> ${application.trackingNumber}</p>
            <p><strong>Applied on:</strong> ${new Date(application.appliedAt).toLocaleDateString()}</p>
          </div>
          
          ${application.coverLetter ? `
          <div style="background: #f0f8ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2c3e50; margin-top: 0;">Cover Letter:</h4>
            <p style="white-space: pre-wrap;">${application.coverLetter}</p>
          </div>
          ` : ''}
          
          <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>Quick Response Tip:</strong> Candidates appreciate quick responses. 
              Consider calling or emailing within 24-48 hours for the best candidates.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p>Contact the applicant directly:</p>
            <a href="mailto:${application.applicantEmail}" 
               style="background: #27ae60; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; margin-right: 10px;">
              Email Applicant
            </a>
            <a href="tel:${application.applicantPhone}" 
               style="background: #3498db; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px;">
              Call Applicant
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
New Job Application Received

Position: ${job.title}
Applicant: ${application.applicantName}
Email: ${application.applicantEmail}
Phone: ${application.applicantPhone}
Applied on: ${new Date(application.appliedAt).toLocaleDateString()}

${application.coverLetter ? `Cover Letter:\n${application.coverLetter}\n\n` : ''}

Contact the applicant directly to schedule an interview.

AI Job Chommie Platform
    `;

    return { subject, html, text };
  }

  /**
   * Generate welcome email template
   */
  private static generateWelcomeTemplate(user: any): EmailTemplate {
    const subject = `Welcome to AI Job Chommie, ${user.firstName}! `;

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #27ae60;"> Welcome to AI Job Chommie!</h1>
            <p style="color: #7f8c8d;">Your AI-Powered Career Journey Starts Here</p>
          </div>
          
          <h2>Hi ${user.firstName}! </h2>
          
          <p>Welcome to South Africa's most intelligent job search platform! We're excited to help you find your perfect job match.</p>
          
          <h3> Get Started in 3 Easy Steps:</h3>
          <ol>
            <li><strong>Complete Your Profile</strong> - Add your skills, experience, and preferences</li>
            <li><strong>Let AI Find Matches</strong> - Our smart algorithm will find jobs that fit you perfectly</li>
            <li><strong>Apply with One Click</strong> - Quick applications to get you noticed faster</li>
          </ol>
          
          <div style="background: #e8f5e8; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2c3e50; margin-top: 0;"> Why AI Job Chommie?</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Focus on entry-level and general worker positions</li>
              <li>South African companies actively hiring</li>
              <li>AI-powered job matching</li>
              <li>Free to use, always</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://aijobchommie.co.za/profile/complete" 
               style="background: #27ae60; color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; display: inline-block; font-weight: bold;">
              Complete Your Profile
            </a>
          </div>
          
          <div style="background: #f0f8ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2c3e50; margin-top: 0;"> Need Help?</h4>
            <p style="margin: 0;">Our team is here to support you:</p>
            <p style="margin: 5px 0 0 0;">
              Email: support@aijobchommie.co.za<br>
              WhatsApp: +27 60 123 4567
            </p>
          </div>
          
          <hr style="border: none; height: 1px; background: #ecf0f1; margin: 30px 0;">
          
          <div style="text-align: center; color: #7f8c8d; font-size: 12px;">
            <p> 2025 AI Job Chommie • Empowering South African Job Seekers</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${user.firstName}!

Welcome to AI Job Chommie - South Africa's most intelligent job search platform!

Get Started in 3 Easy Steps:
1. Complete Your Profile - Add your skills, experience, and preferences
2. Let AI Find Matches - Our smart algorithm will find jobs that fit you perfectly  
3. Apply with One Click - Quick applications to get you noticed faster

Why AI Job Chommie?
- Focus on entry-level and general worker positions
- South African companies actively hiring
- AI-powered job matching
- Free to use, always

Complete your profile: https://aijobchommie.co.za/profile/complete

Need help? 
Email: support@aijobchommie.co.za
WhatsApp: +27 60 123 4567

Welcome to your career journey!
AI Job Chommie Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate password reset email template
   */
  private static generatePasswordResetTemplate(user: any, resetToken: string): EmailTemplate {
    const subject = 'Reset Your AI Job Chommie Password';
    const resetUrl = `https://aijobchommie.co.za/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h1 style="color: #2c3e50;">Password Reset Request</h1>
          
          <p>Hi ${user.firstName},</p>
          
          <p>We received a request to reset your password for your AI Job Chommie account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #e74c3c; color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Your Password
            </a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">${resetUrl}</p>
          
          <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>Security Notice:</strong> This link expires in 1 hour. 
              If you didn't request this reset, please ignore this email.
            </p>
          </div>
          
          <p>Best regards,<br>AI Job Chommie Team</p>
        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${user.firstName},

We received a request to reset your password for your AI Job Chommie account.

Reset your password: ${resetUrl}

This link expires in 1 hour. If you didn't request this reset, please ignore this email.

Best regards,
AI Job Chommie Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate status update email template
   */
  private static generateStatusUpdateTemplate(
    application: any, 
    newStatus: string, 
    message?: string
  ): EmailTemplate {
    const statusMessages = {
      reviewing: 'Your application is being reviewed',
      interviewed: 'Congratulations! You\'ve been selected for an interview',
      rejected: 'Application status update',
      accepted: 'Congratulations! You\'ve been selected for the position'
    };

    const subject = `Application Update: ${statusMessages[newStatus] || 'Status Changed'}`;

    const statusColors = {
      reviewing: '#3498db',
      interviewed: '#f39c12', 
      rejected: '#e74c3c',
      accepted: '#27ae60'
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h1 style="color: ${statusColors[newStatus] || '#2c3e50'};">Application Status Update</h1>
          
          <p>Hi ${application.applicantName},</p>
          
          <p>We have an update regarding your application:</p>
          
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Position:</strong> ${application.job?.title || 'Job Position'}</p>
            <p><strong>Company:</strong> ${application.job?.company || 'Company'}</p>
            <p><strong>Application ID:</strong> ${application.trackingNumber}</p>
            <p><strong>New Status:</strong> 
              <span style="color: ${statusColors[newStatus] || '#2c3e50'}; font-weight: bold; text-transform: capitalize;">
                ${newStatus.replace('_', ' ')}
              </span>
            </p>
          </div>
          
          ${message ? `
          <div style="background: #f0f8ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2c3e50; margin-top: 0;">Message from Employer:</h4>
            <p style="margin: 0;">${message}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://aijobchommie.co.za/applications" 
               style="background: #3498db; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
              View All Applications
            </a>
          </div>
          
          <p>Keep applying to increase your chances of success!</p>
          
          <p>Best regards,<br>AI Job Chommie Team</p>
        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${application.applicantName},

Application Status Update:

Position: ${application.job?.title || 'Job Position'}
Company: ${application.job?.company || 'Company'}
Application ID: ${application.trackingNumber}
New Status: ${newStatus.replace('_', ' ').toUpperCase()}

${message ? `Message from Employer: ${message}` : ''}

View all applications: https://aijobchommie.co.za/applications

Keep applying to increase your chances of success!

Best regards,
AI Job Chommie Team
    `;

    return { subject, html, text };
  }
}
