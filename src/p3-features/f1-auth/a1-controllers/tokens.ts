// import mongoose from "mongoose"
import v1 from 'uuid/v1'

// export const generateResetPasswordToken = async (userId: mongoose.Types.ObjectId) => {
//     // const chars = "ADEFGHJLMNPQRTYabdefghijmnpqrty2345679!@#$%^&*()-+=?.,"; // Il1Oo0CcSsUuVvWwXxZzB8Kk
//     //
//     // let password = "";
//     // for (let i = 0; i < 9; i++) {
//     //     password += chars[Math.floor(Math.random() * chars.length)];
//     // }
//
//     const resetPasswordToken = uuidv1();
//
//     await User.findByIdAndUpdate(
//         userId,
//         {resetPasswordToken, resetPasswordTokenDeathTime: Date.now() + (1000 * 60 * 10)}, // 10 min
//         {new: true}
//     ).exec();
//
//     return resetPasswordToken;
// };

export const generateToken = (rememberMe?: boolean): {token: string, tokenDeathTime: number} => {
    const token = v1()
    const tokenDeathTime = rememberMe
        ? Date.now() + (1000 * 60 * 60 * 24 * 7) // 7 days
        : Date.now() + (1000 * 60 * 60 * 3) // 3 hours

    return {token, tokenDeathTime}
}