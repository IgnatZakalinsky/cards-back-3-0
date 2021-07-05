import {Request, Response} from 'express'
import {BaseError} from '../c1-errors/BaseError'

export const emailRegExp = /^[\w][\w-.]*@[\w-]+\.[a-z]{2,7}$/i

export const isEmailValid = (email: string): boolean => emailRegExp.test(email) // true - valid

export const isPasswordValid = (password: string): boolean => password.length > 7 // true - valid

export const isValidateAuthWithSendError = (req: Request, res: Response, inInfo: string): boolean => {
    const isEValid = isEmailValid(req.body.email)
    const isPassValid = isPasswordValid(req.body.password)

    if (!isEValid || !isPassValid) {
        new BaseError(
            400,
            inInfo,
            'not valid email/password /ᐠ-ꞈ-ᐟ\\',
            {
                isEmailValid,
                isPassValid,
                emailRegExp,
                passwordRegExp: 'Password must be more than 7 characters...'
            }
        ).sendError(res)
        return false
    } else return true
}