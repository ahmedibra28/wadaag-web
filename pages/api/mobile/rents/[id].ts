import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Rent, { IRent } from '../../../../models/Rent'
import db from '../../../../config/db'
import { rentSubscription } from '../../../../utils/subscription'
import { regions } from '../../../../utils/regions'
import Profile from '../../../../models/Profile'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()

    try {
      const obj = await Rent.findOne({
        _id: req.query.id,
      }).lean()

      const profile = await Profile.findOne({ user: obj.user }).lean()

      res.status(200).send({
        ...obj,
        user: {
          name: profile?.name,
          mobile: profile?.mobile,
          image: profile?.image,
        },
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

      // check if user has paid the rent advertisement fee
      const rentExpirationDays = await rentSubscription(
        req.user.mobile as number
      )

      if (Number(rentExpirationDays) <= 0)
        return res
          .status(400)
          .json({ error: 'Rent subscription has expired, please renew' })

      const regionObj = regions.find((item) => item.name === region)
      if (!region) return res.status(400).json({ error: 'Region not found' })

      if (!regionObj?.districts.includes(district))
        return res.status(400).json({ error: 'District not found' })

      const updateObj = await Rent.findOneAndUpdate(
        { _id: id },
        {
          user: req.user._id,
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
