import { use, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import InitialScreen from './Components/InitialScreen'
import SignUpPageSkeleton from './GateComponents/SignUpPageSkeleton'
import SignUpPage from './GateComponents/SignUpPage';
import HomePage from './Components/HomePage';
import LoginPageSkeleton from './GateComponents/LoginPageSkeleton';
import LoginPage from './GateComponents/LoginPage';
import PostProjectSkeleton from './Components/PostProjectSkeleton';
import { GlobalStateProvider } from './Utility/GlobalStateProvider';

function App() {
  const navigate = useNavigate();
  
  return (
    <>
    <GlobalStateProvider>
        <Routes>
          <Route path="/" element={<InitialScreen />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/postproject" element={<PostProjectSkeleton />} />
        </Routes>
    </GlobalStateProvider>

    </>
  )
}

export default App
