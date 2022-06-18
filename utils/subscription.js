import Payment from '../models/Payment'
import Profile from '../models/Profile'

export const subscription = async (mobile) => {
  const payments = await Payment.find({
    mobileNumber: mobile,
  })

  const last30Days = payments.filter(
    (payment) =>
      new Date(payment.date).getTime() >
      new Date().getTime() - 30 * 24 * 60 * 60 * 1000
  )
  const totalAmountLast30Days = last30Days.reduce(
    (acc, curr) => acc + curr.amount,
    0
  )

  const daysLeft = totalAmountLast30Days * 30
  return daysLeft
}

export const userType = async (mobile) => {
  const profile = await Profile.findOne({
    mobileNumber: mobile,
  })

  if (!profile) return false

  if (profile.userType === 'rider' || profile.userType === 'user') return true

  return false
}
