"use client";

export default function VerDetalleCotizacion({ visible, onClose, htmlContenido }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg w-[840px] max-h-[95vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
        >
          Cerrar
        </button>

        <div
          className="mt-10 p-4 mx-auto"
          style={{
            backgroundColor: "white",
            color: "black",
            width: "794px", // tamaño A4 en px a 96dpi
            minHeight: "1123px", // tamaño A4 en px a 96dpi
            fontSize: "16px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
          dangerouslySetInnerHTML={{ __html: htmlContenido }}
        />
      </div>
    </div>
  );
}
