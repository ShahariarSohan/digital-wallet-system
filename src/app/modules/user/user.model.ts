import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { Role } from "../../interfaces/interface";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(Role), default: Role.USER },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },
  wallet: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
  },
});

export const User = model<IUser>("User", userSchema);
