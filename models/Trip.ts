import { Schema, model, models } from 'mongoose'
import User from './User'

export interface ITrip {
  _id: Schema.Types.ObjectId
  rider: Schema.Types.ObjectId
  driver?: Schema.Types.ObjectId
  origin: {
    description: string
    location: {
      lat: number
      lng: number
    }
  }
  destination: {
    description: string
    location: {
      lat: number
      lng: number
    }
  }
  currentLocation: {
    description: string
    location: {
      lat: number
      lng: number
    }
  }
  finishedLocation: {
    description: string
    location: {
      lat: number
      lng: number
    }
  }
  finishedDistance: string
  distance: string
  duration: string
  status: 'pending' | 'completed' | 'cancelled' | 'expired'
  createdAt?: Date
  dealt: boolean
}

const tripSchema = new Schema<ITrip>(
  {
    rider: { type: Schema.Types.ObjectId, required: true, ref: User },
    driver: { type: Schema.Types.ObjectId, ref: User },
    origin: {
      description: { type: String, required: true },
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    destination: {
      description: { type: String, required: true },
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    currentLocation: {
      description: String,
      location: {
        lat: Number,
        lng: Number,
      },
    },
    finishedLocation: {
      description: String,
      location: {
        lat: Number,
        lng: Number,
      },
    },
    finishedDistance: { type: String },
    distance: { type: String, required: true },
    duration: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'expired'],
      default: 'pending',
    },
    dealt: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Trip = models.Trip || model('Trip', tripSchema)

export default Trip
