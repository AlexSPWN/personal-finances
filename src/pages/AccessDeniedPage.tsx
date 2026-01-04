import { useNavigate } from "react-router";

export const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-red-600">
          Access denied
        </h1>

        <p className="text-gray-600 mb-6">
          You don’t have permission to access this page.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Go back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};