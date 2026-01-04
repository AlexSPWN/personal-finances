import { useAuth } from './hooks/useAuth';
import { AppRouter } from './router/AppRouter'

import './App.css'
import { GlobalLoader } from './components/GlobalLoader';

function App() {

  const { loading } = useAuth();
 
  return (
    <div className='bg-gray-400 h-screen'>
      { loading && <GlobalLoader/>}
      <AppRouter />
    </div>
  )
}

export default App
