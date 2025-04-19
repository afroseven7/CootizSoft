// src/app/api/facturada/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("📦 Body recibido:", body); // ✅ LOG CLAVE

    const { email, idCotizacion, facturada } = body;

    if (!email || !idCotizacion || typeof facturada !== "boolean") {
      console.warn("❌ Body inválido:", { email, idCotizacion, facturada });
      return NextResponse.json(
        { message: "Faltan campos requeridos o formato inválido" },
        { status: 400 }
      );
    }

    const idUsuario = crypto.createHash("sha256").update(email).digest("hex");

    const updated = await prisma.cotizacion.updateMany({
      where: {
        id: idCotizacion,
        idUsuario,
      },
      data: {
        facturada,
      },
    });

    return NextResponse.json({ message: "Estado actualizado", updated }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en el backend:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
