import Joi from "joi";
import { Server } from "node:http";

export type ServerInstanceType = undefined | Server;

export type RequestValidator = {
  body?: Joi.Schema;
  params?: Joi.Schema;
  query?: Joi.Schema;
};