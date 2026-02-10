import { ApiError } from "../utils/ApiError";
import { HydratedDocument, isValidObjectId, Schema, Types } from "mongoose";
import assert from "node:assert";
import User, { IUser } from "../model/user.model";
import { getChannelByName } from "./channel.service";

export const userExists = async function({
  userId,
  userName,
  channelName,
}: {
  userId?: Schema.Types.ObjectId | string;
  userName?: string;
  channelName?: Schema.Types.ObjectId | string;
}) {
  if (!userId && !userName && channelName) {
    throw new ApiError(
      400,
      "Either of userId, userName, channelId is mandatory!",
    );
  }
  const filters: {
    $or?: object[];
    channel?: string | Schema.Types.ObjectId;
  } = {
    $or: [],
  };
  if (!Array.isArray(filters.$or) && (userId || userName)) {
    filters.$or = [];
  }
  assert(Array.isArray(filters.$or), new Error("$or is undefined"));
  if (userId) {
    filters.$or.push({ _id: userId });
  }
  if (userName) {
    filters.$or.push({ user: userName });
  }
  if (channelName) {
    const channel = await getChannelByName(channelName as string, "");
    if (channel) {
      filters.channel = channel._id as Schema.Types.ObjectId;
    }
    assert(
      isValidObjectId(channel?._id),
      Error("channel with the provided name not found!")!,
    );
  }
  if (filters.$or?.length === 0) delete filters.$or;
  const user = await User.exists(filters);
  return isValidObjectId(user?._id);
};

export const createUser = async function(
  userName: string,
  password: string,
  channelName?: Types.ObjectId | string,
): Promise<HydratedDocument<IUser>> {
  const payload: Partial<IUser> = {
    user: userName,
    password,
  };
  if (channelName) {
    const channel = await getChannelByName(channelName as string, "");
    if (channel) {
      payload.channel = channel._id as Types.ObjectId;
    }
    assert(
      isValidObjectId(channel?._id),
      Error("channel with the provided name not found!")!,
    );
  }
  return User.create(payload);
};

export const updateUserWithUserId = async function(
  userId: Schema.Types.ObjectId | string,
  payload: Pick<IUser, "user" | "channel">,
) {
  return await User.findByIdAndUpdate(userId, {
    $set: payload,
  });
};

export const getUserByFilters = async function(
  filters: object,
  fields: string = "",
) {
  return await User.findOne(filters).select(fields);
};
