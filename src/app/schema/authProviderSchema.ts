import { Schema } from "mongoose";
import { IAuthProvider } from "../interfaces/interface";

export const authProviderSchema = new Schema<IAuthProvider>(
    {
        provider: { type: String, required: true },
        providerId:{type:String,required:true}
  },
  { timestamps: true, versionKey: false }
);