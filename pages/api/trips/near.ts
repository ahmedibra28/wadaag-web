import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import Trip, { ITrip } from '../../../models/Trip'
import { isAuth } from '../../../utils/auth'
import { subscription, userType } from '../../../utils/subscription'

const schemaName = Trip

const handler = nc()
handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { origin, destination } = req.body
      const { _id, mobile } = req.user

      const subscriptionRemainingDays = await subscription(mobile as number)

      if (Number(subscriptionRemainingDays) <= 0)
        return res.status(400).json({ error: 'Subscription expired' })

      const isRider = await userType(mobile as number)
      if (isRider !== 'RIDER')
        return res.status(400).json({ error: 'You are not a rider' })

      const isRiderPending = await schemaName.findOne({
        status: 'pending',
        rider: _id,
      })
      if (isRiderPending)
        return res.status(400).json({ error: 'You have a uncompleted trip' })

      const nearCurrentLocation = await schemaName.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [origin?.location?.lat, origin?.location?.lng],
            },
            distanceField: 'calculatedDistance',
            maxDistance: 5000,
            query: {
              status: 'pending',
            },
            spherical: true,
            key: 'currentLocation.location',
          },
        },
      ])

      let nearOrigin = []

      if (!nearCurrentLocation || nearCurrentLocation.length < 1) {
        nearOrigin = await schemaName.aggregate([
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [origin?.location?.lat, origin?.location?.lng],
              },
              distanceField: 'calculatedDistance',
              maxDistance: 5000,
              query: {
                status: 'pending',
              },
              spherical: true,
              key: 'origin.location',
            },
          },
        ])
      }

      const nearDestination = await schemaName.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [
                destination?.location?.lat,
                destination?.location?.lng,
              ],
            },
            distanceField: 'calculatedDistance',
            maxDistance: 5000,
            query: {
              status: 'pending',
            },
            spherical: true,
            key: 'destination.location',
          },
        },
      ])

      if (
        (nearCurrentLocation.length === 0 && nearOrigin.length === 0) ||
        nearDestination.length === 0
      )
        return res
          .status(400)
          .json({ error: 'No riders found at your location' })

      // combine origin and destination
      const combinedArrays = [
        ...nearCurrentLocation,
        ...nearDestination,
        ...nearOrigin,
      ]

      // get duplicates
      const duplicates = combinedArrays
        .map((c) => c._id.toString())
        .filter((e, index, arr) => arr.indexOf(e) !== index)

      const uniqueValues = combinedArrays.filter((c) =>
        duplicates.includes(c._id.toString())
      )

      // remove duplicate from arrays
      const uniques: any[] = []

      uniqueValues.forEach((el) => {
        const isDuplicate = uniques
          .map((u) => u._id.toString())
          .includes(el._id.toString())

        if (!isDuplicate) {
          uniques.push(el)
        }
      })

      // add returned values to an (image, mobile, name)
      const results = Promise.all(
        uniques.map(async (near: ITrip) => {
          const profile = await Profile.findOne({
            user: near.rider,
          })

          return {
            name: profile?.name,
            mobile: profile?.mobile,
            image: profile?.image,
            ...near,
          }
        })
      )

      const riders = await results

      return res.status(200).send(riders)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
