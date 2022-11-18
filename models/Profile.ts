import { Schema, model, models } from 'mongoose'
import User from './User'

export interface IProfile {
  _id: Schema.Types.ObjectId
  name?: string
  image?: string
  address?: string
  mobile?: string
  bio?: string
  user: Schema.Types.ObjectId
  createdAt?: Date
  plate?: string
  license?: string
  referral?: Schema.Types.ObjectId
}

const profileSchema = new Schema<IProfile>(
  {
    name: String,
    image: String,
    address: String,
    mobile: String,
    bio: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    plate: { type: String, uppercase: true, trim: true },
    license: String,
    referral: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
)

const Profile = models.Profile || model('Profile', profileSchema)

export default Profile
