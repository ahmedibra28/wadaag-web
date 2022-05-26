import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import useChatsHook from '../../utils/api/chats'
import { Spinner, Pagination, Message } from '../../components'
import moment from 'moment'
import Link from 'next/link'

const Chat = () => {
  const [page, setPage] = useState(1)

  const { getChatHistories } = useChatsHook({
    page,
  })

  const { data, isLoading, isError, error } = getChatHistories

  console.log(data && data)

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
          {data &&
            data.data &&
            data.data.map((chat) => (
              <Link key={chat._id} href={`/chats/${chat.user.user._id}`}>
                <a className='text-decoration-none'>
                  <div className='p-2 bg-light shadow d-flex justify-content-start align-items-center my-2'>
                    <img
                      src={chat.user.image}
                      alt={chat.user.name}
                      className='rounded-circle'
                      width='50'
                      height='50'
                    />
                    <div className='ms-2'>
                      <div className='text-primary d-flex flex-column'>
                        <span className='fw-bold'>
                          {chat.user && chat.user.name
                            ? chat.user.name
                            : 'unknown'}
                        </span>
                        <span style={{ fontSize: 12 }}>
                          {chat.mobileNumber}
                        </span>
                      </div>
                    </div>
                    <div className='ms-auto'>
                      <span style={{ fontSize: 12 }}>
                        {moment(chat.updatedAt).format('LT')}
                      </span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
        </>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Chat)), {
  ssr: false,
})
