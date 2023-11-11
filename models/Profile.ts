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
  createdAt?: Date
  sex: string
  district?: string
  hasRentalProfile?: boolean
  type?: 'INDIVIDUAL' | 'COMPANY'
  company?: string
  license?: string
}

const profileSchema = new Schema<IProfile>(
  {
    name: String,
    image: String,
    address: String,
    mobile: Number,
    bio: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    sex: String,
    district: String,

    type: {
      type: String,
      enum: ['INDIVIDUAL', 'COMPANY'],
    },
    hasRentalProfile: {
      type: Boolean,
      default: false,
    },
    company: String,
    license: String,
  },
  { timestamps: true }
)

const Profile = models.Profile || model('Profile', profileSchema)

export default Profile
