import mongoose, { Schema, Document as MongooseDocument, Model, Types } from "mongoose";

export interface IDocument extends MongooseDocument {
  userId?: Types.ObjectId;

  subject: string;

  title: string;

  fileName: string;

  fileUrl: string;

  fileType: "pdf";

  semester: number;

  category: "notes" | "pyq" | "syllabus";

  status: "uploaded" | "embedded";

  totalChunks: number;

  createdAt: Date;

  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["pdf"],
      default: "pdf",
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
      index: true,
    },

    category: {
      type: String,
      enum: ["notes", "pyq", "syllabus"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["uploaded", "embedded"],
      default: "uploaded",
    },

    totalChunks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.index({
  semester: 1,
  subject: 1,
});

DocumentSchema.index({
  category: 1,
});

const DocumentModel: Model<IDocument> =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);

export default DocumentModel;