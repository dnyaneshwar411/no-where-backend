import { InferSchemaType, model, Schema } from "mongoose";

const channelSchema: Schema = new Schema({
  channel: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

type IChannel = InferSchemaType<typeof channelSchema>;

const Channel = model<IChannel>("Channel", channelSchema);

export default Channel;