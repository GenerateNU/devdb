// app/api/routs.ts 👈🏽

import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET() {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// To handle a POST request to /api
export async function POST() {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// Same logic to add a `PATCH`, `DELETE`...
