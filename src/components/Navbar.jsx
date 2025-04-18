"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  const linkClass =
    "relative text-white hover:text-medium_slate_blue transition-all duration-200";

  const underline = `
    after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 
    after:bg-medium_slate_blue group-hover:after:w-full after:transition-all after:duration-300
  `;

  return (
    <nav className="bg-jet shadow-md py-4 px-6 md:px-8 w-full animate-fade-in z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Sección izquierda (Logo + Enlaces) */}
        <div className="flex items-center gap-6 flex-wrap">
          <Link
            href="/"
            className="text-medium_slate_blue text-2xl font-bold hover:text-majorelle_blue transition-all"
          >
            CootizSoft
          </Link>

          {!isSignedIn && (
            <Link href="/about" className={`${linkClass} group ${underline}`}>
              Sobre Nosotros
            </Link>
          )}

          {isSignedIn && (
            <>
              <Link href="/productos" className={`${linkClass} group ${underline}`}>
                Productos
              </Link>
              <Link href="/clientes" className={`${linkClass} group ${underline}`}>
                Clientes
              </Link>
              <Link href="/mi-negocio" className={`${linkClass} group ${underline}`}>
                Mi Negocio
              </Link>
              <Link href="/plantillas" className={`${linkClass} group ${underline}`}>
                Plantillas
              </Link>
              <Link href="/cotizaciones" className={`${linkClass} group ${underline}`}>
                Cotizar
              </Link>
              <Link href="/mis-cotizaciones" className={`${linkClass} group ${underline}`}>
                Mis Cotizaciones
              </Link>
            </>
          )}
        </div>

        {/* Sección derecha (Auth) */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <SignInButton>
                <button className="px-4 py-2 bg-medium_slate_blue text-white rounded-lg hover:bg-majorelle_blue transition-all">
                  Iniciar Sesión
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-4 py-2 bg-majorelle_blue text-white rounded-lg hover:bg-medium_slate_blue transition-all">
                  Registrarse
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
