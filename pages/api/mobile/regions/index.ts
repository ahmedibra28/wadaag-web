import nc from 'next-connect'
import { regions } from '../../../../utils/regions'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      res.status(200).json(regions)
    } catch (error: any) {
      res.status(500).json({ error: error?.message })
    }
  }
)

export default handler
