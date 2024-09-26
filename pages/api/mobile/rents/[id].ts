import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Rent, { IRent } from '../../../../models/Rent'
import db from '../../../../config/db'
import { getDistrictsByLabel } from '../../../../utils/banadirDistricts'
import RentUser from '../../../../models/RentUser'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()

    try {
      const obj = await Rent.findOne({
        _id: req.query.id,
      }).lean()

      const rentUser = await RentUser.findOne({ user: obj.rentUser }).lean()

      res.status(200).send({
        ...obj,
        user: rentUser,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const {
        region,
        district,
        type,
        rooms,
        kitchen,
        toilet,
        images,
        price,
        description,
        hasBalcony,
        hasDeposit,
        hasUpFront,
        deposit,
        contact,
        status,
        rentType,
      } = req.body as IRent

      const { id } = req.query

      const rentUser = await RentUser.findOne({ user: req.user._id })
      const remainingDays =
        moment(rentUser?.expiredAt).diff(moment(), 'days') || 0

      if (Number(remainingDays) <= 0)
        return res
          .status(400)
          .json({ error: 'Rent subscription has expired, please renew' })

      if (!region) return res.status(400).json({ error: 'Region not found' })

      if (!getDistrictsByLabel(district))
        return res.status(400).json({ error: 'District not found' })

      const updateObj = await Rent.findOneAndUpdate(
        { _id: id },
        {
          region,
          district,
          type,
          rooms,
          kitchen,
          toilet,
          images,
          price,
          description,
          hasBalcony,
          hasDeposit,
          hasUpFront,
          deposit,
          contact,
          status,
          rentType,
        },
        {
          // return updated object
          new: true,
        }
      )

      if (!updateObj)
        return res
          .status(400)
          .json({ error: 'rent not found or updating failed' })

      return res.status(200).send(updateObj)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const obj = await Rent.findOneAndUpdate(
        {
          _id: id,
        },
        {
          status: 'deleted',
        }
      )

      if (!obj)
        return res
          .status(400)
          .json({ error: 'rent not found or deleting failed' })

      res
        .status(200)
        .json({ message: `Rent ${obj.region} deleted successfully` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
