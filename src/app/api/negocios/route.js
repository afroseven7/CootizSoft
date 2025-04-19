import { NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ message: "El email es obligatorio" }, { status: 400 });
    }

    const idUsuario = crypto.createHash("sha256").update(body.email).digest("hex");

    // 🚫 Verificar si ya existe un negocio para ese usuario
    const existe = await prisma.negocio.findFirst({ where: { idUsuario } });
    if (existe) {
      return NextResponse.json({ message: "Este usuario ya tiene un negocio registrado" }, { status: 400 });
    }

    const nuevoNegocio = await prisma.negocio.create({
      data: {
        idUsuario,
        nombre: body.nombre,
        identificacion: body.identificacion,
        direccion: body.direccion || null,
        ciudad: body.ciudad,
        telefono: body.telefono,
        email: body.email,
        logo: body.logo?.startsWith("http") ? body.logo : null,
      },
    });

    return NextResponse.json({ message: "Negocio creado exitosamente", negocio: nuevoNegocio }, { status: 201 });
  } catch (error) {
    console.error("Error creando negocio:", error);
    return NextResponse.json({ message: "Error al crear el negocio", error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ message: "Email requerido" }, { status: 400 });
    }

    const idUsuario = crypto.createHash("sha256").update(body.email).digest("hex");

    const negocioActualizado = await prisma.negocio.updateMany({
      where: { idUsuario },
      data: {
        nombre: body.nombre,
        identificacion: body.identificacion,
        direccion: body.direccion || null,
        ciudad: body.ciudad,
        telefono: body.telefono,
        logo: body.logo?.startsWith("http") ? body.logo : null,
      },
    });

    return NextResponse.json({ message: "Negocio actualizado correctamente", negocio: negocioActualizado }, { status: 200 });
  } catch (error) {
    console.error("Error actualizando negocio:", error);
    return NextResponse.json({ message: "Error al actualizar el negocio", error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email requerido" }, { status: 400 });
    }

    const idUsuario = crypto.createHash("sha256").update(email).digest("hex");

    const negocio = await prisma.negocio.findFirst({
      where: { idUsuario },
    });

    if (!negocio) {
      return NextResponse.json({ message: "Negocio no encontrado" }, { status: 404 });
    }

    return NextResponse.json(negocio, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo negocio:", error);
    return NextResponse.json({ message: "Error interno", error: error.message }, { status: 500 });
  }
}
