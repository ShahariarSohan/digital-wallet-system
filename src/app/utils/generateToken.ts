import { JwtPayload, SignOptions } from "jsonwebtoken";
import  jwt  from "jsonwebtoken";

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn:expiresIn
    }as SignOptions)
    return token
}