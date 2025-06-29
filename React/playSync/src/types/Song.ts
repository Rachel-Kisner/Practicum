export interface Song{
    id: number;
    title: string;
    artist: string;
    genre: string;
    userId: number;
    favorite: boolean;
    cloudinaryUrl: string;
    backupUrl?:string;
    createdAt?: string;
    updatedAt?: string;
}


