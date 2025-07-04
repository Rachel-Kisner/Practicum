import axiosClient from "./axiosClient";
import { toast } from "react-toastify"
import { UploadSongRequest } from "../types/UploadSongRequest";
const API = '/Song/';

type Song = {
    title: string,
    artist: string,
    genre: string,
    favorite: boolean
}

export const getAllSongs = async () => {
    try {
        console.log("getAllSongs");
        const response = await axiosClient.get(API);
        console.log(response.data.$values, `all songs`);
        return response.data.$values;
    } catch (error) {
        console.log("Error in getAllSongs:", error);
        throw error;
    }
};

export const uploadSong = async ({ file, title, artist, genre, favorite, userId }: UploadSongRequest) => {
    try {
        const formData = new FormData();
        formData.append('File', file);
        formData.append('Title', title);
        formData.append('Artist', artist);
        formData.append('Genre', genre);
        formData.append('Favorite', favorite.toString());
        formData.append('UserId', userId);
        const response = await axiosClient.post(`${API}upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.log("Error in addSong:", error);
        throw error;
    }
};

export const updateSong = async (id: number, song: Song) => {
    try {
        const response = await axiosClient.put(API + id, song);
        return response.data;
    } catch (error) {
        console.log("Error in updateSong:", error);
        throw error;
    }
}


export const deleteSong = async (songId: number) => {
    try {
        const response = await axiosClient.delete(API + songId);
        return response.data;
    } catch (error) {
        console.log("Error in deleteSong:", error);
        throw error;
    }
};
export const ganerateAIRingtone = async (songId: number) => {
    try {
        const response = await axiosClient.post(
            `/Song/${songId}/ringtone-ai`,
            null,
        {
            responseType: 'blob',
        });

        const blobUrl = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute("download", "ringtone.wav");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    catch (error) {
        console.log("Error in ganerateAIRingtone:", error);
        toast.error("Failed to generate ringtone. Please try again.");
        throw error;
        

    }
}




