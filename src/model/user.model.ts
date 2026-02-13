import { model, Schema, InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  channel: {
    type: Schema.Types.ObjectId,
    ref: "Channel",
  },
  user: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    private: true, // used by the toJSON plugin
    select: false,
  },
  banner: {
    type: Boolean,
    default: false,
  },
}, {
  methods: {
    /**
     * Check if password matches the user's password
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    isPasswordMatch: async function (password: string) {
      const user = this;
      return bcrypt.compare(password, user.password);
    }
  }
});

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

export type IUser = InferSchemaType<typeof userSchema>;

const User = model<IUser>("User", userSchema);

export default User;
