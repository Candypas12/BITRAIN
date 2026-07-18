import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";

import DocumentModel, {
  IDocument,
} from "@/models/Document";

export class DocumentService {
  /**
   * Upload document metadata
   */
  static async createDocument(data: {
    userId?: string;
    subject: string;
    title: string;
    fileName: string;
    fileUrl: string;
    semester: number;
    category: "notes" | "pyq" | "syllabus";
  }): Promise<IDocument> {
    await connectDB();

    return DocumentModel.create({
      userId: data.userId,
      subject: data.subject,
      title: data.title,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      semester: data.semester,
      category: data.category,
    });
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(documentId: string) {
    await connectDB();

    return DocumentModel.findById(documentId);
  }

  /**
   * Get all documents
   */
  static async getAllDocuments() {
    await connectDB();

    return DocumentModel.find().sort({
      createdAt: -1,
    });
  }

  /**
   * Get semester documents
   */
  static async getSemesterDocuments(
    semester: number
  ) {
    await connectDB();

    return DocumentModel.find({
      semester,
    }).sort({
      subject: 1,
    });
  }

  /**
   * Get subject documents
   */
  static async getSubjectDocuments(
    semester: number,
    subject: string
  ) {
    await connectDB();

    return DocumentModel.find({
      semester,
      subject,
    }).sort({
      category: 1,
    });
  }

  /**
   * Get category documents
   */
  static async getCategoryDocuments(
    category: "notes" | "pyq" | "syllabus"
  ) {
    await connectDB();

    return DocumentModel.find({
      category,
    });
  }

  /**
   * Update embedding status
   */
  static async markEmbedded(
    documentId: string,
    totalChunks: number
  ) {
    await connectDB();

    return DocumentModel.findByIdAndUpdate(
      documentId,
      {
        status: "embedded",
        totalChunks,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Delete document
   */
  static async deleteDocument(
    documentId: string
  ) {
    await connectDB();

    return DocumentModel.findByIdAndDelete(
      documentId
    );
  }

  /**
   * Validate ObjectId
   */
  static isValidId(id: string) {
    return Types.ObjectId.isValid(id);
  }
}