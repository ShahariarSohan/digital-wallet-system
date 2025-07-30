import bcrypt from 'bcryptjs'

 export const bcryptComparePassword = async (givenPassword: string, existingPassword: string) => {
    const passwordMatched = await bcrypt.compare(givenPassword, existingPassword)
    return passwordMatched;
}