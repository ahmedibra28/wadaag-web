import { configureStore } from '@reduxjs/toolkit'
import tripReducer from './slice/trip'

export const store = configureStore({
  reducer: {
    trip: tripReducer,
  },
})
