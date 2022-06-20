import Payment from '../models/Payment'
import Profile from '../models/Profile'

export const subscription = async (mobile) => {
  const payments = await Payment.find({
    mobileNumber: mobile,
  })

  const perDayAmount = 1 / 30

  const lastPayment = payments[payments.length - 1]

  const lastPaidAmount = lastPayment?.amount

  const days = Math.ceil(
    (new Date(Date.now()) - new Date(lastPayment.date)) / (1000 * 60 * 60 * 24)
  )

  if (days * perDayAmount > lastPaidAmount) return 0

  return Math.round(lastPaidAmount / perDayAmount - days)
}

export const userType = async (mobile) => {
  const profile = await Profile.findOne({
    mobileNumber: mobile,
  })

  if (!profile) return false

  if (profile.userType === 'rider' || profile.userType === 'user') return true

  return false
}
