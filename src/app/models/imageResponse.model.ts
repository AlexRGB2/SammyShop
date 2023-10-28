export interface ImageResponse {
  message: string;
  object: Image[]
}

export interface Image {
  _id: string;
  claveProducto: string
  imgB64: string[];
}
