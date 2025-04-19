/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Plantilla` table. All the data in the column will be lost.
  - You are about to drop the column `estilos` on the `Plantilla` table. All the data in the column will be lost.
  - You are about to drop the column `informacion` on the `Plantilla` table. All the data in the column will be lost.
  - You are about to drop the column `negocioId` on the `Plantilla` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Plantilla` table. All the data in the column will be lost.
  - Added the required column `contenido` to the `Plantilla` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Plantilla` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plantilla" DROP CONSTRAINT "Plantilla_negocioId_fkey";

-- DropIndex
DROP INDEX "Plantilla_negocioId_idx";

-- AlterTable
ALTER TABLE "Plantilla" DROP COLUMN "createdAt",
DROP COLUMN "estilos",
DROP COLUMN "informacion",
DROP COLUMN "negocioId",
DROP COLUMN "titulo",
ADD COLUMN     "contenido" TEXT NOT NULL,
ADD COLUMN     "nombre" VARCHAR(255) NOT NULL;
