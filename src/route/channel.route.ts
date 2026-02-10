import {
  createChannel,
  createChannelUser,
  loginChannelUser,
} from "../controller/channel.controller";
import { validate } from "../middleware/validate.middleware";
import channelValidator from "../validators/channel.validator";
import express from "express";
import Joi from "joi";

export const router: express.Router = express.Router();

router
  .route("/")
  .post(
    validate(channelValidator.createChannelValidator as Joi.Schema),
    createChannel,
  );

router
  .route("/user")
  .post(
    validate(channelValidator.createChannelUser as Joi.Schema),
    createChannelUser,
  );

router
  .route("/user/login")
  .post(
    validate(channelValidator.loginChannelUser as Joi.Schema),
    loginChannelUser,
  );
