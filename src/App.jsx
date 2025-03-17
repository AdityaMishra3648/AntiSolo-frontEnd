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
import LoginPage from './GateComponents/LoginPage';
import PostProjectSkeleton from './Components/PostProjectSkeleton';
import { GlobalStateProvider } from './Utility/GlobalStateProvider';
import ProfilePage from './Components/ProfilePage';
import ProjectPage from './Components/ProjectPage';
import EditProfilePage from './Components/EditProfilePage';
import EntryPage from './GateComponents/EntryPage';

function App() {
  const navigate = useNavigate();
  
  return (
    <>
    <GlobalStateProvider>
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/postproject" element={<PostProjectSkeleton />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/projectInfo/:projectId" element={<ProjectPage />} />
          <Route path="/editProfile" element={<EditProfilePage />} />
        </Routes>
    </GlobalStateProvider>

    </>
  )
}

export default App
