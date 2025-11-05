// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Task } from "@/models/Task";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(tasks);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, text } = body;
    if (!userId || !text) return NextResponse.json({ error: "userId and text are required" }, { status: 400 });

    await dbConnect();
    const created = await Task.create({ userId, text, done: false });
    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
