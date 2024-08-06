
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'  // in earlier react versions, Navigate was named Redirect
import Home from './pages/home';
import Navbar from './components/navbar';
import Revise from './pages/revise';
import TopicForm from './forms/topicForm';
import Login from './pages/login';
import Signup from './pages/signup';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const {user} = useAuthContext()
  return (
    <div className="bg-slate-50 h-screen">
      <BrowserRouter>
        <Navbar />
        <div className=''>
          <Routes>
            <Route 
              path='/'
              element = {user ? <Home /> : <Navigate to='/login' />}
            />
            <Route 
              path='/revise'
              element = {user ? <Revise /> : <Navigate to='/login' />}
            />
            <Route 
              path='/newform'
              element = {user ? <TopicForm /> : <Navigate to='/login' />}
            />
            <Route 
              path='/login'
              element = {!user ? <Login /> : <Navigate to='/' />}
            />
            <Route 
              path='/signup'
              element = {!user ? <Signup /> : <Navigate to='/' />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
