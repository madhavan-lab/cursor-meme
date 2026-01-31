export interface TextBox {
  id: string;
  text: string;
  fontSize: number;
  x: number;
  y: number;
  textColor: string;
  borderColor: string;
}

export interface AppState {
  imageUrl: string | null;
  textBoxes: TextBox[];
}
