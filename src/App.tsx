import { useAuth } from './hooks/useAuth';
import { AppRouter } from './router/AppRouter'

import './App.css'
import { GlobalLoader } from './components/GlobalLoader';

function App() {

  const { loading } = useAuth();

  if(loading) {
    return <GlobalLoader />
  }
  
  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
