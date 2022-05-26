import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import useChatsHook from '../../utils/api/chats'
import {
  Spinner,
  ViewUserProfiles,
  Pagination,
  Message,
} from '../../components'

const Histories = () => {
  const [page, setPage] = useState(1)

  const { getChatHistories } = useChatsHook({
    page,
  })

  const { data, isLoading, isError, error } = getChatHistories

  return (
    <>
      <Head>
        <title>Chat History</title>
        <meta property='og:title' content='Chat History' key='title' />
      </Head>

      <div className='ms-auto text-end'>
        <Pagination data={data} setPage={setPage} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <span>Helo</span>
        </>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Histories)), {
  ssr: false,
})
