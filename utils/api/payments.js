import dynamicAPI from './dynamicAPI'
import { useQuery } from 'react-query'

const url = '/api/payments'

const queryKey = 'payments'

export default function usePaymentsHook() {
  const getPayments = useQuery(
    queryKey,
    async () => await dynamicAPI('get', url, {}),
    { retry: 0, refetchInterval: 30000 }
  )

  return {
    getPayments,
  }
}
