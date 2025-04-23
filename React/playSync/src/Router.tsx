import Song from "./components/Song"
import Playlist from "./components/Playlist";
import Home from "./components/Home"
import { createBrowserRouter } from 'react-router-dom';
const router=createBrowserRouter([
    {
        path:"/",
        element:<Home/>,
        children:[
            {
                path:"/songs",
                element:<Song/>
            },
            {
                path:"/playlist",
                element:<Playlist/>
            }
            
            
        ]
    },
])
export default router

