/**
 * 📁 FILE UPLOAD SERVICE
 * 
 * Complete file upload handling with Multer + Sharp for image processing
 */

import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { fileUploads, NewFileUpload } from '../models/schema';
import pdfParse from 'pdf-parse';

// Configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Ensure upload directories exist
const uploadDirs = [
  path.join(UPLOAD_DIR, 'images'),
  path.join(UPLOAD_DIR, 'cvs'), 
  path.join(UPLOAD_DIR, 'documents'),
  path.join(UPLOAD_DIR, 'temp')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(UPLOAD_DIR, 'temp');
    
    if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(UPLOAD_DIR, 'images');
    } else if (file.mimetype === 'application/pdf' || file.mimetype.includes('word')) {
      uploadPath = path.join(UPLOAD_DIR, 'cvs');
    } else {
      uploadPath = path.join(UPLOAD_DIR, 'documents');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase();
    cb(null, `${uniqueId}_${Date.now()}_${sanitizedName}`);
  }
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 files per upload
  }
});

export class FileUploadService {
  
  /**
   * Process uploaded file and save to database
   */
  static async processUpload(
    file: Express.Multer.File, 
    userId?: string, 
    fileType: string = 'document'
  ): Promise<any> {
    try {
      let processedData = null;
      let finalPath = file.path;

      // Process images with Sharp
      if (file.mimetype.startsWith('image/')) {
        processedData = await this.processImage(file.path);
        fileType = 'profile_image'; // Override for images
      }
      
      // Process PDF documents
      else if (file.mimetype === 'application/pdf') {
        processedData = await this.processPDF(file.path);
        fileType = fileType || 'resume';
      }

      // Save file info to database
      const newFileUpload: NewFileUpload = {
        userId: userId || null,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: finalPath,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileType,
        isProcessed: !!processedData,
        processedData,
        isPublic: fileType === 'profile_image'
      };

      const [savedFile] = await db.insert(fileUploads).values(newFileUpload).returning();

      return {
        id: savedFile.id,
        fileName: savedFile.fileName,
        originalName: savedFile.originalName,
        filePath: savedFile.filePath,
        fileSize: savedFile.fileSize,
        mimeType: savedFile.mimeType,
        fileType: savedFile.fileType,
        isProcessed: savedFile.isProcessed,
        processedData: savedFile.processedData,
        uploadedAt: savedFile.createdAt,
        downloadUrl: this.generateDownloadUrl(savedFile.id, savedFile.fileName)
      };

    } catch (error) {
      // Clean up file if processing fails
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  /**
   * Process image with Sharp (resize, optimize, generate thumbnails)
   */
  static async processImage(filePath: string): Promise<any> {
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      // Generate different sizes
      const sizes = {
        original: { width: metadata.width, height: metadata.height },
        large: { width: 1200, height: 1200 },
        medium: { width: 800, height: 800 },
        thumbnail: { width: 300, height: 300 },
        avatar: { width: 150, height: 150 }
      };

      const processedSizes: any = {};

      for (const [sizeName, dimensions] of Object.entries(sizes)) {
        if (sizeName === 'original') {
          processedSizes[sizeName] = {
            ...dimensions,
            path: filePath
          };
          continue;
        }

        const outputPath = filePath.replace(/\.[^/.]+$/, `_${sizeName}.webp`);
        
        await image
          .resize(dimensions.width, dimensions.height, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 85 })
          .toFile(outputPath);

        processedSizes[sizeName] = {
          ...dimensions,
          path: outputPath
        };
      }

      return {
        originalSize: metadata,
        processedSizes,
        format: metadata.format,
        colorSpace: metadata.space,
        hasAlpha: metadata.hasAlpha,
        processedAt: new Date()
      };

    } catch (error) {
      console.error('Image processing failed:', error);
      return null;
    }
  }

