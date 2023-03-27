import { Schema, model, models } from 'mongoose'
import User from './User'

export interface IProfile {
  _id: Schema.Types.ObjectId
  name?: string
  image?: string
  address?: string
  mobile?: number
  bio?: string
  user: Schema.Types.ObjectId
  sex: string
  createdAt?: Date
  plate?: string
  license?: string
  district?: string
}

const profileSchema = new Schema<IProfile>(
  {
    name: String,
    image: String,
    address: String,
    mobile: Number,
    bio: String,
    sex: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    plate: { type: String, uppercase: true, trim: true },
    license: String,
    district: String,
  },
  { timestamps: true }
)

const Profile = models.Profile || model('Profile', profileSchema)

export default Profile
