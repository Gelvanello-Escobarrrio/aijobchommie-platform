import nodemailer from 'nodemailer';
import { db } from '../config/database';
import { emailLogs } from '../models/schema';
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

export class EmailService {
  static async sendEmail(emailData: any): Promise<boolean> {
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

      const result = await transporter.sendMail(mailOptions);

      await db.insert(emailLogs).values({
        userId: emailData.userId,
        toEmail: emailData.to,
        template: emailData.template || emailData.emailType,
        subject: emailData.subject,
        status: 'sent',
        metadata: { messageId: result.messageId, response: result.response, emailType: emailData.emailType }
      });

      return true;
    } catch (error: any) {
      try {
        await db.insert(emailLogs).values({
          userId: emailData.userId,
          toEmail: emailData.to,
          template: emailData.template || emailData.emailType,
          subject: emailData.subject,
          status: 'failed',
          metadata: { error: error.message, emailType: emailData.emailType }
        });
      } catch (e) {
        logger.error('Failed to log email:', e);
      }

      logger.error('Email sending failed:', error);
      return false;
    }
  }
}
