import WebSocket from "ws";
import { Hashmap } from "./types";
import { createMessage, retrieveMessages } from "../services/message.service";
import { fetchChannelUsers, getUserByFilters } from "../services/user.service";

export const joinChannel = async function (
  ws: WebSocket,
  hashmap: Map<string, string[]>,
  sessionsHashMap: Hashmap,
  data: any,
) {
  try {
    const { channelId, userId } = data.user;

    const messages = await retrieveMessages(channelId)

    const users = await fetchChannelUsers(channelId)

    const loggedInUser = users.find(user => String(user._id) === userId)

    ws.send(JSON.stringify({
      event: "channel-joined",
      messages: messages.map(mes => ({
        ...mes,
        myMessageFlag: String(userId) === String(mes.createdBy?._id)
      })),
      users,
      me: loggedInUser
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

    const user = await getUserByFilters({ _id: userId, channel: channelId }, "user")

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
          message: {
            ...message.toObject(),
            createdBy: {
              _id: user?._id,
              user: user?.user
            }
          }
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