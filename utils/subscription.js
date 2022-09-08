import Transaction from '../models/Transaction'
import Profile from '../models/Profile'
import moment from 'moment'

// // Plan B function
// export const subscription = async (mobile) => {
//   const payments = await Payment.find({
//     mobileNumber: mobile,
//   })

//   if (payments.length === 0) return 0

//   const perDayAmount = 1 / 30

//   const lastPayment = payments[payments.length - 1]

//   const lastPaidAmount = lastPayment?.amount

//   const days = Math.ceil(
//     (new Date(Date.now()) - new Date(lastPayment.date)) / (1000 * 60 * 60 * 24)
//   )

//   if (days * perDayAmount > lastPaidAmount) return 0

//   return Math.round(lastPaidAmount / perDayAmount - days)
// }

// Plan A function
export const subscription = async (mobile) => {
  const currentDate = new Date()
  const payments = await Transaction.find({
    mobileNumber: mobile,
    expireDate: { $gte: moment(currentDate).format() },
  })

  const expiresUntil = payments
    ?.map((payment) =>
      moment(payment?.expireDate).diff(moment(currentDate), 'days')
    )
    ?.reduce((acc, curr) => acc + curr + 1, 0)

  return expiresUntil
}

export const userType = async (mobile) => {
  const profile = await Profile.findOne({
    mobileNumber: mobile,
  })

  if (!profile) return false

  if (profile.userType === 'rider' || profile.userType === 'admin') return true

  return false
}
