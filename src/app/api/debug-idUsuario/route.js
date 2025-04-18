import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email requerido" }, { status: 400 });
  }

  const crypto = await import("crypto");
  const idUsuario = crypto.createHash("sha256").update(email).digest("hex");

  return NextResponse.json({ email, idUsuario });
}
