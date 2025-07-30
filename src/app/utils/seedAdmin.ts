import { envVars } from "../config/env";
import { IAuthProvider, Role } from "../interfaces/interface";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { bcryptHashPassword } from "./hashPassword";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({ email: envVars.ADMIN_EMAIL });
    if (isAdminExist) {
      console.log("Admin Already Exist");
      return;
    }
    const hashPassword = await bcryptHashPassword(
      envVars.ADMIN_PASS,
      envVars.BCRYPT_SALT_ROUND
    );
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };
    const payload: IUser = {
      name: "Admin",
      email: envVars.ADMIN_EMAIL,
      password: hashPassword,
      role: Role.ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    const admin = await User.create(payload);
    console.log("Admin Successfully Created", admin);
  } catch (error) {
    console.log("Admin creation failed", error);
  }
};
