import dynamicAPI from './dynamicAPI'
import {
  useMutation,
  // useQuery ,
  useQueryClient,
} from 'react-query'

const url = '/api/reports'

// const queryKey = 'reports'

export default function useReportsHook() {
  //   const { page = 1, id, q = '', limit = 25 } = props
  const queryClient = useQueryClient()

  //   const getReports = useQuery(
  //     queryKey,
  //     async () =>
  //       await dynamicAPI('get', `${url}?page=${page}&q=${q}&limit=${limit}`, {}),
  //     { retry: 0 }
  //   )

  const postPaymentReport = useMutation(
    async (obj) => await dynamicAPI('post', `${url}/payments`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['payments report']),
    }
  )

  return {
    // getReports,
    postPaymentReport,
  }
}
