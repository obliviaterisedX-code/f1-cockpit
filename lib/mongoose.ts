// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Mongoose connection caching for serverless environments like Vercel.
 * Reuse existing connection if available to avoid connection storm.
 */
let cached = (global as any).__mongoose;

if (!cached) {
  cached = (global as any).__mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // useNewUrlParser, useUnifiedTopology are default in newer mongoose versions;
      // keep options explicit for clarity
      bufferCommands: false,
      // other options if needed
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(m => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
