import { joinChannel } from "./events-handlers";
import { EventMapType } from "./types";

export const eventMap: EventMapType[] = [
  // { id: 1, event: "message", handler: message },
  { id: 2, event: "join-channel", handler: joinChannel },
];
