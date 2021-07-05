import env from 'dotenv'

export const IS_DEVELOPER_VERSION = !process.env.PORT // false if release
IS_DEVELOPER_VERSION && env.config() // set env in developer mode (go to example.env)

export const VERSION = '/3.0'

export const PORT = process.env.PORT || 7542

export const USER_NAME = process.env.MONGO_DB_USER_NAME || ''
export const PASSWORD = process.env.MONGO_DB_USER_PASSWORD || ''
export const MONGO_DB_URL = process.env.MONGO_DB_URL || ''
