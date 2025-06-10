// import { useState } from 'react'
// import { RouterProvider } from 'react-router-dom'
// import router from './Router'
// import { AuthForm } from './components/AuthForm'

import { Route, Routes, useNavigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage"
import { Layout } from "./components/Layout";

// import Header from './components/Header'
function App() {

  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    switch (page) {
      case "home":
        navigate("/");
        break;
      case "songs":
        navigate("/songs");
        break;
      case "playlist":
        navigate("/playlist");
        break;
      case "login":
        navigate("/login");
        break;
      case "register":
        navigate("/register");
        break;
      default:
        navigate("/");
    }

  }


  return (
    <Routes>
      <Route path="/" element={<Layout onNavigate={handleNavigate} />}>
        <Route path="login" element={<AuthPage />} />
        <Route path="register" element={<AuthPage />} />
        {/* <Route path="/songs" element={<SongsPage />} /> */}
        {/* <Route path="/playlist" element={<PlaylistPage />} /> */}
        {/* <Route path="/home" element={<HomePage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        {/* <Route path="songs" element={<SongsPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App
