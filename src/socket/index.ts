import config from "../config/config";
import { WebSocketServer } from "ws";
import { socketCallback } from "./socket-callback";
import { Hashmap } from "./types";

const wss = new WebSocketServer({ port: config.wssPort });

const hashmap: Hashmap = new Map();

wss.on("connection", (ws) => {
  socketCallback(ws, hashmap)
});