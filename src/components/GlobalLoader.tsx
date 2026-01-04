export const GlobalLoaderOld = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        zIndex: 9999,
      }}
    >
      <p>Loading...</p>
    </div>
  );
};

export const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  );
};