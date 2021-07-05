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

    /** отправка ошибки
     */
    sendError(res: Response) {
        const error = IS_DEVELOPER_VERSION
            ? 'try later'
            : this.type === 500
                ? 'some error: ' + (
                (this.e !== null && typeof this.e === 'object') ? this.e.message : toSimpleSafely(this.e)
            )
                : this.e

        this.log()

        res.status(this.type).json({
            more: this.more,
            inTry: this.inTry,
            errorObj: (this.type === 500 && IS_DEVELOPER_VERSION) ? deepCopySafely(this.e, 3) : undefined, // превращение ошибки в объект
            error,
            info: this.type === 500 // стандартное описание ошибки
                ? 'Back doesn\'t know what the error is... ^._.^'
                : 'Check your request! /ᐠ-ꞈ-ᐟ\\',
        })
    }

    static logInDB: any
    static setLogInDB = (f: (error: BaseError) => void) => {
        BaseError.logInDB = f
    }

    log() {
        BaseError.logInDB && BaseError.logInDB(this)
    }

    /** автоматическая отправка ошибки если ошибка
     */
    static checkAndSendError = <A>(answer: A | BaseError, res: Response): A | null => {
        if (answer instanceof BaseError) {
            answer.sendError(res)
            return null
        } else {
            return answer
        }
    }

    /** промис с отловом ошибок
     */
    static withTry = async <A>(
        getAnswer: () => Promise<A>,
        inTry: string,
        more?: any
    ) => {
        try {
            return await getAnswer()
        } catch (e) {
            if (e instanceof BaseError) {
                return e

            } else {
                return new BaseError(500, inTry + '/withTry', e, more)
            }
        }
    }


    /** промис с отловом ошибок и автоматической отправкой ошибки на фронт
     */
    static withTryAndSendError = async <A>(
        response: Response,
        getAnswer: () => Promise<A>,
        inTry: string,
        more?: any
    ): Promise<A | null> => {
        const answer = await BaseError.withTry(getAnswer,  inTry + '/withTryAndSendError', more)

        return BaseError.checkAndSendError(answer, response)
    }
}
