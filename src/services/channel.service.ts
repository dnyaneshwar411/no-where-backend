import Channel from "../model/channel.model";
import { isValidObjectId, Schema } from "mongoose";
import { createUser, updateUserWithUserId } from "./user.service";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../model/user.model";

export const channelExists = async function ({
  channelId,
  channelUserName,
}: {
  channelId?: Schema.Types.ObjectId | string;
  channelUserName?: string;
}) {
  if (!channelId && !channelUserName) {
    throw new ApiError(
      406,
      "Either of channelId or channel Name are required!",
    );
  }
  const filters = [];
  if (channelId) filters.push({ _id: channelId });
  if (channelUserName) filters.push({ channel: channelUserName });
  const channel = await Channel.exists({
    $or: filters,
  });
  return isValidObjectId(channel?._id);
};

type CreateChannelType = {
  channelName: string;
  channelPassword: string;
  userName: string;
  userPassword: string;
};

export const createChannelService = async function (body: CreateChannelType) {
  if (await channelExists({ channelUserName: body.channelName })) {
    throw new ApiError(409, "Channel with this name already exists");
  }
  const user = await createUser(body.userName, body.userPassword);
  if (!isValidObjectId(user?._id)) {
    throw new ApiError(400, "You have received very rare error");
  }
  const channel = await Channel.create({
    channel: body.channelName,
    password: body.channelPassword,
    owner: user._id,
  });
  if (!isValidObjectId(channel?._id)) {
    throw new ApiError(400, "You have received very rare error");
  }
  await updateUserWithUserId(String(user._id), { channel: channel._id } as Pick<
    IUser,
    "user" | "channel"
  >);
  return {
    channel,
    user
  };
};

export const getChannelByName = async function (
  channelName: string,
  fields: string = "",
) {
  return await Channel.findOne({ channel: channelName }).select(fields).lean();
};
