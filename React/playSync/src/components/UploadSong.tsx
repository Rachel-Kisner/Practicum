import { useState, FC } from "react";
import { FormControlLabel, TextField, Typography, Checkbox, Button } from "@mui/material"
import { useAuth } from "../Hooks/useAuth";
import { useSongStore } from "../stores/SongStore";
import { CloudUploadIcon } from "lucide-react";
import { tokenManager } from "../utils/tokenManager";


const UploadSong: FC = () => {
    const songStore = useSongStore();
    const { addSong } = songStore;
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [favorite, setFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const userId = user ? user.id : "";

    if (!user) {
        console.log("no user Id found");

        return null;
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        console.log("Selected file:", selectedFile);
        setFile(selectedFile);
    };

    const handleUpload = async () => {
    console.log(`tokenManager.getAccessToken() ${tokenManager.getAccessToken()}`);
    console.log(`tokenManager.getRefreshToken()
    ${tokenManager.getRefreshToken()}`);

if (!file || !title || !artist || !genre) {
    console.log(`file ${file}, title ${title}, artist ${artist},genere ${genre}`);
    alert("All fields are required");
    return;
}
setLoading(true);
try {
    const result = await addSong({ file, title, artist, genre, favorite, userId });
    console.log(result);
    alert("Upload succeeded!");
    setFile(null);
    setTitle("");
    setArtist("");
    setGenre("");
    setFavorite(false);
}
catch (error) {
    console.log('upload failed', error);
    alert("Upload failed! Please try again.");
}
finally {
    setLoading(false);
}
    };
if (import.meta.env.PROD) {
    console.log('accessToken?', localStorage.getItem('accessToken'));
    console.log(`refreshToken? ${localStorage.getItem('refreshToken')}`);
}
return (
    <div className="space-y-4 max-w-md mx-auto p-4 border rounded-md shadow-md">
        <Typography variant="h5">Upload New Song</Typography>


        <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
            label="Artist"
            fullWidth
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
        />
        <TextField
            label="Genre"
            fullWidth
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={favorite}
                    onChange={(e) => setFavorite(e.target.checked)}
                />
            }
            label="Mark as Favorite"
        />
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            color="primary"
            disabled={loading}
            
        >
            {loading ? "Uploading..." : "Upload Song File"}
            <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
                color= "primary"
            />
        </Button>
        <Button
            style={{ display: "inline-Block", marginLeft: "10px" }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={!file || !title || !artist || !genre || loading}
            onClick={handleUpload}
        >
            Submit
        </Button>


    </div>
)
};

export default UploadSong;



// import { useState, FC } from "react";
// import { FormControlLabel, TextField, Typography, Checkbox, Button } from "@mui/material"
// import { useAuth } from "../Hooks/useAuth";
// import { useSongStore } from "../stores/SongStore";
// import { CloudUploadIcon } from "lucide-react";
// import { tokenManager } from "../utils/tokenManager";

// // Add TypeScript declaration for Vite's import.meta.env
// interface ImportMetaEnv {
//     readonly PROD: boolean;
//     // add other env variables if needed
//     [key: string]: any;
// }



// const UploadSong: FC = () => {
//     const songStore = useSongStore();
//     const { addSong } = songStore;
//     const [file, setFile] = useState<File | null>(null);
//     const [title, setTitle] = useState("");
//     const [artist, setArtist] = useState("");
//     const [genre, setGenre] = useState("");
//     const [favorite, setFavorite] = useState(false);
//     const [loading, setLoading] = useState(false);
//     // ✨ ADDED: State for drag and drop functionality
//     const [dragActive, setDragActive] = useState(false);
    
//     const { user } = useAuth();
//     const userId = user ? user.id : "";

//     if (!user) {
//         console.log("no user Id found");
//         return null;
//     }

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = event.target.files?.[0] || null;
//         console.log("Selected file:", selectedFile);
//         setFile(selectedFile);
//     };

//     // ✨ ADDED: Drag and drop handlers
//     const handleDrag = (e: React.DragEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (e.type === "dragenter" || e.type === "dragover") {
//             setDragActive(true);
//         } else if (e.type === "dragleave") {
//             setDragActive(false);
//         }
//     };

//     const handleDrop = (e: React.DragEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(false);
        
//         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//             setFile(e.dataTransfer.files[0]);
//         }
//     };

//     const handleUpload = async () => {
//         console.log(`tokenManager.getAccessToken() ${tokenManager.getAccessToken()}`);
//         console.log(`tokenManager.getRefreshToken() ${tokenManager.getRefreshToken()}`);

//         if (!file || !title || !artist || !genre) {
//             console.log(`file ${file}, title ${title}, artist ${artist},genere ${genre}`);
//             alert("All fields are required");
//             return;
//         }
//         setLoading(true);
//         try {
//             const result = await addSong({ file, title, artist, genre, favorite, userId });
//             console.log(result);
//             alert("Upload succeeded!");
//             setFile(null);
//             setTitle("");
//             setArtist("");
//             setGenre("");
//             setFavorite(false);
//         }
//         catch (error) {
//             console.log('upload failed', error);
//             alert("Upload failed! Please try again.");
//         }
//         finally {
//             setLoading(false);
//         }
//     };

//     // if (import.meta.env.PROD) {
//     //     console.log('accessToken?', localStorage.getItem('accessToken'));
//     //     console.log(`refreshToken? ${localStorage.getItem('refreshToken')}`);
//     // }

//     return (
//         // ✨ UPDATED: Modern gradient background with rounded corners
//         <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto mb-8 border border-purple-100">
//             {/* ✨ ADDED: Modern header section */}
//             <div className="text-center mb-8">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
//                     <CloudUploadIcon className="w-8 h-8 text-white" />
//                 </div>
//                 <Typography variant="h4" className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
//                     Upload New Song
//                 </Typography>
//                 <p className="text-gray-600">Share your music with the world</p>
//             </div>

//             <div className="space-y-6">
//                 {/* ✨ UPDATED: Modern drag & drop file upload area */}
//                 <div
//                     className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
//                         dragActive 
//                             ? 'border-purple-400 bg-purple-50' 
//                             : file 
//                                 ? 'border-green-400 bg-green-50' 
//                                 : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
//                     }`}
//                     onDragEnter={handleDrag}
//                     onDragLeave={handleDrag}
//                     onDragOver={handleDrag}
//                     onDrop={handleDrop}
//                 >
//                     <input
//                         type="file"
//                         onChange={handleFileChange}
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         accept="audio/*"
//                     />
//                     <div className="space-y-4">
//                         <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
//                             file ? 'bg-green-100' : 'bg-purple-100'
//                         }`}>
//                             <CloudUploadIcon className={`w-6 h-6 ${file ? 'text-green-600' : 'text-purple-600'}`} />
//                         </div>
//                         <div>
//                             {file ? (
//                                 <div className="space-y-2">
//                                     <p className="font-medium text-green-700">File Selected!</p>
//                                     <p className="text-sm text-gray-600">{file.name}</p>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-2">
//                                     <p className="font-medium text-gray-700">Drop your audio file here</p>
//                                     <p className="text-sm text-gray-500">or click to browse</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* ✨ UPDATED: Modern form fields with better styling */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">Song Title</label>
//                         <TextField
//                             fullWidth
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter song title"
//                             variant="outlined"
//                             className="bg-white"
//                             sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                     borderRadius: '12px',
//                                     '&:hover fieldset': {
//                                         borderColor: '#8b5cf6',
//                                     },
//                                     '&.Mui-focused fieldset': {
//                                         borderColor: '#8b5cf6',
//                                     },
//                                 }
//                             }}
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">Artist</label>
//                         <TextField
//                             fullWidth
//                             value={artist}
//                             onChange={(e) => setArtist(e.target.value)}
//                             placeholder="Enter artist name"
//                             variant="outlined"
//                             className="bg-white"
//                             sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                     borderRadius: '12px',
//                                     '&:hover fieldset': {
//                                         borderColor: '#8b5cf6',
//                                     },
//                                     '&.Mui-focused fieldset': {
//                                         borderColor: '#8b5cf6',
//                                     },
//                                 }
//                             }}
//                         />
//                     </div>
//                 </div>

//                 <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">Genre</label>
//                     <TextField
//                         fullWidth
//                         value={genre}
//                         onChange={(e) => setGenre(e.target.value)}
//                         placeholder="Enter genre"
//                         variant="outlined"
//                         className="bg-white"
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 borderRadius: '12px',
//                                 '&:hover fieldset': {
//                                     borderColor: '#8b5cf6',
//                                 },
//                                 '&.Mui-focused fieldset': {
//                                     borderColor: '#8b5cf6',
//                                 },
//                             }
//                         }}
//                     />
//                 </div>

//                 {/* ✨ UPDATED: Modern favorite checkbox */}
//                 <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 checked={favorite}
//                                 onChange={(e) => setFavorite(e.target.checked)}
//                                 sx={{
//                                     color: '#8b5cf6',
//                                     '&.Mui-checked': {
//                                         color: '#8b5cf6',
//                                     },
//                                 }}
//                             />
//                         }
//                         label={
//                             <span className="text-gray-700 font-medium">
//                                 Mark as Favorite
//                             </span>
//                         }
//                     />
//                     <span className={`text-xl ${favorite ? 'text-red-500' : 'text-gray-400'}`}>
//                         {favorite ? '❤️' : '🤍'}
//                     </span>
//                 </div>

//                 {/* ✨ UPDATED: Modern submit button */}
//                 <Button
//                     onClick={handleUpload}
//                     disabled={!file || !title || !artist || !genre || loading}
//                     variant="contained"
//                     fullWidth
//                     sx={{
//                         background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
//                         borderRadius: '12px',
//                         padding: '16px',
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         textTransform: 'none',
//                         boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
//                         '&:hover': {
//                             background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
//                             transform: 'translateY(-2px)',
//                             boxShadow: '0 15px 35px rgba(139, 92, 246, 0.4)',
//                         },
//                         '&:disabled': {
//                             background: '#d1d5db',
//                             color: '#9ca3af',
//                         },
//                         transition: 'all 0.3s ease',
//                     }}
//                     startIcon={loading ? (
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     ) : (
//                         <CloudUploadIcon />
//                     )}
//                 >
//                     {loading ? "Uploading..." : "Upload Song"}
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default UploadSong;