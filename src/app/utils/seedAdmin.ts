import { envVars } from "../config/env";
import { IAuthProvider, Role } from "../interfaces/interface";
import { IAdmin } from "../modules/admin/admin.interface";
import { Admin } from "../modules/admin/admin.model";



import { bcryptHashPassword } from "./hashPassword";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await Admin.findOne({ email: envVars.ADMIN_EMAIL });
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
    const payload: IAdmin = {
      name: "Admin",
      email: envVars.ADMIN_EMAIL,
      password: hashPassword,
      phone:envVars.ADMIN_PHONE,
      role:Role.ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    const admin = await Admin.create(payload);
    console.log("Admin Successfully Created", admin);
  } catch (error) {
    console.log("Admin creation failed", error);
  }
};
