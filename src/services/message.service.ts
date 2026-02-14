import Message from "../model/message.model"
import { Types } from "mongoose"

type CreateMessageType = {
  content: string
  createdBy: string | Types.ObjectId
  type?: string
  channel: string
}

export const createMessage = async function ({
  content,
  createdBy,
  type = "text",
  channel
}: CreateMessageType) {
  return await Message.create({
    content,
    createdBy,
    type,
    channel
  })
}

export const retrieveMessages = async function (channelId: string | Types.ObjectId) {
  return await Message
    .find({ channel: channelId })
    .populate("createdBy", "user")
    .lean()
}