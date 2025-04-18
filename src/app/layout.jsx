import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "../components/Navbar";
import "./globals.css"; // Asegurar que Tailwind está cargado

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="bg-raisin_black text-white min-h-screen w-full">
          <Navbar />
          <main className="w-full">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
