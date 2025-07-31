import { envVars } from "../config/env";
import { IAgent } from "../modules/agent/agent.interface";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./generateToken";

export const createUserToken = (user: Partial<IUser | IAgent>) => {
  const jwtPayload = {
    id: user._id,
    email: user.email,
    phone:user.phone,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );
  return {
    accessToken,
    refreshToken,
  };
};


