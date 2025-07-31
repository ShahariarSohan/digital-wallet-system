import { model, Schema } from "mongoose";
import { Role } from "../../interfaces/interface";
import { authProviderSchema } from "../../schema/authProviderSchema";
import { ApprovalStatus, IAgent } from "./agent.interface";

const agentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: Role.AGENT },
    auths: { type: [authProviderSchema] },
    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.PENDING,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    commission: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

export const Agent = model<IAgent>("Agent", agentSchema);
