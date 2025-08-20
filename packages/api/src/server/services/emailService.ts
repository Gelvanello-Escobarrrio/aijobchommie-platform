/**
 * Email service (API package copy)
 */
import nodemailer from 'nodemailer';
import { db } from '../../config/database';
import { emailLogs, users, jobs, jobApplications } from '../../models/schema';
import { eq } from 'drizzle-orm';
import winston from 'winston';

const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

const EMAIL_CONFIG = {
  from: process.env.FROM_EMAIL || 'admin@aijobchommie.co.za',
  fromName: process.env.FROM_NAME || 'AI Job Chommie',
  replyTo: process.env.REPLY_TO_EMAIL || 'admin@aijobchommie.co.za'
};

const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  } else {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER || '', pass: process.env.GMAIL_APP_PASSWORD || '' }
    });
  }
};

export interface EmailTemplate { subject: string; html: string; text: string }

export interface JobAlertData { user: any; matchingJobs: any[]; searchCriteria: string }
export interface ApplicationNotificationData { applicant: any; job: any; application: any; employer?: any }

export class EmailService {
  static async sendJobAlert(emailData: JobAlertData): Promise<boolean> {
    try {
      const template = this.generateJobAlertTemplate(emailData);
      const success = await this.sendEmail({
        to: emailData.user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: emailData.user.id,
        templateName: 'job_alert'
      });
      if (success) logger.info(`Job alert sent to ${emailData.user.email}`);
      return success;
    } catch (error) {
      logger.error('Failed to send job alert:', error);
      return false;
    }
  }

  static async sendApplicationConfirmation(data: ApplicationNotificationData): Promise<boolean> {
    try {
      const template = this.generateApplicationConfirmationTemplate(data);
      const success = await this.sendEmail({
        to: data.applicant.email || data.application.applicantEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: data.applicant.id,
        templateName: 'application_confirmation'
      });
      if (success) logger.info(`Application confirmation sent to ${data.applicant.email}`);
      return success;
    } catch (error) {
      logger.error('Failed to send application confirmation:', error);
      return false;
    }
  }

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
        templateName: 'new_application'
      });
      if (success) logger.info(`New application notification sent to ${data.job.contactEmail}`);
      return success;
    } catch (error) {
      logger.error('Failed to send new application notification:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(user: any): Promise<boolean> {
    try {
      const template = this.generateWelcomeTemplate(user);
      const success = await this.sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        userId: user.id,
        templateName: 'welcome'
      });
      if (success) logger.info(`Welcome email sent to ${user.email}`);
      return success;
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
      return false;
    }
  }

  private static async sendEmail(emailData: {
    to: string; subject: string; html: string; text: string; userId?: string | null; templateName?: string;
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
      } as any;

      const result = await transporter.sendMail(mailOptions);

      await this.logEmail({
        userId: emailData.userId,
        template: emailData.templateName || null,
        toEmail: emailData.to,
        subject: emailData.subject,
        status: 'sent',
        metadata: { messageId: (result as any)?.messageId, response: (result as any)?.response }
      });

      return true;
    } catch (error: any) {
      await this.logEmail({
        userId: emailData.userId,
        template: emailData.templateName || null,
        toEmail: emailData.to,
        subject: emailData.subject,
        status: 'failed',
        metadata: { error: error?.message || String(error) }
      });
      logger.error('Email sending failed:', error);
      return false;
    }
  }

  private static async logEmail(logData: {
    userId?: string | null; template?: string | null; toEmail: string; subject: string; status: string; metadata?: any;
  }) {
    try {
      await db.insert(emailLogs).values({
        userId: logData.userId,
        toEmail: logData.toEmail,
        subject: logData.subject,
        template: logData.template || null,
        status: logData.status,
        metadata: logData.metadata || null
      });
    } catch (error) {
      logger.error('Failed to log email:', error);
    }
  }

  private static generateJobAlertTemplate(data: JobAlertData): EmailTemplate {
    const { user, matchingJobs } = data;
    const subject = `${matchingJobs.length} New Job${matchingJobs.length > 1 ? 's' : ''} Match Your Profile!`;
    const html = `<p>Hi ${user.firstName}, new jobs found.</p>`;
    const text = `Hi ${user.firstName}, ${matchingJobs.length} new jobs found.`;
    return { subject, html, text };
  }

  private static generateApplicationConfirmationTemplate(_: ApplicationNotificationData): EmailTemplate {
    return { subject: 'Application Submitted', html: '<p>Thanks</p>', text: 'Thanks' };
  }

  private static generateNewApplicationTemplate(_: ApplicationNotificationData): EmailTemplate {
    return { subject: 'New Application', html: '<p>New application</p>', text: 'New application' };
  }

  private static generateWelcomeTemplate(user: any): EmailTemplate {
    return { subject: `Welcome to AI Job Chommie, ${user.firstName}!`, html: '<p>Welcome</p>', text: 'Welcome' };
  }
}

