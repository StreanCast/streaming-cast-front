export default function LoadingModal({ show }) {
  if (!show) return null; // não renderiza caso esteja oculto

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-xl">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>

        <p className="mt-4 text-gray-700 font-medium">Carregando...</p>
      </div>

    </div>
  );
}
