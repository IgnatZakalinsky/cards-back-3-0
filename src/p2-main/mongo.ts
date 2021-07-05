import mongoose from 'mongoose'
import {deepCopySafely, globalCatch} from '../p1-common/c1-errors/errors'
import {USER_NAME, PASSWORD, MONGO_DB_URL} from '../p0-config/config'

export const MONGO_DB_URIS = `mongodb+srv://${USER_NAME}:${PASSWORD}@${MONGO_DB_URL}?retryWrites=true&w=majority`

export const useMongo = (f: Function) => {
    mongoose.connect(MONGO_DB_URIS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
        .then(() => {
            console.log('MongoDB connected successfully! —ฅ/ᐠ.̫.ᐟ\\ฅ—')

            globalCatch(
                (e) => {
                    console.log('log in db: ', e)
                },
                (e) => {
                    console.log('log in db: ', e)
                }
            )

            f()
        })
        .catch(e => console.log('!!! MongoDB connection error: ', deepCopySafely(e, 3), e))
}
