import mongoose, {Schema, Document, Model} from 'mongoose'

export const uniqueUserProperties: (keyof IUser)[] =
    []

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId

    name: string

    created: Date
    updated: Date
}

// const ViewedVideo = new Schema(
//     {
//         pl_id: {
//             type: String
//         },
//         v_id: {
//             type: String
//         },
//     }
// )

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        // viewedVideo: [{
        //     type: ViewedVideo
        // }],

    },

    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        },
    }
)

const UserModel: Model<IUser> = mongoose.model<IUser>('ii-user', UserSchema)

export default UserModel
