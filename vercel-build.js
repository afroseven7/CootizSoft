// vercel-build.js
const { execSync } = require("child_process");

try {
  console.log("🔁 Generando Prisma Client...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✅ Prisma Client generado exitosamente.");
} catch (e) {
  console.error("❌ Error al generar Prisma Client:", e);
  process.exit(1);
}

try {
  console.log("🚀 Ejecutando Next.js build...");
  execSync("next build", { stdio: "inherit" });
} catch (e) {
  console.error("❌ Error en Next build:", e);
  process.exit(1);
}
