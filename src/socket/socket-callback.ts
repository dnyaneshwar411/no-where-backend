import WebSocket from "ws";
import { eventMap } from "./event-map";
import { Hashmap } from "./types";
import { randomUUID } from "node:crypto";

export const socketCallback = function (ws: WebSocket, hashmap: Hashmap) {
  const sessionId = randomUUID();
  (ws as any).sessionId = sessionId;

  hashmap.set(sessionId, ws);

  ws.on("close", () => {
    hashmap.delete(sessionId);
  });

  ws.on("error", console.error);

  eventMap.forEach(({ event, handler }) => {
    ws.on(event, (data) => handler(ws, hashmap, data));
  });
};