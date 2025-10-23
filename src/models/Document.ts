// models/Document.ts
import mongoose, { Schema, model, models } from "mongoose";

const DocumentSchema = new Schema({
  name: String,
  size: Number,
  url: String,
}, { timestamps: true });

const Document = models.Document || model("Document", DocumentSchema);
export default Document;
