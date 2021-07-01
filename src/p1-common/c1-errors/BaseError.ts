import {Response} from 'express'
import {IS_DEVELOPER_VERSION} from '../../p0-config/config'
import {deepCopySafely, toSimpleSafely} from './errors'

export type BaseErrorType = 400 | 401 | 500 // код ошибки, можно расширять

export class BaseError {
    constructor(
        public type: BaseErrorType,
        public inTry: string, // где произошла ошибка
        public e: any, // текст ошибки (400, +) или ошибка (500)
        public more?: any // данные, которые могут помочь понять в чём ошибка
    ) {
    }

    // отправка ответа
    send(res: Response) {
        const error = IS_DEVELOPER_VERSION
            ? 'try later'
            : this.type === 500
                ? 'some error: ' + (
                (this.e !== null && typeof this.e === 'object') ? this.e.message : toSimpleSafely(this.e)
            )
                : this.e

        res.status(this.type).json({
            more: this.more,
            inTry: this.inTry,
            errorObj: this.type === 500 && IS_DEVELOPER_VERSION ? deepCopySafely(this.e, 3) : undefined, // превращение ошибки в объект
            error,
            info: this.type === 500 // стандартное описание ошибки
                ? "Back doesn't know what the error is... ^._.^"
                : 'Check your request! /ᐠ-ꞈ-ᐟ\\',
        })
    }

    logInDb: any

    log() {
        this.logInDb && this.logInDb()
    }

    // промис с отловом ошибок
    static withTry = <A>(
        getAnswer: () => A,
        inTry: string,
        more?: any
    ) => {
        try {
            return getAnswer()
        } catch (e) {
            if (e instanceof BaseError) {
                return e

            } else {
                const er = new BaseError(500, 'withTry/' + inTry, e, more)
                er.log()
                return er
            }
        }
    }


    // промис с отловом ошибок и автоматической отправкой ошибки на фронт
    static withTryAndSend = <A>(
        response: Response,
        getAnswer: () => A,
        inTry: string,
        more?: any
    ) => {
        try {
            const answer = BaseError.withTry(getAnswer, 'withTryAndSend/' + inTry, more)

            if (answer instanceof BaseError) {
                answer.send(response)
                return null
            } else {
                return answer
            }
        } catch (e) { // maybe never
            const er = new BaseError(500, 'withTryAndSend/' + inTry, e, more)
            er.log()
            er.send(response)
            return null
        }
    }
}
