import * as fabric from "fabric";

export interface StampData {
  instanceId: string;
}

export interface FabricEvent {
  target?: FabricObjectWithData;
}

export interface FabricObjectWithData extends fabric.Object {
  data?: StampData;
  getSrc?: () => string;
}

export interface Scale {
  scaleX: number;
  scaleY: number;
}

export interface Position {
  left: number;
  top: number;
}
