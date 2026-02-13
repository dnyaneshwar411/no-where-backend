import { InferSchemaType, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const channelSchema: Schema = new Schema({
  channel: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    private: true, // used by the toJSON plugin
    select: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

channelSchema.pre("save", async function () {
  const channel = this;
  if (channel.isModified("password")) {
    channel.password = await bcrypt.hash(channel.password as string, 8);
  }
});

type IChannel = InferSchemaType<typeof channelSchema>;

const Channel = model<IChannel>("Channel", channelSchema);

export default Channel;