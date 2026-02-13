import WebSocket from "ws";
import { Hashmap } from "./types";
import Message from "../model/message.model";
import { createMessage } from "../services/message.service";
import { fetchChannelUsers } from "../services/user.service";

export const joinChannel = async function (
  ws: WebSocket,
  hashmap: Map<string, string[]>,
  sessionsHashMap: Hashmap,
  data: any,
) {
  try {
    const { channelId } = data.user;

    const messages = await Message
      .find({ channel: channelId })
      .lean()

    const users = await fetchChannelUsers(channelId)

    ws.send(JSON.stringify({
      event: "channel-joined",
      messages,
      users
    }))

  } catch (error) {
    ws.send(JSON.stringify({
      event: "error",
      message: error instanceof Error
        ? error.message || "Something went wrong!"
        : "Something went wrong!"
    }))
  }
};


export const messageClient = async function (
  ws: WebSocket,
  hashmap: Map<string, string[]>,
  sessionsHashMap: Hashmap,
  data: any,
) {
  try {
    const {
      content,
      user: { userId, channelId }
    } = data;

    const sessions: Set<string> = new Set([
      ...(hashmap.get(channelId) || []),
      (ws as any)?.sessionId
    ]);

    const sessionsList = Array.from(sessions);

    const broadCastTo = sessionsList.filter(sessionId => sessionId !== (ws as any)?.sessionId)

    const message = await createMessage({
      content,
      channel: channelId,
      createdBy: userId
    })

    broadCastTo.forEach(client => {
      const socket = sessionsHashMap.get(client)
      if (socket) {
        socket.send(JSON.stringify({
          event: "message-from-server",
          message
        }))
      }
    });
    hashmap.set(channelId, sessionsList);
  } catch (error) {
    ws.send(JSON.stringify({
      event: "error",
      message: error instanceof Error
        ? error.message || "Something went wrong!"
        : "Something went wrong!"
    }))
  }
}