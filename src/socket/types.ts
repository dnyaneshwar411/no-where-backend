import WebSocket from "ws";

export type Hashmap = Map<string, WebSocket>;

export type EventMapType = {
  id: number
  event: string
  handler: (
    ws: WebSocket,
    hashmap: Hashmap,
    data: any
  ) => Promise<void>
}