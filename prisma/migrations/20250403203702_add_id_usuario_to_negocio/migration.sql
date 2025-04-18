/*
  Warnings:

  - Added the required column `idUsuario` to the `Negocio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Negocio" ADD COLUMN     "idUsuario" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Negocio_idUsuario_idx" ON "Negocio"("idUsuario");
