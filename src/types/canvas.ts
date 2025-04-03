import { RefObject } from "react";
import * as fabric from "fabric";

export interface PageImage {
  pageNumber: number;
  imageUrl: string;
}

export type FabricCanvasRef = RefObject<fabric.Canvas | null>;

export interface StampImageCreator {
  (stampImage: fabric.FabricImage): void;
}
