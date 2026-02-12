import WebSocket from "ws";
import { Hashmap } from "./types";
import { randomUUID } from "node:crypto";
import { joinChannel, messageClient } from "./events-handlers";
import { permit } from "../middleware/permit.middleware";

export const socketCallback = function (
  ws: WebSocket,
  hashmap: Map<string, string[]>,
  sessionsHashMap: Hashmap,
) {
  const sessionId = randomUUID();
  (ws as any).sessionId = sessionId;

  sessionsHashMap.set(sessionId, ws);

  ws.on("close", () => {
    sessionsHashMap.delete(sessionId);
  });

  ws.on("error", console.error);

  ws.on("message", async function (data) {
    const payload = Buffer.isBuffer(data) ? JSON.parse(data.toString()) : {};

    const { event, token, tabHeader, ...parsedPayload } = payload;

    const { success, user } = await permit(token, tabHeader);
    if (!success) {
      ws.send(
        JSON.stringify({
          event: "error",
          message: "invalid credentials"
        }),
      );
      return;
    }
    parsedPayload.user = user;
    switch (event) {
      case "join-channel":
        joinChannel(ws, hashmap, sessionsHashMap, parsedPayload);
        return;
      case "message-from-client":
        messageClient(ws, hashmap, sessionsHashMap, parsedPayload)
        return;
    }
  });
};
