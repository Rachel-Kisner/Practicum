// הוק מותאם להורדת השירים מהשרת (API) בעת עליית הדף (mount), ושמירתם בזיכרון דרך ה־store.//
import { useEffect } from "react";
import { useSongStore } from "../stores/SongStore";
import * as songService from "../services/SongService";

export const useSongs = () => {
    console.log("useSongs");
    
    const { fetchSongs } = useSongStore();
  useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);



};

