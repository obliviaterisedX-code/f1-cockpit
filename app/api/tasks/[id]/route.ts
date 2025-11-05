// app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Task } from "@/models/Task";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json(); // e.g. { done: true, text: "new text" }
    await dbConnect();
    const task = await Task.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(task);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await dbConnect();
    const deleted = await Task.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
