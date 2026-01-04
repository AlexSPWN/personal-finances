import { useAuth } from "./hooks/useAuth";
import { AppRouter } from "./router/AppRouter";

import "./App.css";
import { GlobalLoader } from "./components/GlobalLoader";
import { ToastProvider } from "./context/ToastProvider";
import { ToastContainer } from "./components/toast/ToastContainer";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <ToastProvider>
      <div className="bg-gray-400 h-screen">
        <AppRouter />
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;
