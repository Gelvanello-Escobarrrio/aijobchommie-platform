/**
 *  FILE UPLOAD SERVICE
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database';
import { fileUploads, NewFileUpload } from '../../models/schema';
import pdfParse from 'pdf-parse';
import sharp from 'sharp';
import { Request } from 'express';
import multer from 'multer';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760');

const uploadDirs = [ path.join(UPLOAD_DIR, 'images'), path.join(UPLOAD_DIR, 'cvs'), path.join(UPLOAD_DIR, 'documents'), path.join(UPLOAD_DIR, 'temp') ];
uploadDirs.forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });

const storage = multer.diskStorage({ destination: (req, file, cb) => { let uploadPath = path.join(UPLOAD_DIR, 'temp'); if (file.mimetype.startsWith('image/')) uploadPath = path.join(UPLOAD_DIR, 'images'); else if (file.mimetype === 'application/pdf' || file.mimetype.includes('word')) uploadPath = path.join(UPLOAD_DIR, 'cvs'); else uploadPath = path.join(UPLOAD_DIR, 'documents'); cb(null, uploadPath); }, filename: (req, file, cb) => { const uniqueId = uuidv4(); const extension = path.extname(file.originalname); const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase(); cb(null, `${uniqueId}_${Date.now()}_${sanitizedName}`); } });

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true); else cb(new Error(`File type ${file.mimetype} is not allowed.`));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE, files: 5 } });

export class FileUploadService {
  static async processUpload(file: Express.Multer.File, userId?: string, fileType: string = 'document'): Promise<any> {
    try {
      let processedData = null;
      let finalPath = file.path;

      if (file.mimetype.startsWith('image/')) { processedData = await this.processImage(file.path); fileType = 'profile_image'; }
      else if (file.mimetype === 'application/pdf') { processedData = await this.processPDF(file.path); fileType = fileType || 'resume'; }

      const newFileUpload: NewFileUpload = { userId: userId || null, fileName: file.filename, originalName: file.originalname, filePath: finalPath, fileSize: file.size, mimeType: file.mimetype, fileType, isProcessed: !!processedData, processedData, isPublic: fileType === 'profile_image' } as any;

      const [savedFile] = await db.insert(fileUploads).values(newFileUpload).returning();

      return { id: savedFile.id, fileName: savedFile.fileName, originalName: savedFile.originalName, filePath: savedFile.filePath, fileSize: savedFile.fileSize, mimeType: savedFile.mimeType, fileType: savedFile.fileType, isProcessed: savedFile.isProcessed, processedData: savedFile.processedData, uploadedAt: savedFile.createdAt, downloadUrl: this.generateDownloadUrl(savedFile.id, savedFile.fileName) };
    } catch (error) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw error;
    }
  }

  static async processImage(filePath: string): Promise<any> {
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();
      const sizes: any = { original: { width: metadata.width, height: metadata.height }, large: { width: 1200, height: 1200 }, medium: { width: 800, height: 800 }, thumbnail: { width: 300, height: 300 }, avatar: { width: 150, height: 150 } };
      const processedSizes: any = {};
      for (const [sizeName, dimensions] of Object.entries(sizes)) {
        const dims = dimensions as { width?: number; height?: number };
        if (sizeName === 'original') {
          processedSizes[sizeName] = { width: dims.width, height: dims.height, path: filePath };
          continue;
        }

        const outputPath = filePath.replace(/\.[^/.]+$/, `_${sizeName}.webp`);
        await image.resize(dims.width || undefined, dims.height || undefined, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toFile(outputPath);
        processedSizes[sizeName] = { width: dims.width, height: dims.height, path: outputPath };
      }
      return { originalSize: metadata, processedSizes, format: metadata.format, colorSpace: metadata.space, hasAlpha: metadata.hasAlpha, processedAt: new Date() };
    } catch (error) { console.error('Image processing failed:', error); return null; }
  }

  static async processPDF(filePath: string): Promise<any> { try { const dataBuffer = fs.readFileSync(filePath); const data = await pdfParse(dataBuffer); const extractedData: any = { text: data.text, pageCount: data.numpages, wordCount: data.text.split(/\s+/).length, info: data.info, processedAt: new Date() }; if (data.text.length > 100) extractedData.keywords = this.extractResumeKeywords(data.text); return extractedData; } catch (error) { console.error('PDF processing failed:', error); return null; } }

  static extractResumeKeywords(text: string): any {
    const commonSkills = ['javascript','python','java','react','nodejs','sql','html','css','aws','docker','kubernetes','git'];
    const textLower = text.toLowerCase(); const foundSkills = commonSkills.filter(skill => textLower.includes(skill)); const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g; const emails = text.match(emailPattern) || []; const phonePattern = /(?:\+27|0)[1-9]\d{8}/g; const phones = text.match(phonePattern) || [];
    return { skills: foundSkills, emails: emails.slice(0,3), phones: phones.slice(0,3), hasEducation: textLower.includes('education') || textLower.includes('degree') || textLower.includes('university'), hasExperience: textLower.includes('experience') || textLower.includes('work') || textLower.includes('employment') };
  }

  static generateDownloadUrl(fileId: string, fileName: string): string { const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001'; return `${baseUrl}/api/v1/files/download/${fileId}`; }

  static async getFileById(fileId: string, userId?: string): Promise<any | null> { const [file] = await db.select().from(fileUploads).where(eq(fileUploads.id, fileId)).limit(1); return file || null; }

  static async deleteFile(fileId: string, userId?: string): Promise<boolean> { try { const file = await this.getFileById(fileId, userId); if (!file) return false; if (fs.existsSync(file.filePath)) fs.unlinkSync(file.filePath); if (file.processedData?.processedSizes) { Object.values(file.processedData.processedSizes).forEach((size: any) => { if (size.path && fs.existsSync(size.path)) fs.unlinkSync(size.path); }); } await db.delete(fileUploads).where(eq(fileUploads.id, fileId)); return true; } catch (error) { console.error('Delete file failed:', error); return false; } }

  static async updateFile(fileId: string, updateData: any, userId?: string): Promise<any | null> { const file = await this.getFileById(fileId, userId); if (!file) return null; const [updatedFile] = await db.update(fileUploads).set({ ...updateData, updatedAt: new Date() }).where(eq(fileUploads.id, fileId)).returning(); return updatedFile; }

  static async getUserFiles(userId: string, page: number = 1, limit: number = 20, fileType?: string): Promise<any> {
    const offset = (page - 1) * limit;
    let selectQuery = db.select().from(fileUploads) as any;
    selectQuery = selectQuery.where(eq(fileUploads.userId, userId));
    if (fileType) selectQuery = selectQuery.where(eq(fileUploads.fileType, fileType));
    const files = await selectQuery.orderBy(desc(fileUploads.createdAt)).limit(limit).offset(offset);
    const [{ totalCount }] = await db.select({ totalCount: count() }).from(fileUploads).where(eq(fileUploads.userId, userId));
    return {
      files: files.map((file: any) => ({ ...file, downloadUrl: this.generateDownloadUrl(file.id, file.fileName) })),
      pagination: { currentPage: page, totalPages: Math.ceil(totalCount / limit), totalFiles: totalCount, hasNextPage: page < Math.ceil(totalCount / limit), hasPrevPage: page > 1 }
    };
  }

  static async cleanupTempFiles(olderThanHours: number = 24): Promise<number> { try { const tempDir = path.join(UPLOAD_DIR, 'temp'); if (!fs.existsSync(tempDir)) return 0; const files = fs.readdirSync(tempDir); const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000); let deletedCount = 0; for (const file of files) { const filePath = path.join(tempDir, file); const stats = fs.statSync(filePath); if (stats.mtime.getTime() < cutoffTime) { fs.unlinkSync(filePath); deletedCount++; } } return deletedCount; } catch (error) { console.error('Cleanup temp files failed:', error); return 0; } }
}

// Import missing functions from drizzle-orm used above
import { eq, desc, count } from 'drizzle-orm';
