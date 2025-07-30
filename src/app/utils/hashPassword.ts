
import bcrypt from 'bcryptjs'


export const bcryptHashPassword = async(password: string, saltRound: string) => {
    const hashPassword = await bcrypt.hash(password, Number(saltRound))
    return hashPassword;
}