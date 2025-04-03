import * as fabric from "fabric";

export interface StampData {
  instanceId: string;
}

export interface FabricEventTarget extends fabric.Object {
  data?: StampData;
  getSrc?: () => string;
}

export interface FabricEvent {
  target?: FabricEventTarget;
}

export interface FabricObjectWithData extends fabric.Object {
  data?: StampData;
  getSrc?: () => string;
}

export interface FabricStampImage extends fabric.FabricImage {
  data?: StampData;
}

export type FabricEventHandler = (e: FabricEvent) => void;

export interface Scale {
  scaleX: number;
  scaleY: number;
}

export interface Position {
  left: number;
  top: number;
}
