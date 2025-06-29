import { create } from "zustand";
import { Song } from "../types/Song";
import * as SongService from "../services/SongService";
import { UploadSongRequest } from "../types/UploadSongRequest";

type SongStoreState = {
    songList: Song[];
    favoritesOnly: boolean;

    // CRUD operations (wrapped)
    fetchSongs: () => Promise<void>;
    addSong: (newSong: UploadSongRequest) => Promise<void>;
    updateSong: (song: Song) => Promise<void>;
    deleteSong: (id: number) => Promise<void>;

    // Local state updates
    toggleFavorite: (songId: number) => void;
    toggleFavoritesOnly: () => void;
};

export const useSongStore = create<SongStoreState>((set) => ({
    songList: [],
    favoritesOnly: false,
    fetchSongs: async () => {
        try {
            const songs = await SongService.getAllSongs();
            set({ songList: songs });
            console.log("fetchSongs: loaded", songs);
        } catch (error) {
            console.error("fetchSongs error:", error);
        }
    },

    //change the songList
    addSong: async (newSong: UploadSongRequest) => {
        try {
            const uploadedSong = await SongService.uploadSong(newSong);
            set((state) => ({ songList: [...state.songList, uploadedSong] })); // add the returned Song
        } catch (error) {
            console.error("addSong error:", error);
        }
    },
    updateSong: async (updateSong) => {
        try {
            const updated = await SongService.updateSong(updateSong.id, updateSong);
            set((state) => ({
                songList: state.songList.map((song) =>
                    song.id === updated.id ? updated : song
                )
            }))
        }
        catch (error) {
            console.error("❌ updateSong error:", error);
        }
    },
    deleteSong: async (id) => {
        try {
            await SongService.deleteSong(id);
            set((state) => ({
                songList: state.songList.filter((song) => song.id !== id)
            }))
            console.log("✅ deleteSong:", id);
        }
        catch (error) {
            console.error("❌ deleteSong error:", error);
        }
    },

    toggleFavorite: (songId) =>
        set((state) => ({
            songList: state.songList.map((song) =>
                song.id === songId
                    ? { ...song, favorite: !song.favorite }
                    : song
            )
        })),
    toggleFavoritesOnly: () => set((state) => ({
        favoritesOnly: !state.favoritesOnly
    }))

}))