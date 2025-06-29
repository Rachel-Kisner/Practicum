import { useSongStore } from "../stores/SongStore";
import {  useEffect, useRef, useState } from "react";
import * as songService from "../services/SongService";
import { useSongs } from "../Hooks/useSongs";
import { Button } from "@mui/material";
import SongCard from "../components/SongCard";
import { Song } from "../types/Song";
import { useAuth } from "../Hooks/useAuth";
import UploadSong from "../components/UploadSong";

export const SongPage = () => {
    // טוען את השירים  מהשרת פעם 1 בעת עליית הדף
    useSongs();

    //שליפה מתוך ה-store - מערך של שירים, וכן פעולות לעריכת הוספת ומחיקת שירים
    const {
        songList,
        addSong,
        updateSong,
        deleteSong,
        toggleFavorite,
        favoritesOnly,
        toggleFavoritesOnly,
    } = useSongStore();



    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying,setIsPlaying] = useState(false);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const [editingSong, setEditingSong] = useState<Song | null>(null);
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);
    const { user } = useAuth();
    
        

    useEffect(() => {
        const audio = audioRef.current;
        if(!audio)return;
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setPlayingId(null);
        }
        const handlePlay = () => setIsPlaying(true);

        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("play", handlePlay);
        return () => {
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("play", handlePlay);
        };
    },[audioRef,playingId]);

    const handlePlayToggle=(song:Song)=>{
        if(!audioRef.current)return;

        const newUrl=song.cloudinaryUrl||song.backupUrl||"";
        if(playingId===song.id){
            if(isPlaying){
                audioRef.current.pause();
                setIsPlaying(false);
            }
            else{
                audioRef.current.play();
                setIsPlaying(true);             
            }
        }
        else{
            audioRef.current.pause();
            audioRef.current.currentTime=0;
            audioRef.current.src=newUrl;
            audioRef.current.load();
            audioRef.current.oncanplay=()=>{
                audioRef.current?.play();
                setIsPlaying(true);
                setPlayingId(song.id);
            };
            setPlayingUrl(newUrl);
            
        }
        
            
            
        
    }

    // const handleAddOrUpdate = async (data: SongFormData) => {
    //     const { user } = useAuth();
    //     // Ensure cloudinaryUrl is a string (not undefined)
    //     const fullData = {
    //         ...data,
    //         favorite: data.favorite || false,
    //         userId: user?.id,
    //     };
    //     if (editingSong) {
    //         const update = await songService.updateSong(
    //             editingSong.id,
    //             fullData
    //         );
    //         updateSong(update);//update the store
    //     } else {
    //         const newSong = await songService.uploadSong(fullData);
    //         addSong(newSong);//update the store
    //     }
    //     setEditingSong(null);//reset the form
    // };

    const handleDelete = async (id: number) => {
        try {
            await songService.deleteSong(id);
            deleteSong(id);//update the store
        }
        catch (error) {
            console.log(error);
        };

    }
    console.log(`songList:`, songList);

    // filter favorites only if true
    const filteredSongs = favoritesOnly ? songList.filter((song) => song.favorite) : songList;
    console.log(`filteredSongs:`, filteredSongs, `favoritesOnly:`, favoritesOnly);


    return (
        <>
            {console.log(`songList:`, songList)}
            
            
            <UploadSong/>
                
                
            
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Songs</h1>
                {/* button to toggle favorites */}
                <Button
                    variant="outlined"
                    onClick={toggleFavoritesOnly}
                >
                    {favoritesOnly ? "Show All Songs" : "Show Favorites Only"}

                </Button>
                {/* form for adding a new song or editing an existing one */}
                {/* <SongForm
                    defaultValues={
                        editingSong ? {
                            title: editingSong.title,
                            artist: editingSong.artist,
                            genre: editingSong.genre,
                            favorite: editingSong.favorite ?? false,
                            cloudinaryUrl: editingSong.cloudinaryUrl,
                            backupUrl: editingSong.backupUrl || "",

                        }
                            : {
                                title: "",
                                artist: "",
                                genre: "",
                                cloudinaryUrl: "",
                                backupUrl: "",
                                favorite: false
                            }
                    }
                    onSubmit={handleAddOrUpdate}
                /> */}
                <audio
                    controls
                    ref={audioRef}
                    src={playingUrl || ""}
                    autoPlay
                    style={{ width: "100%", marginBottom: 16 }}>
                    audio
                </audio>

                {/* list of songs */}
                <div className="space-y-3">
                    {filteredSongs.map((song) => (
                        <SongCard
                            key={song.id}
                            song={song}
                            isPlaying={song.id === playingId && isPlaying}
                            onPlayToggle={() => {
                                handlePlayToggle(song);
                            }}
                            onEdit={(song) => setEditingSong(song)}
                            onDelete={(id) => handleDelete(id)}
                            onToggleFavorite={(id) => toggleFavorite(id)}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default SongPage;

// import { useSongStore } from "../stores/SongStore";
// import { useEffect, useRef, useState } from "react";
// import * as songService from "../services/SongService";
// import { useSongs } from "../Hooks/useSongs";
// import { Button } from "@mui/material";
// import SongCard from "../components/SongCard"; // ✨ משתמש בקומפוננטה המעודכנת שלך
// import { Song } from "../types/Song";
// import { useAuth } from "../Hooks/useAuth";
// import UploadSong from "../components/UploadSong";
// // ✨ הוספת אייקונים למודרני UI
// import { Music, Filter } from "lucide-react";

// export const SongPage = () => {
//     // טוען את השירים מהשרת פעם 1 בעת עליית הדף
//     useSongs();

//     //שליפה מתוך ה-store - מערך של שירים, וכן פעולות לעריכת הוספת ומחיקת שירים
//     const {
//         songList,
//         addSong,
//         updateSong,
//         deleteSong,
//         toggleFavorite,
//         favoritesOnly,
//         toggleFavoritesOnly,
//     } = useSongStore();

//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [playingId, setPlayingId] = useState<number | null>(null);
//     const [editingSong, setEditingSong] = useState<Song | null>(null);
//     const [playingUrl, setPlayingUrl] = useState<string | null>(null);
//     const { user } = useAuth();

//     useEffect(() => {
//         const audio = audioRef.current;
//         if (!audio) return;
//         const handlePause = () => setIsPlaying(false);
//         const handleEnded = () => {
//             setIsPlaying(false);
//             setPlayingId(null);
//         }
//         const handlePlay = () => setIsPlaying(true);

//         audio.addEventListener("pause", handlePause);
//         audio.addEventListener("ended", handleEnded);
//         audio.addEventListener("play", handlePlay);
//         return () => {
//             audio.removeEventListener("pause", handlePause);
//             audio.removeEventListener("ended", handleEnded);
//             audio.removeEventListener("play", handlePlay);
//         };
//     }, [audioRef, playingId]);

//     const handlePlayToggle = (song: Song) => {
//         if (!audioRef.current) return;

//         const newUrl = song.cloudinaryUrl || song.backupUrl || "";
//         if (playingId === song.id) {
//             if (isPlaying) {
//                 audioRef.current.pause();
//                 setIsPlaying(false);
//             }
//             else {
//                 audioRef.current.play();
//                 setIsPlaying(true);
//             }
//         }
//         else {
//             audioRef.current.pause();
//             audioRef.current.currentTime = 0;
//             audioRef.current.src = newUrl;
//             audioRef.current.load();
//             audioRef.current.oncanplay = () => {
//                 audioRef.current?.play();
//                 setIsPlaying(true);
//                 setPlayingId(song.id);
//             };
//             setPlayingUrl(newUrl);
//         }
//     }

//     const handleDelete = async (id: number) => {
//         try {
//             await songService.deleteSong(id);
//             deleteSong(id);//update the store
//         }
//         catch (error) {
//             console.log(error);
//         };
//     }
    
//     console.log(`songList:`, songList);

//     // filter favorites only if true
//     const filteredSongs = favoritesOnly ? songList.filter((song) => song.favorite) : songList;
//     console.log(`filteredSongs:`, filteredSongs, `favoritesOnly:`, favoritesOnly);

//     return (
//         // ✨ רקע gradient מודרני חדש
//         <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//             <UploadSong />
            
//             {/* ✨ קונטיינר ראשי מודרני */}
//             <div className="max-w-6xl mx-auto px-4 py-8">
//                 {/* ✨ כותרת מודרנית עם gradient */}
//                 <div className="text-center mb-12">
//                     <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
//                         Your Music Library
//                     </h1>
//                     <p className="text-gray-600 text-lg">Discover, play, and manage your favorite songs</p>
//                 </div>

//                 {/* ✨ סקציית בקרות מודרנית */}
//                 <div className="flex justify-between items-center mb-8">
//                     <div className="flex items-center space-x-4">
//                         {/* ✨ מונה שירים מודרני */}
//                         <div className="flex items-center space-x-2 text-gray-600">
//                             <Music className="w-5 h-5" />
//                             <span className="font-medium">{filteredSongs.length} songs</span>
//                         </div>
//                     </div>
                    
//                     {/* ✨ כפתור favorites מעוצב מודרני */}
//                     <Button
//                         variant="outlined"
//                         onClick={toggleFavoritesOnly}
//                         startIcon={<Filter className="w-5 h-5" />}
//                         sx={{
//                             borderRadius: '12px',
//                             padding: '12px 24px',
//                             textTransform: 'none',
//                             fontWeight: 'bold',
//                             borderColor: favoritesOnly ? '#ef4444' : '#6b7280',
//                             color: favoritesOnly ? '#dc2626' : '#374151',
//                             backgroundColor: favoritesOnly ? '#fef2f2' : '#f9fafb',
//                             '&:hover': {
//                                 backgroundColor: favoritesOnly ? '#fee2e2' : '#f3f4f6',
//                                 borderColor: favoritesOnly ? '#dc2626' : '#4b5563',
//                             },
//                             transition: 'all 0.3s ease',
//                         }}
//                     >
//                         {favoritesOnly ? "Show All Songs" : "Show Favorites Only"}
//                     </Button>
//                 </div>

//                 {/* ✨ נגן אודיו מודרני */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
//                     <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-semibold text-gray-900">Now Playing</h3>
//                         {/* ✨ אינדיקטור LIVE */}
//                         <div className="flex items-center space-x-2 text-gray-500">
//                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                             <span className="text-sm">Live</span>
//                         </div>
//                     </div>
//                     <audio
//                         controls
//                         ref={audioRef}
//                         src={playingUrl || ""}
//                         autoPlay
//                         style={{ 
//                             width: "100%", 
//                             marginBottom: 16,
//                             borderRadius: '12px', // ✨ עיגול פינות
//                             outline: 'none' // ✨ הסרת outline
//                         }}
//                     >
//                         audio
//                     </audio>
//                 </div>

//                 {/* ✨ רשימת שירים מעוצבת */}
//                 <div className="space-y-4">
//                     {filteredSongs.length > 0 ? (
//                         filteredSongs.map((song) => (
//                             <SongCard
//                                 key={song.id}
//                                 song={song}
//                                 isPlaying={song.id === playingId && isPlaying}
//                                 onPlayToggle={() => {
//                                     handlePlayToggle(song);
//                                 }}
//                                 onEdit={(song) => setEditingSong(song)}
//                                 onDelete={(id) => handleDelete(id)}
//                                 onToggleFavorite={(id) => toggleFavorite(id)}
//                             />
//                         ))
//                     ) : (
//                         // ✨ מצב ריק מעוצב
//                         <div className="text-center py-16">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//                                 <Music className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">No songs found</h3>
//                             <p className="text-gray-600">
//                                 {favoritesOnly 
//                                     ? "You haven't marked any songs as favorites yet." 
//                                     : "Upload your first song to get started!"
//                                 }
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SongPage;