import dynamicAPI from './dynamicAPI'
import { useQuery } from 'react-query'

const url = '/api/mobile'

export default function useMobileProfilesHook(props) {
  const { page = 1, q = '', limit = 25 } = props

  const getMobileUserProfiles = useQuery(
    'mobile user profiles',
    async () =>
      await dynamicAPI(
        'get',
        `${url}/user-profiles?page=${page}&q=${q}&limit=${limit}`,
        {}
      ),
    { retry: 0 }
  )

  return { getMobileUserProfiles }
}
