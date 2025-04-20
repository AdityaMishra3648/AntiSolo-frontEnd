import { use, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoadingPage from './Components/LoadingPage'
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
import NotificationPage from './Components/NotificationPage';
import { useLocation } from "react-router-dom";
// import FriendsPage from './ChattingComponents/FriendsPage';
import Chat from './ChattingComponents/Chat';
import SearchedUsers from './Components/SeachedUsers';
import NavBar from './Components/NavBar';
// import { BrowserRouter } from 'react-router-dom';
import HomepageContent from './Components/HomepageContent';
import Notifications from './Components/Notifications';
import ProjectChat from './ChattingComponents/ProjectChat';
import PostProject from './Components/PostProject';
import ChattingPage from './ChattingComponents/ChattingPage'
import PrivateChat from './ChattingComponents/PrivateChat'
import GroupChat from './ChattingComponents/GroupChat'
import AdminPage from './AdminComponents/AdminPage';
import Project from './ProjectPages/Project'
import EditProject from './ProjectPages/EditProject'
import UserProfile from './UserPages/UserProfile'
import EditProfile from './UserPages/EditProfile'
import FriendsPage from './UserPages/FriendsPage';
import ForgotPassword from './GateComponents/ForgotPassword'

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const hideNavbarRoutes = ["/", "/login", "/signup"];

  return (
    <>
    <GlobalStateProvider>
      {/* Show Navbar only if the current path is NOT in hideNavbarRoutes */}
      {/* {!hideNavbarRoutes.includes(location.pathname) && " place saved for navbar do not use it for now"} */}
          {/* <BrowserRouter> */}
          {/* <LoadingPage /> */}
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          {/* <Route path="/postproject" element={<PostProjectSkeleton />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/projectInfo/:projectId" element={<ProjectPage />} />
          <Route path="/projectChat/:projectId" element={<ProjectChat />} />
          <Route path="/searchuser/:prefix" element={<SearchedUsers />} />
          <Route path="/editProfile" element={<EditProfilePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/friendschat" element={<FriendsPage />} /> */}
          {/* <Route path="/testing" element={<HomePageCompleted />} /> */}
          {/* <Route path="/project" element={<Project />} /> */}
          <Route path="/group/:projectId" element={<GroupChat />} />
          <Route path="/private/:id" element={<PrivateChat />} />
          <Route path="/home" element={<NavBar />}>
              <Route path="searchuser/:prefix" element={<SearchedUsers />} />
              <Route path="project/:projectId" element={<Project />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="postproject" element={<PostProject />} />
              <Route path="notification" element={<Notifications />} />
              <Route path="" element={<HomepageContent />} />
              <Route path="chat" element={<ChattingPage />} />
              <Route path="EditProject" element={<EditProject />} />
              <Route path="profile/:userId" element={<UserProfile />} />
              <Route path="editProfile" element={<EditProfile />} />
              <Route path="friends" element={<FriendsPage />} />
              {/* <Route path="loading" element={<LoadingPage />} /> */}
              {/* <Route path="" element={<HomepageContent />} /> */}
          </Route>
        </Routes>
          {/* </BrowserRouter> */}
    </GlobalStateProvider>

    </>
  )
}

export default App
