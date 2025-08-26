import { model, Schema } from "mongoose";
import { IUser, userStatus } from "./user.interface";
import { Role } from "../../interfaces/interface";
import { authProviderSchema } from "../../schema/authProviderSchema";


const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    picture:{type:String},
    role: { type: String, default: Role.USER },
    auths: { type: [authProviderSchema] },
     status: {
          type: String,
          enum: Object.values(userStatus),
          default: userStatus.UNBLOCK,
        },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default:true },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
