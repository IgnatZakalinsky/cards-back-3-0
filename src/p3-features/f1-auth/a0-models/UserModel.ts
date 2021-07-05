import mongoose, {Schema, Document, Model} from 'mongoose'

// export const uniqueUserProperties: (keyof IUser)[] = ['email']

export type DeviceTokenType = {
    device?: string
    token?: string
    tokenDeathTime?: number
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    email: string
    password: string
    rememberMe: boolean
    isAdmin: boolean

    name: string
    verified: boolean
    avatar?: string
    publicCardPacksCount: number

    token?: string
    tokenDeathTime?: number
    resetPasswordToken?: string
    resetPasswordTokenDeathTime?: number
    deviceTokens?: DeviceTokenType[]

    created: Date
    updated: Date
}

const DeviceToken = new Schema(
    {
        device: {
            type: String
        },
        token: {
            type: String,
        },
        tokenDeathTime: {
            type: Number,
        },
    }
)

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        rememberMe: {
            type: Boolean,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            required: true
        },
        avatar: {
            type: String,
        },
        publicCardPacksCount: {
            type: Number,
            required: true
        },

        token: {
            type: String,
        },
        tokenDeathTime: {
            type: Number,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordTokenDeathTime: {
            type: Number,
        },
        deviceTokens: [{
            type: DeviceToken
        }],

    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        },
    }
)

const UserModel: Model<IUser> = mongoose.model<IUser>('cards-nya-user', UserSchema)

export default UserModel
