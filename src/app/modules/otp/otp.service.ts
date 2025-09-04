import { Agent } from "./../agent/agent.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { generateOtp } from "../../utils/generateOtp";
import { redisClient } from "../../config/redis";
import { sendEmail } from "../../utils/sendEmail";


const sendOtp = async (email: string, name: string) => {
  let account = await User.findOne({ email });
  if (!account) {
    account = await Agent.findOne({ email });
  }
  if (!account) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email doesn't exist");
  }
  if (account.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Verified");
  }

  const otp = generateOtp();
  const redisKey = `otp:${email}`;
  console.log(otp, redisKey);
  console.log("Redis open?", redisClient.isOpen);
  const result = await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: 2 * 60,
    },
  });
  console.log("After set", result);

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
  console.log("run3");
};

const verifyOtp = async (email: string, otp: string) => {
  let account = await User.findOne({ email });
  if (!account) {
    account = await Agent.findOne({ email });
  }
  if (!account) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email doesn't exist");
  }
  if (account.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Verified");
  }
  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);
  if (!savedOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }
  if (savedOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }
 account.isVerified = true;
 await account.save();
  await redisClient.del(redisKey);
};

export const otpServices = {
  sendOtp,
  verifyOtp,
};
