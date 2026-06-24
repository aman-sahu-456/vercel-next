import { NextResponse } from "next/server";
import { corsHeaders } from "../../../lib/cors";

// Backend: GET /api/hello
export async function GET(request) {
  return NextResponse.json(
    { message: "Hello World from the Next.js backend!" },
    { headers: corsHeaders(request) }
  );
}

// Preflight support
export async function OPTIONS(request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}
