import { Schema, model } from "mongoose";
import { Role } from "../../interfaces/interface";
import { authProviderSchema } from "../../schema/authProviderSchema";
import { IAdmin } from "./admin.interface";


const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true,unique:true},
    password: { type: String },
    picture: { type: String },
    role: { type: String, default: Role.ADMIN },
    auths: { type: [authProviderSchema] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },

    // New fields
    alertMode: {
      type: String,
      enum: ["toast", "sweetalert"],
      default: "toast",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "light",
    },
    language: { type: String, enum: ["en", "bn", "es"], default: "en" },
  },
  { timestamps: true, versionKey: false }
);

export const Admin = model<IAdmin>("Admin", adminSchema);
