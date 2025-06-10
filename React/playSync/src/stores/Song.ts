import axios from "axios";
import { makeAutoObservable } from "mobx";


export type Song = {

    title: string;
    artist: string;
    genre: string
    id: number;
    description: string;
    authorId: number;
 
};
class SongStore {
    songList: Song[] = [];
    selectedSong: Song | null = null;
    errorMessage: string = "";
    openSnackbar: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    async addSong(song: Omit<Song, "id" | "authorId">, authorId: number) {
        try {

            const res = await axios.post(
                "http://localhost:3000/api/recipes/",
                { ...song },
                { headers: { "user-id": authorId } }
            );
            alert("successful")
            return res;
        } catch (error: any) {
            throw error;
        }
    }
    async getSong() {
        try {
            const res = await axios.get("https://localhost:44322/api/song");
            this.songList = res.data;
        } catch (error: any) {
            this.handleError(error)
        }
    }

    handleError(error: any) {
        this.openSnackbar = true;
        switch (error.response?.status) {
            case 400:
                this.errorMessage = "Error: Invalid details, try again.";
                break;
            case 401:
                this.errorMessage = "Error: Unauthorized access.";
                break;
            case 500:
                this.errorMessage = "Server error, try again later.";
                break;
            default:
                this.errorMessage = "An unexpected error occurred.";
                break;
        }
    }
    selectSong(song: Song | null) {
        this.selectedSong = song;
    }
}

export const recipeStore = new SongStore();