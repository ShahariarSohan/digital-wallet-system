import { model, Schema } from "mongoose";
import { Role } from "../../interfaces/interface";
import { authProviderSchema } from "../../schema/authProviderSchema";
import { ApprovalStatus, IAgent } from "./agent.interface";

const agentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    phone: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    picture:{type:String},
    role: { type: String, default: Role.AGENT },
    auths: { type: [authProviderSchema] },
    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.PENDING,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
  },
  { timestamps: true, versionKey: false }
);

export const Agent = model<IAgent>("Agent", agentSchema);
