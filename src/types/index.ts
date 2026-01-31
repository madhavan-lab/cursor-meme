export interface TextBox {
  id: string;
  text: string;
  fontSize: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  textColor: string;
  borderColor: string;
  isSelected?: boolean;
}

export interface AppState {
  imageUrl: string | null;
  textBoxes: TextBox[];
}
