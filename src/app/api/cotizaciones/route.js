import { NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email requerido" }, { status: 400 });
    }

    // 🔐 Encriptar el email para obtener el idUsuario
    const crypto = await import("crypto");
    const idUsuario = crypto.createHash("sha256").update(email).digest("hex");

    // ✅ Traer todos los clientes del usuario
    const clientes = await prisma.cliente.findMany({
      where: { idUsuario },
      orderBy: { nombre: 'asc' }
    });

    // ✅ Traer todos los productos activos del usuario
    const productos = await prisma.producto.findMany({
      where: { idUsuario, estado: true },
      orderBy: { nombre: 'asc' }
    });

    // ✅ Traer la plantilla predeterminada del usuario
    const plantilla = await prisma.plantilla.findFirst({
      where: { idUsuario, predeterminada: true }
    });

    // ✅ Traer el negocio del usuario
    const negocio = await prisma.negocio.findFirst({
      where: { idUsuario }
    });

    // ✅ Traer las cotizaciones del usuario
    const cotizaciones = await prisma.cotizacion.findMany({
      where: { idUsuario },
      include: {
        cliente: true,
        negocio: true,
        plantilla: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      clientes,
      productos,
      plantilla,
      negocio,
      cotizaciones, // 👈 añadido aquí
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error en /api/cotizaciones GET:", error);
    return NextResponse.json({ message: "Error al obtener los datos" }, { status: 500 });
  }
}

// 📌 Crear nueva cotización (POST)
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      email,
      clienteId,
      plantillaId,
      negocioId,
      productos,
      subtotal,
      iva,
      total,
      contenidoHTML,
      fechaVencimiento,
    } = body;

    // 🔍 Validación de campos obligatorios
    if (
      !email ||
      !clienteId ||
      !plantillaId ||
      !negocioId ||
      !Array.isArray(productos) ||
      productos.length === 0 ||
      subtotal == null ||
      iva == null ||
      total == null ||
      !contenidoHTML ||
      !fechaVencimiento
    ) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 🔒 Encriptar el email para generar el idUsuario
    const crypto = await import("crypto");
    const idUsuario = crypto.createHash("sha256").update(email).digest("hex");

    // 🧾 Crear cotización
    const cotizacion = await prisma.cotizacion.create({
      data: {
        clienteId,
        plantillaId,
        negocioId,
        productos,
        subtotal,
        iva,
        total,
        contenidoHTML,
        fechaVencimiento: new Date(fechaVencimiento),
        idUsuario,
      },
    });

    return NextResponse.json(cotizacion, { status: 201 });

  } catch (error) {
    console.error("❌ Error creando cotización:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}