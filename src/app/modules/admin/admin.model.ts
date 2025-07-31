import { model, Schema } from "mongoose";

import { Role } from "../../interfaces/interface";
import { authProviderSchema } from "../../schema/authProviderSchema";
import { IAdmin } from "./admin.interface";


const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    phone: { type: String ,required:true,unique:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: Role.ADMIN },
    auths: { type: [authProviderSchema] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const Admin = model<IAdmin>("Admin", adminSchema);
