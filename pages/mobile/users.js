import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import useMobileUsersHook from '../../utils/api/mobileUsers'
import {
  Spinner,
  ViewMobileUsers,
  Pagination,
  Message,
  Confirm,
} from '../../components'
import { confirmAlert } from 'react-confirm-alert'

const MobileUsers = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const { getMobileUsers, deleteMobileUser } = useMobileUsersHook({
    page,
    q,
  })

  const { data, isLoading, isError, error, refetch } = getMobileUsers

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteMobileUser

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e) => {
    e.preventDefault()
    refetch()
    setPage(1)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
  }

  return (
    <>
      <Head>
        <title>Mobile Users</title>
        <meta property='og:title' content='Mobile Users' key='title' />
      </Head>

      {isSuccessDelete && (
        <Message variant='success'>User has been deleted successfully.</Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      <div className='ms-auto text-end'>
        <Pagination data={data} setPage={setPage} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <ViewMobileUsers
          deleteHandler={deleteHandler}
          isLoadingDelete={isLoadingDelete}
          data={data}
          setQ={setQ}
          q={q}
          searchHandler={searchHandler}
        />
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(MobileUsers)), {
  ssr: false,
})
