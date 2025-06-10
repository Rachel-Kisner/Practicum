import Song from "./components/Song"
import Playlist from "./components/Playlist";
import Home from "./components/Home"
import { createBrowserRouter } from 'react-router-dom';
// import { AuthForm } from "./components/AuthForm";
import { useState } from "react";
const [isOpen, setIsOpen] = useState(false);
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/songs",
                element: <Song />
            },
            {
                path: "/playlist",
                element: <Playlist />
            },
            



        ]
    },
])
export default router

