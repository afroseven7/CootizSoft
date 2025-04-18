export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-raisin_black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-medium_slate_blue"></div>
          <p className="mt-4 text-lg font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }
  