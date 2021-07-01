import express from 'express'
import {useApp} from './p2-main/app'
import {useRoutes} from './p2-main/useRoutes'
import {useMongo} from './p2-main/mongo'
import {PORT} from './p0-config/config'
import {globalCatch} from './p1-common/c1-errors/errors'

globalCatch()
const app = express()

useApp(app)
useRoutes(app)
useMongo(() => {
    app.listen(PORT, () => {
        console.log('ii-personal-area-back listening on port: ' + PORT)

        // throw new Error('test')
    })
})