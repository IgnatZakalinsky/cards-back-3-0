import {Request, Response} from 'express'
import {BaseError} from '../../../p1-common/c1-errors/BaseError'
import {isValidateAuthWithSendError} from '../../../p1-common/c2-validators/validators'
import bCrypt from 'bcrypt'
import {DBUser} from './DBUser'
import {generateToken} from './tokens'
import v1 from 'uuid/v1'
import {resCookie} from '../../../p2-main/cookie'

export const logIn = async (req: Request, res: Response) => {
    const {email, password, rememberMe, device} = req.body

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
                    const {token, tokenDeathTime} = generateToken(!!rememberMe)

                    const deviceTokens = checkedUsers[0].deviceTokens || []
                    const checkedTokens = deviceTokens
                        .filter(t => (t.tokenDeathTime > Date.now() && t.device !== device))
                    const checkedDevice = device || v1()
                    checkedTokens.push({device: checkedDevice, token, tokenDeathTime})

                    const newUser = await DBUser.updateItemById(
                        checkedUsers[0]._id.toString(),
                        {token, tokenDeathTime, rememberMe: !!rememberMe, deviceTokens: checkedTokens}
                    )
                    const profile = BaseError.checkAndSendError(newUser, res)
                    if (!profile) {
                        throw new BaseError(400, '/update user', 'not updated? /ᐠ｡ꞈ｡ᐟ\\', {email})
                    } else {
                        const obj = profile.toObject()
                        delete obj.password // don't send password to the front
                        delete obj.resetPasswordToken
                        delete obj.resetPasswordTokenDeathTime
                        delete obj.deviceTokens

                        return {...obj, device: checkedDevice}
                    }
                }
            },
            'logIn',
            {email, password, rememberMe}
        )

        user && resCookie(res, user.token || '', user.tokenDeathTime || 0, user.device)
            .status(200).json(user)
    }
}


