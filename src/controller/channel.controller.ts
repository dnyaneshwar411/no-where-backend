import {
  createUser,
  getUserByFilters,
  userExists,
} from "../services/user.service";
import {
  createChannelService,
  getChannelByName,
} from "../services/channel.service";
import { catchAsync } from "../utils/catchAsync";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import User from "../model/user.model";
import { compareHash } from "../utils/cipher";
import { signToken } from "../services/token.service";
import { generateRandomHex } from "../utils/random";
import config from "../config/config";

const channelController: Record<string, Function> = {};

export const createChannel = catchAsync(async function (
  req: Request,
  res: Response,
) {
  const {
    channel,
    user
  } = await createChannelService(req.body);

  const tabHeader = generateRandomHex();

  const token = await signToken({
    userId: user._id,
    channelId: channel._id,
    tabHeader,
  });

  res.status(200).json({
    success: true,
    message: "Successfull",
    data: channel,
    tokens: {
      token,
      tabHeader
    }
  });
});

export const createChannelUser = catchAsync(async function (
  req: Request,
  res: Response,
) {
  const body = req.body;
  if (
    await userExists({ userName: body.userName, channelName: body.channelName })
  ) {
    throw new ApiError(400, "User with this user name already exists!");
  }
  const channel = await getChannelByName(body.channelName, "+password")

  if (!channel) throw new ApiError(
    404, "No channel with this channel name exists!"
  )

  if (
    !(await compareHash(body.channelPassword as string, channel.password as string))
  ) {
    throw new ApiError(400, "Incorrect password provided!");
  }

  const user = await createUser(
    body.userName,
    body.userPassword,
    body.channelName,
  );
  user.password;

  const tabHeader = generateRandomHex();

  const token = await signToken({
    userId: user._id,
    channelId: channel._id,
    tabHeader,
  });

  res.status(200).json({
    success: true,
    message: "Successfull",
    data: user,
    tokens: {
      token,
      tabHeader
    }
  });
});

export const loginChannelUser = catchAsync(async function (
  req: Request,
  res: Response,
) {
  const body = req.body;

  const channel = await getChannelByName(body.channelName, "");
  if (!channel) {
    throw new ApiError(404, "No channel found");
  }

  const user = await getUserByFilters(
    { user: body.userName, channel: channel._id },
    "password user",
  );
  if (!user) {
    throw new ApiError(404, "No user found");
  }

  if (
    !(await compareHash(body.userPassword as string, user.password as string))
  ) {
    throw new ApiError(400, "Incorrect password provided!");
  }

  const tabHeader = generateRandomHex();

  const token = await signToken({
    userId: user._id,
    channelId: channel._id,
    tabHeader,
  });

  res.status(200).json({
    success: true,
    message: "Successfull",
    tokens: {
      token,
      tabHeader
    }
  });
});

export default channelController;
