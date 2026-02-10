import WebSocket from "ws";
import { Hashmap } from "./types";

export const message = async function (
  ws: WebSocket,
  hashmap: Hashmap,
  data: any,
): Promise<void> {
  try {
    const payload = data.toString()
    if (typeof data === "object") {
      const { channelId, userId } = payload
      console.log(channelId, userId)
    }
    for (const [id, socket] of hashmap.entries()) {
      console.log(id, (socket as any).sessionId)
      if (id === (ws as any).sessionId && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event: "new-message", message: "hello from someone else" }));
      }
    }
  } catch (error) {
    console.log()
  }
};
