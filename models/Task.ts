// models/Task.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  userId: string;
  text: string;
  done: boolean;
  createdAt: Date;
}

const TaskSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Avoid model overwrite errors in development with Next.js hot reloads
export const Task: Model<ITask> = (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>("Task", TaskSchema);
