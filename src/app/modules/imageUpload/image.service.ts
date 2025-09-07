import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { Agent } from "../agent/agent.model";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloudinary } from "../../config/cloudinary";

const imageUpload = async (
  id: string,
  picture: string,
  decodedToken: JwtPayload
) => {
  if (id !== decodedToken.id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not permitted to upload image"
    );
  }
  let account = await User.findById(id);
  if (!account) {
    account = await Agent.findById(id);
  }
  if (!account) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Account exist");
  }
  if (!account.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not Verified");
  }
  if (!account.isActive || account.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted");
    }
    const oldPicture=account.picture
     account.picture = picture;
    await account.save();
    
    if (picture && oldPicture) {
      await deleteImageFromCloudinary(oldPicture);
  }
    
};

export const imageServices = {
  imageUpload,
};
