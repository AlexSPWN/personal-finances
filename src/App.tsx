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
    <div className='bg-gray-400 h-screen'>
      <AppRouter />
    </div>
  )
}

export default App
