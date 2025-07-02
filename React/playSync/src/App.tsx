import { Route, Routes, useNavigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage"
import { Layout } from "./components/Layout";
import SongPage from "./pages/SongPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout onNavigate={handleNavigate} />}>
          <Route path="login" element={<AuthPage isRegister />} />
          <Route path="register" element={<AuthPage isRegister />} />
          <Route path="/songs" element={<SongPage/>} />
          {/* <Route path="/playlist" element={<PlaylistPage />} /> */}
          {/* <Route path="/home" element={<HomePage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          {/* <Route path="songs" element={<SongsPage />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App
