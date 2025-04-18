import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Crear una nueva plantilla (POST)
export async function POST(req) {
  try {
    const body = await req.json();

    // 🔍 Validación de campos
    if (!body.nombre || !body.contenido || !body.email) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // 🔒 Encriptar el email para obtener idUsuario
    const crypto = await import("crypto");
    const idUsuario = crypto.createHash("sha256").update(body.email).digest("hex");

    // 🔥 Guardar la plantilla con predeterminada: false
    const nuevaPlantilla = await prisma.plantilla.create({
      data: {
        nombre: body.nombre,
        contenido: body.contenido,
        idUsuario,
        predeterminada: false, // ✅ Siempre inicia como false
      },
    });

    return NextResponse.json(nuevaPlantilla, { status: 201 });

  } catch (error) {
    console.error("Error guardando la plantilla:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const soloPredeterminada = searchParams.get("soloPredeterminada");

    if (!email) {
      return NextResponse.json({ message: "Email requerido" }, { status: 400 });
    }

    // 🔐 Encriptar el email para generar el idUsuario (como en todos los endpoints)
    const crypto = await import("crypto");
    const idUsuario = crypto.createHash("sha256").update(email).digest("hex");

    if (soloPredeterminada === "true") {
      // 📌 Buscar solo la plantilla predeterminada
      const predeterminada = await prisma.plantilla.findFirst({
        where: { idUsuario, predeterminada: true },
      });

      return NextResponse.json(predeterminada ? [predeterminada] : [], { status: 200 });
    }

    // 🔍 Buscar todas las plantillas del usuario
    const plantillas = await prisma.plantilla.findMany({
      where: { idUsuario },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(plantillas, { status: 200 });

  } catch (error) {
    console.error("❌ Error obteniendo plantillas:", error);
    return NextResponse.json({ message: "Error interno", error: error.message }, { status: 500 });
  }
}
// 📌 Eliminar una plantilla (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idPlantilla = searchParams.get("id");

    if (!idPlantilla) {
      return NextResponse.json({ message: "ID de plantilla requerido" }, { status: 400 });
    }

    await prisma.plantilla.delete({
      where: { id: idPlantilla },
    });

    return NextResponse.json({ message: "Plantilla eliminada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando plantilla:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

// 📌 Actualizar una plantilla (PUT)
export async function PUT(req) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ message: "ID de la plantilla es obligatorio" }, { status: 400 });
    }

    if (body.marcarPredeterminada) {
      const crypto = await import("crypto");
      const idUsuario = crypto.createHash("sha256").update(body.email).digest("hex");
    
      // 🔥 Paso 1: Desmarcar todas las plantillas del usuario
      await prisma.plantilla.updateMany({
        where: { idUsuario },
        data: { predeterminada: false },
      });
    
      // 🔥 Paso 2: Marcar solo la plantilla seleccionada como predeterminada
      await prisma.plantilla.update({
        where: { id: body.id },
        data: { predeterminada: true },
      });
    
      return NextResponse.json({ message: "Plantilla marcada como predeterminada" }, { status: 200 });
    }
    

    // ⚠ Si no es para marcar predeterminada, actualiza nombre y contenido
    const plantillaActualizada = await prisma.plantilla.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        contenido: body.contenido,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(plantillaActualizada, { status: 200 });

  } catch (error) {
    console.error("Error actualizando la plantilla:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

