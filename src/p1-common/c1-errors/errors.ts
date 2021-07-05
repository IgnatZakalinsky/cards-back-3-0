export const toSimpleSafely = (value: any) => {
    if (typeof value === 'boolean'
        || typeof value === 'number'
        || typeof value === 'string'
        || typeof value === 'undefined'
        || value === null
    ) return value
    else if (typeof value === 'object') return value.toString()
    else return 'some ' + typeof value
}

export const deepCopySafely = (o: any, depth: number) => {
    if (depth === 0 || typeof o !== 'object' || o === null) return toSimpleSafely(o)
    else {
        const newO: any = {}
        for (const p of Object.keys(o)) {
            newO[p] = deepCopySafely(o[p], depth - 1)
        }
        return newO
    }
}

export const onUncaughtException = (f?: (e?: string) => void) => {
    process.on('uncaughtException', (e) => {
        const dp = deepCopySafely(e, 3) // !!! error copy in 3 lvl
        f && f(JSON.stringify(['uncaughtException', dp])) // log in db

        console.log(`!!! Uncaught Exception${f ? ' with log in db' : ''}: `, dp, e)
    })
}

export const onUnhandledRejection = (f?: (e?: string) => void) => {
    process.on('unhandledRejection', (reason, p) => {
        const dp = deepCopySafely(reason, 3)
        f && f(JSON.stringify(['unhandledRejection reason', dp])) // log in db

        console.log(`!!! Unhandled Rejection${f ? ' with log in db' : ''}: `, dp, reason)

        p.then(x => {
            const dpx = deepCopySafely(x, 3)
            f && f(JSON.stringify(['unhandledRejection !!! then: ', dpx])) // log in db
            console.log('!!! then: ', dpx, x)
        })
            .catch(e => {
                const dpe = deepCopySafely(e, 3)
                f && f(JSON.stringify(['unhandledRejection !!! catch: ', dpe])) // log in db
                console.log('!!! catch: ', dpe, e)
            })
    })
}

/** отлов ошибок чтоб сервер не падал
 */
export const globalCatch = (fUncaught?: (e?: string) => void, fUnhandled?: (e?: string) => void) => {
    onUncaughtException(fUncaught)
    onUnhandledRejection(fUnhandled)
}
