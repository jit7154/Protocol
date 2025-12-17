import React, { use, useEffect } from 'react'
import { Routes,Route, Navigate} from 'react-router-dom'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import './index.css'
const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
  const {theme} = useThemeStore();

  console.log({onlineUsers})

  useEffect(()=>{
    checkAuth();
  },[checkAuth]); //this will run every time when we refresh our application
  

  console.log({authUser}); 
  //Basically this fn is used to add a loading state while isChekcingAuth is true and authUser state is not returned
  if(isCheckingAuth && !authUser) return(
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/> 
        {/* /* The Loader icon from lucide-react is just a static SVG icon of a circular loader. It does not spin by itself—you need to add an animation for that */}
      </div>
  )
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
         <Route path="/" element={ authUser ? <HomePage/> : <Navigate to="/login"/> }/>
          {/* //if user is auth. then homepage else first login  */}
         <Route path="/signup" element={!authUser?<SignUpPage/> : <Navigate to="/"/> }/>
         <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to='/'/> }/>
         <Route path="/settings" element={<SettingsPage/>}/>
         <Route path="/profile" element={authUser?<ProfilePage/> : <Navigate to="/login"/> }/> 
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