  /**
   * Process PDF document (extract text content)
   */
  static async processPDF(filePath: string): Promise<any> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);

      // Extract basic information
      const extractedData = {
        text: data.text,
        pageCount: data.numpages,
        wordCount: data.text.split(/\s+/).length,
        info: data.info,
        processedAt: new Date()
      };

      // Simple keyword extraction for resumes
      if (data.text.length > 100) {
        extractedData.keywords = this.extractResumeKeywords(data.text);
      }

      return extractedData;

    } catch (error) {
      console.error('PDF processing failed:', error);
      return null;
    }
  }

  /**
   * Extract relevant keywords from resume text
   */
  static extractResumeKeywords(text: string): string[] {
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'nodejs', 'sql', 'html', 'css',
      'angular', 'vue', 'php', 'laravel', 'django', 'mongodb', 'postgresql',
      'aws', 'azure', 'docker', 'kubernetes', 'git', 'linux', 'windows',
      'microsoft office', 'excel', 'powerpoint', 'word', 'photoshop',
      'customer service', 'sales', 'marketing', 'accounting', 'management',
      'leadership', 'communication', 'teamwork', 'problem solving'
    ];

    const textLower = text.toLowerCase();
    const foundSkills = commonSkills.filter(skill => 
      textLower.includes(skill.toLowerCase())
    );

    // Extract email addresses
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailPattern) || [];

    // Extract phone numbers (South African format)
    const phonePattern = /(?:\+27|0)[1-9]\d{8}/g;
    const phones = text.match(phonePattern) || [];

    return {
      skills: foundSkills,
      emails: emails.slice(0, 3), // Limit to 3 emails
      phones: phones.slice(0, 3), // Limit to 3 phone numbers
      hasEducation: textLower.includes('education') || textLower.includes('degree') || textLower.includes('university'),
      hasExperience: textLower.includes('experience') || textLower.includes('work') || textLower.includes('employment')
    };
  }

  /**
   * Generate download URL for file
   */
  static generateDownloadUrl(fileId: string, fileName: string): string {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/api/v1/files/download/${fileId}`;
  }

  /**
   * Get file by ID
   */
  static async getFileById(fileId: string, userId?: string): Promise<any | null> {
    const query = db.select().from(fileUploads).where(eq(fileUploads.id, fileId));
    
    // If userId provided, only return files belonging to that user or public files
    if (userId) {
      query.where(
        or(
          eq(fileUploads.userId, userId),
          eq(fileUploads.isPublic, true)
        )
      );
    } else {
      // If no userId, only return public files
      query.where(eq(fileUploads.isPublic, true));
    }

    const [file] = await query.limit(1);
    return file || null;
  }

  /**
   * Delete file
   */
  static async deleteFile(fileId: string, userId?: string): Promise<boolean> {
    try {
      const file = await this.getFileById(fileId, userId);
      if (!file) {
        return false;
      }

      // Delete physical file
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }

      // Delete associated processed files (thumbnails, etc.)
      if (file.processedData?.processedSizes) {
        Object.values(file.processedData.processedSizes).forEach((size: any) => {
          if (size.path && fs.existsSync(size.path)) {
            fs.unlinkSync(size.path);
          }
        });
      }

      // Delete from database
      await db.delete(fileUploads).where(eq(fileUploads.id, fileId));

      return true;
    } catch (error) {
      console.error('Delete file failed:', error);
      return false;
    }
  }

  /**
   * Update file metadata
   */
  static async updateFile(fileId: string, updateData: any, userId?: string): Promise<any | null> {
    const file = await this.getFileById(fileId, userId);
    if (!file) {
      return null;
    }

    const [updatedFile] = await db
      .update(fileUploads)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(fileUploads.id, fileId))
      .returning();

    return updatedFile;
  }

  /**
   * Get user files with pagination
   */
  static async getUserFiles(
    userId: string, 
    page: number = 1, 
    limit: number = 20, 
    fileType?: string
  ): Promise<any> {
    const offset = (page - 1) * limit;
    
    let query = db
      .select()
      .from(fileUploads)
      .where(eq(fileUploads.userId, userId));

    if (fileType) {
      query = query.where(eq(fileUploads.fileType, fileType));
    }

    const files = await query
      .orderBy(desc(fileUploads.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(fileUploads)
      .where(eq(fileUploads.userId, userId));

    return {
      files: files.map(file => ({
        ...file,
        downloadUrl: this.generateDownloadUrl(file.id, file.fileName)
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalFiles: totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Cleanup old temporary files
   */
  static async cleanupTempFiles(olderThanHours: number = 24): Promise<number> {
    try {
      const tempDir = path.join(UPLOAD_DIR, 'temp');
      if (!fs.existsSync(tempDir)) {
        return 0;
      }

      const files = fs.readdirSync(tempDir);
      const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Cleanup temp files failed:', error);
      return 0;
    }
  }
}

// Import missing functions from drizzle-orm
import { eq, or, desc, count } from 'drizzle-orm';
