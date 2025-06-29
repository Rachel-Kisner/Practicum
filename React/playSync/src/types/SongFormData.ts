export interface SongFormData {
  title: string;
  artist: string;
  genre: string;
  favorite: boolean;
  cloudinaryUrl: string;
  backupUrl?: string;
}