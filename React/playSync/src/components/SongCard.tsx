import { FC } from "react";
import { Play,Pause, Trash2, Edit2, Heart, HeartOff } from "lucide-react"; // אייקונים מודרניים
import clsx from "clsx";
import { useSongStore } from "../stores/SongStore";
import { Song } from "../types/Song";
import { SongFormData } from "../types/SongFormData";

interface SongCardProps {
    song: Song;
    isPlaying:boolean,
    onPlayToggle: (song: Song) => void;
    onEdit: (song: Song) => void;
    onDelete: (id: number) => void;
    onToggleFavorite: (id: number) => void;
    // isFavorite?:boolean;
}
export default function SongCard({ song,isPlaying, onPlayToggle: onPlay, onEdit, onDelete, onToggleFavorite }: SongCardProps) {
    return (

        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            {/* img
            <img src={song.cloudinaryUrl}
                alt={song.title}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
            /> */}

            {/* details */}
            <div className="flex-1" >
                <h3 className="text-lg font-semibold text-gray-800">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.artist}</p>
            </div>
            {/* actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPlay(song)}
                    aria-label="Play"
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                >
                    {isPlaying? <Pause size={20} />:<Play size={20} />}
                </button>
                <button
                    onClick={() => onToggleFavorite(song.id)}
                    aria-label="Favorite"
                    className={clsx("p-2 rounded-xl", {
                        "text-red-500 hover:bg-red-100": song.favorite,
                        "text-gray-400 hover:bg-gray-100": !song.favorite,
                })}
                >
                    {song.favorite ? <Heart fill="currentColor" size={20}/> : <HeartOff size={20} />}
                </button>
            <button
                onClick={() => onEdit(song)}
                aria-label="Edit"
                className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-xl transition-colors"
            >
                <Edit2 size={20} />
            </button>
            <button
                onClick={() => onDelete(song.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
            >
                <Trash2 size={20} />
            </button>
        </div>

        </div >


    )
}

// import { FC } from "react";
// import { Play, Pause, Trash2, Edit2, Heart, HeartOff, Music } from "lucide-react"; // ✨ הוספת Music אייקון
// import clsx from "clsx";
// import { useSongStore } from "../stores/SongStore";
// import { Song } from "../types/Song";
// import { SongFormData } from "../types/SongFormData";

// interface SongCardProps {
//     song: Song;
//     isPlaying: boolean,
//     onPlayToggle: (song: Song) => void;
//     onEdit: (song: Song) => void;
//     onDelete: (id: number) => void;
//     onToggleFavorite: (id: number) => void;
// }

// export default function SongCard({ 
//     song, 
//     isPlaying, 
//     onPlayToggle: onPlay, 
//     onEdit, 
//     onDelete, 
//     onToggleFavorite 
// }: SongCardProps) {
//     return (
//         // ✨ עיצוב מודרני חדש - הוספת shadow-xl, hover:scale-[1.02], border
//         <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-[1.02]">
//             <div className="flex items-center space-x-4">
//                 {/* ✨ הוספת Album Art Placeholder מודרני */}
//                 <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
//                     <Music className="w-8 h-8 text-white" />
//                 </div>

//                 {/* Song Info - ✨ שיפורים בעיצוב */}
//                 <div className="flex-1 min-w-0">
//                     <h3 className="font-bold text-lg text-gray-900 truncate">{song.title}</h3>
//                     <p className="text-gray-600 truncate">{song.artist}</p>
//                     {/* ✨ הוספת genre tag מודרני */}
//                     <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mt-1">
//                         {song.genre}
//                     </span>
//                 </div>

//                 {/* Actions - ✨ עיצוב מודרני חדש */}
//                 <div className="flex items-center space-x-2">
//                     {/* Favorite Button - ✨ עיצוב מודרני */}
//                     <button
//                         onClick={() => onToggleFavorite(song.id)}
//                         aria-label="Favorite"
//                         className={clsx(
//                             "p-2 rounded-full transition-all",
//                             {
//                                 "text-red-500 bg-red-50 hover:bg-red-100": song.favorite,
//                                 "text-gray-400 hover:text-red-500 hover:bg-red-50": !song.favorite,
//                             }
//                         )}
//                     >
//                         <Heart className={`w-5 h-5 ${song.favorite ? 'fill-current' : ''}`} />
//                     </button>

//                     {/* Play Button - ✨ עיצוב gradient מודרני */}
//                     <button
//                         onClick={() => onPlay(song)}
//                         aria-label="Play"
//                         className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-110"
//                     >
//                         {isPlaying ? (
//                             <Pause className="w-5 h-5" />
//                         ) : (
//                             <Play className="w-5 h-5 ml-0.5" />
//                         )}
//                     </button>

//                     {/* Edit Button - ✨ עיצוב מודרני */}
//                     <button
//                         onClick={() => onEdit(song)}
//                         aria-label="Edit"
//                         className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
//                     >
//                         <Edit2 className="w-5 h-5" />
//                     </button>

//                     {/* Delete Button - ✨ עיצוב מודרני */}
//                     <button
//                         onClick={() => onDelete(song.id)}
//                         aria-label="Delete"
//                         className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
//                     >
//                         <Trash2 className="w-5 h-5" />
//                     </button>
//                 </div>
//             </div>

//             {/* ✨ הוספת Playing Indicator אנימציה */}
//             {isPlaying && (
//                 <div className="mt-4 flex items-center space-x-2 text-purple-600">
//                     <div className="flex space-x-1">
//                         <div className="w-1 h-4 bg-purple-500 rounded animate-pulse"></div>
//                         <div className="w-1 h-6 bg-purple-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
//                         <div className="w-1 h-3 bg-purple-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
//                         <div className="w-1 h-5 bg-purple-500 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
//                     </div>
//                     <span className="text-sm font-medium">Now Playing</span>
//                 </div>
//             )}
//         </div>
//     );
// }