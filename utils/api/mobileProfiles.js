import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/mobile/user-profiles'

export default function useMobileProfilesHook(props) {
  const { page = 1, q = '', limit = 25 } = props

  const queryClient = useQueryClient()

  const getMobileUserProfiles = useQuery(
    'mobile user profiles',
    async () =>
      await dynamicAPI('get', `${url}/?page=${page}&q=${q}&limit=${limit}`, {}),
    { retry: 0 }
  )

  const updateMobileUserProfileToApprove = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['mobile user profiles']),
    }
  )

  return { getMobileUserProfiles, updateMobileUserProfileToApprove }
}
