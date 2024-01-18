import nc from 'next-connect'
import { getDistricts } from '../../../../utils/banadirDistricts'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const districts = getDistricts()
      res.status(200).json(districts)
    } catch (error: any) {
      res.status(500).json({ error: error?.message })
    }
  }
)

export default handler
