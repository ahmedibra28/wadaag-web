import { Schema, model, models } from 'mongoose'

export interface IOwner {
  _id: Schema.Types.ObjectId
  type: string
  name: string
  company?: string
  address?: string
  license?: string
  image?: string

  createdAt?: Date
  status: 'active' | 'deleted'
}

const ownerSchema = new Schema<IOwner>(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    company: String,
    address: String,
    license: String,
    image: String,

    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
  },
  { timestamps: true }
)

const Owner = models.Owner || model('Owner', ownerSchema)

export default Owner
