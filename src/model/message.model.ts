import { InferSchemaType, model, Schema } from "mongoose";

const messageSchema = new Schema({
  content: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["string", "img"],
  },
});

type IMessage = InferSchemaType<typeof messageSchema>;

const Message = model<IMessage>("Message", messageSchema);

export default Message;
