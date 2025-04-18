import { auth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    return <p className="text-center text-red-500">Acceso denegado. Inicia sesión.</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Bienvenido al Dashboard</h1>
    </main>
  );
}
