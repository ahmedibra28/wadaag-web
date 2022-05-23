import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  from: '',
  to: '',
  distance: '',
  duration: '',
  directionsResponse: null,
  plate: '',
  _id: '',
  riderTwo: {
    from: '',
    to: '',
    duration: '',
    distance: '',
    directionsResponse: null,
    plate: '',
    _id: '',
  },
}

export const trip = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    startTrip: (state, { payload }) => {
      state.from = payload.from
      state.to = payload.to
      state.distance = payload.distance
      state.duration = payload.duration
      state.directionsResponse = payload.directionsResponse
    },
    plateConfirmation: (state, { payload }) => {
      state.plate = payload.plate
      state._id = payload._id
    },
    cancelTrip: (state) => {
      state.from = ''
      state.to = ''
      state.distance = ''
      state.duration = ''
      state.directionsResponse = null
      state.plate = ''
      state._id = ''
    },
    startRiderTwoTrip: (state, { payload }) => {
      state.riderTwo.from = payload.from
      state.riderTwo.to = payload.to
      state.riderTwo.distance = payload.distance
      state.riderTwo.duration = payload.duration
      state.riderTwo.directionsResponse = payload.directionsResponse
      state.riderTwo.plate = payload.plate
      state.riderTwo._id = payload._id
    },
    cancelRiderTwoTrip: (state) => {
      state.riderTwo.from = ''
      state.riderTwo.to = ''
      state.riderTwo.distance = ''
      state.riderTwo.duration = ''
      state.riderTwo.directionsResponse = null
      state.riderTwo.plate = ''
      state.riderTwo._id = ''
    },
  },
})

export const {
  startTrip,
  plateConfirmation,
  cancelTrip,
  startRiderTwoTrip,
  cancelRiderTwoTrip,
} = trip.actions

export default trip.reducer
