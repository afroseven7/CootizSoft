-- CreateTable
CREATE TABLE "PlantillaCotizacion" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "informacion" TEXT NOT NULL,
    "estilos" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "idUsuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantillaCotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlantillaCotizacion_negocioId_idx" ON "PlantillaCotizacion"("negocioId");

-- CreateIndex
CREATE INDEX "PlantillaCotizacion_idUsuario_idx" ON "PlantillaCotizacion"("idUsuario");

-- AddForeignKey
ALTER TABLE "PlantillaCotizacion" ADD CONSTRAINT "PlantillaCotizacion_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "Negocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
