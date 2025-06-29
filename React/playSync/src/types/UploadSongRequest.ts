export interface UploadSongRequest{
    file: File;
    title: string;
    artist: string;
    genre: string;
    favorite: boolean;
    userId: string;
}