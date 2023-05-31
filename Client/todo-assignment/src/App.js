import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// components-import
import Header from './components/Header'
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';


function App() {
  const [auth, setAuth] = useState(false)

  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route path='/' element={<PrivateRoute auth={auth} />} >
          <Route path='/' element={<Dashboard />} />
        </Route>

        <Route path='/login' element={<Login setAuth={setAuth} />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
