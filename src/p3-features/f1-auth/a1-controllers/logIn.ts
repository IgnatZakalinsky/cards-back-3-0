import {Request, Response} from 'express'
import {BaseError} from '../../../p1-common/c1-errors/BaseError'
import {isValidateAuthWithSendError} from '../../../p1-common/c2-validators/validators'
import bCrypt from 'bcrypt'
import {DBUser} from './DBUser'

export const logIn = async (req: Request, res: Response) => {
    const {email, password, rememberMe} = req.body

    if (isValidateAuthWithSendError(req, res, 'logIn')) {
        const user = await BaseError.withTryAndSendError(
            res,
            async () => {
                const users = await DBUser.readArray({email}, {})

                    const checkedUsers = BaseError.checkAndSendError(users, res)
                    if (!checkedUsers || !checkedUsers.length) {
                        throw new BaseError(400, '/find user', 'user not found /ᐠ-ꞈ-ᐟ\\', {email})
                    } else if (!(await bCrypt.compare(password, checkedUsers[0].password))) {
                        throw new BaseError(
                            400,
                            '/chek password',
                            'not correct password /ᐠ-ꞈ-ᐟ\\',
                            {email, password}
                        )
                    } else {
                        // const [token, tokenDeathTime] = generateToken(!!rememberMe)

                        // try {
                        //     const newUser: IUser | null = await User.findByIdAndUpdate(
                        //         user._id,
                        //         {token, tokenDeathTime, rememberMe: !!rememberMe},
                        //         {new: true}
                        //     ).exec();

                            // if (!newUser) res.status(500)
                            //     .json({error: "not updated? /ᐠ｡ꞈ｡ᐟ\\", in: "logIn/User.findByIdAndUpdate"});

                            // else {

                                // if (DEV_VERSION) console.log('IUser?: ', {...newUser}); // for dev => _doc!!!
                                // await getMe(req, res, newUser._doc as IUser)
                        const profile = checkedUsers[0]

                        delete profile.password // don't send password to the front
                        delete profile.resetPasswordToken
                        delete profile.resetPasswordTokenDeathTime
                        delete profile.deviceTokens

                        return profile

                            // }
                        // } catch (e) {
                        //     res.status(500).json({
                        //         error: "some error: " + e.message,
                        //         info: "Back doesn't know what the error is... ^._.^",
                        //         errorObject: DEV_VERSION && {...e},
                        //         in: "logIn/User.findByIdAndUpdate",
                        //     });
                        // }
                    }
            },
            'logIn',
            {email, password, rememberMe}
        )

        user && res.status(200).json(user)
    }
}


