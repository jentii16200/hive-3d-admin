import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // proxy request to backend
  const formData = await req.formData();
  const backendRes = await fetch("http://localhost:2701/designs/upload-images", {
    method: "POST",
    body: formData,
  });
  const data = await backendRes.json();
  return NextResponse.json(data);
}
