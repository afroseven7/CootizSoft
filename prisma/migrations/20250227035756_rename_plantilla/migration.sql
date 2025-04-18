/*
  Warnings:

  - You are about to drop the `PlantillaCotizacion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlantillaCotizacion" DROP CONSTRAINT "PlantillaCotizacion_negocioId_fkey";

-- DropTable
DROP TABLE "PlantillaCotizacion";

-- CreateTable
CREATE TABLE "Plantilla" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "informacion" TEXT NOT NULL,
    "estilos" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "idUsuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plantilla_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Plantilla_negocioId_idx" ON "Plantilla"("negocioId");

-- CreateIndex
CREATE INDEX "Plantilla_idUsuario_idx" ON "Plantilla"("idUsuario");

-- AddForeignKey
ALTER TABLE "Plantilla" ADD CONSTRAINT "Plantilla_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "Negocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
