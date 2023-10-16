import nc from 'next-connect'
import fileUpload from 'express-fileupload'
export const config = { api: { bodyParser: false } }

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import sharp from 'sharp'

const handler = nc()
handler.use(fileUpload())

export function getEnvVariable(key: string): string {
  const value = process.env[key]

  if (!value || value.length === 0) {
    console.log(`The environment variable ${key} is not set.`)
    throw new Error(`The environment variable ${key} is not set.`)
  }

  return value
}

export const s3Client = new S3Client({
  endpoint: getEnvVariable('AWS_DO_ENDPOINT'),
  forcePathStyle: true,
  region: 'us-east-1',
  credentials: {
    accessKeyId: getEnvVariable('AWS_DO_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVariable('AWS_DO_ACCESS_KEY'),
  } as {
    accessKeyId: string
    secretAccessKey: string
  },
})

const uploadObject = async (fileName: string, data: any) => {
  const params = {
    Bucket: 'wadaag',
    Key: fileName,
    Body: data,
    ACL: 'public-read',
    Metadata: {
      'x-amz-meta-my-key': 'your-value',
    },
  }

  try {
    const data = await s3Client.send(new PutObjectCommand(params))

    return data
  } catch (err: any) {
    console.log('Error', err?.message)
    throw {
      message: err?.message,
      status: 500,
    }
  }
}

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const type = req.query.type

      const files = Array.isArray(req.files.file)
        ? req.files.file
        : [req.files.file]

      const allowedImageTypes = ['.png', '.jpg', '.jpeg', '.gif']
      const allowedDocumentTypes = ['.pdf', '.doc', '.docx', '.txt']
      const allowedTypes = ['document', 'image']

      if (!allowedTypes.includes(type as string))
        return res.status(400).json({ error: 'Invalid file type' })

      const isAllowed = files.every((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        if (type === 'image') return allowedImageTypes.includes(`.${ext}`)
        if (type === 'document') return allowedDocumentTypes.includes(`.${ext}`)
      })

      if (!isAllowed)
        return res.status(400).json({ error: 'Invalid file type' })

      const promises = files.map(async (file) => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        const fileName = `${file.name.split('.')[0]}-${Date.now()}.${ext}`

        let buffer = file.data

        if (type === 'image') {
          const size = Buffer.byteLength(Buffer.from(buffer))
          if (size > 200000) {
            buffer = await sharp(buffer).resize(400).toBuffer()
          }
        }

        await uploadObject(fileName, buffer)
        return fileName
      })
      const fileUrls = await Promise.all(promises)
      return res.json({
        message: 'File uploaded successfully',
        data: fileUrls?.map((url) => ({
          url: `https://farshaxan.blr1.cdn.digitaloceanspaces.com/farshaxan/wadaag/${url.replace(
            /\s/g,
            '%20'
          )}`,
        })),
      })
    } catch ({ status = 500, message }: any) {
      return res.status(status).json({ error: message })
    }
  }
)

export default handler
