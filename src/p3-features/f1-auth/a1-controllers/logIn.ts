import {Request, Response} from 'express'
import {BaseError} from '../../../p1-common/c1-errors/BaseError'

export const logIn = (req: Request, res: Response) => {
    const {token} = req.body

    if (token && checkToken(token, res)) {
        sendAnswer(res)
    } else {
        new BaseError(401, 'login', 'not valid token!', {token}).send(res)
    }
}

function checkToken(token: string, res: Response) {
    return true
}

const sendAnswer = (res: Response) => {
    // resCookie(res, token, token + '+' + Date.now() + (1000 * 60 * 60 * 24 * 7))
    res.status(200).json({login: true})
}
