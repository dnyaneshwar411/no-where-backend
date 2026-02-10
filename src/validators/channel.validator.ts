import { isValidObjectId } from "mongoose";
import { RequestValidator } from "../types/global";
import Joi from "joi";

const channelValidator: Record<string, RequestValidator> = {};

channelValidator.createChannelValidator = {
  body: Joi.object({
    channelName: Joi.string().trim().required(),
    channelPassword: Joi.string().alphanum().length(6).required().messages({
      "string.alphanum": "Channel password must be alphanumeric",
      "string.length": "Channel password must be exactly 6 characters",
    }),
    userName: Joi.string().trim().required(),
    userPassword: Joi.string().alphanum().length(6).required().messages({
      "string.alphanum": "User password must be alphanumeric",
      "string.length": "User password must be exactly 6 characters",
    }),
  }),
};

channelValidator.createChannelUser = {
  body: Joi.object({
    userName: Joi.string().trim().required(),
    userPassword: Joi.string().alphanum().length(6).required().messages({
      "string.alphanum": "User password must be alphanumeric",
      "string.length": "User password must be exactly 6 characters",
    }),
    channelName: Joi.string().trim().required(),
  }),
};

channelValidator.loginChannelUser = {
  body: Joi.object({
    userName: Joi.string().trim().required(),
    userPassword: Joi.string().alphanum().length(6).required().messages({
      "string.alphanum": "User password must be alphanumeric",
      "string.length": "User password must be exactly 6 characters",
    }),
    channelName: Joi.string().trim().required(),
  }),
};

export default channelValidator;
