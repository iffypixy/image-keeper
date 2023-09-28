export interface Image {
  id: string;
  url: string;
  label: string;
  size: number;
  date: number;
}

export interface UploadedImage extends Image {
  progress: number;
}
