import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/chats'

const queryKey = 'chats'

export default function useChatsHook(props) {
  const { page = 1, id, q = '', limit = 25 } = props
  const queryClient = useQueryClient()

  const getChats = useQuery(
    queryKey,
    async () =>
      await dynamicAPI('get', `${url}?page=${page}&q=${q}&limit=${limit}`, {}),
    { retry: 0 }
  )

  const getChatHistories = useQuery(
    'chat-histories',
    async () =>
      await dynamicAPI(
        'get',
        `${url}/histories?page=${page}&q=${q}&limit=${limit}`,
        {}
      ),
    { retry: 0 }
  )

  const getChattingById = useQuery(
    'chatting',
    async () => await dynamicAPI('get', `${url}/${id}`, {}),
    { retry: 0, enabled: !!id, refetchInterval: 3000 }
  )

  const updateChat = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['chatting']),
    }
  )

  const deleteChat = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  const postChat = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries([queryKey]),
    }
  )

  return {
    getChats,
    updateChat,
    deleteChat,
    postChat,
    getChatHistories,
    getChattingById,
  }
}
