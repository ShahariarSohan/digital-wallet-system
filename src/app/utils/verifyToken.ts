import jwt from "jsonwebtoken";

export const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.sign(token, secret);
  return verifiedToken;
};
