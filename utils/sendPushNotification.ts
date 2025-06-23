import Expo, { ExpoPushMessage } from 'expo-server-sdk'

export const sendPushNotification = async ({
  tokens,
  message,
  title,
  data,
}: {
  tokens: string[]
  message: string
  title?: string
  data?: {
    url?: string
  }
}) => {
  const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })
  const messages = tokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body: message,
    data,
  })) as ExpoPushMessage[]

  const chunks = expo.chunkPushNotifications(messages)

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk)
    } catch (error) {
      console.error(error)
    }
  }
}
