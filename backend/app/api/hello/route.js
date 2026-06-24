import { NextResponse } from "next/server";

// Allow the frontend (different origin/port) to call this API.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Backend: GET /api/hello
export async function GET() {
  return NextResponse.json(
    { message: "Hello World from the Next.js backend!" },
    { headers: corsHeaders }
  );
}

// Preflight support
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
