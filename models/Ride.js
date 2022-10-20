import mongoose from 'mongoose'
import User from './User'

const rideScheme = mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    origin: {},
    destination: {},
    distance: { type: String, required: true },
    duration: { type: String, required: true },
    originLatLng: { type: String, required: true },
    destinationLatLng: { type: String, required: true },
    plate: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

const Ride = mongoose.models.Ride || mongoose.model('Ride', rideScheme)
export default Ride
