import UserModel, {IUser} from '../a0-models/UserModel'
import {DB} from '../../../p1-common/c5-db/db'

export const DBUser = new DB<IUser>(UserModel, 'User', x => x)