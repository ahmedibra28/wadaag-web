import Transaction from '../models/Transaction'
import moment from 'moment'
import User from '../models/User'
import UserRole from '../models/UserRole'

export const subscription = async (mobile: number) => {
  const currentDate = new Date()
  const payments = await Transaction.find({
    mobile,
    expireDate: { $gte: moment(currentDate).format() },
  })

  const expiresUntil = payments
    ?.map((payment) =>
      moment(payment?.expireDate).diff(moment(currentDate), 'days')
    )
    ?.reduce((acc, curr) => acc + curr + 1, 0)

  return Number(expiresUntil)
}

export const userType = async (mobile: number) => {
  const user = await User.findOne({
    mobile,
  })

  if (!user) return false

  const userRole = await UserRole.findOne({ user: user?._id }).populate(
    'role',
    ['type']
  )

  return userRole?.role?.type
}
