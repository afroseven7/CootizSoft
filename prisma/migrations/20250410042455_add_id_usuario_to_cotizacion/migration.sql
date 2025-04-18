/*
  Warnings:

  - Added the required column `idUsuario` to the `Cotizacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cotizacion" ADD COLUMN     "idUsuario" TEXT NOT NULL;
