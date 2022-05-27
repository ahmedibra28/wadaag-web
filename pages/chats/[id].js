import { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { Message, Spinner, Confirm } from '../../components'
import useChatsHook from '../../utils/api/chats'
import { useRouter } from 'next/router'
import { FaPaperPlane, FaTimesCircle } from 'react-icons/fa'
import { customLocalStorage } from '../../utils/customLocalStorage'
import moment from 'moment'
import { confirmAlert } from 'react-confirm-alert'

const IndividualChat = () => {
  const router = useRouter()
  const { id } = router.query
  const [text, setText] = useState('')

  const { getChattingById, updateChat, deleteChat } = useChatsHook({
    page: 1,
    limit: 25,
    id,
  })

  const { data, isLoading, isError, error } = getChattingById

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = updateChat

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteChat

  const submitHandler = (e) => {
    e.preventDefault()
    if (text) {
      mutateAsyncUpdate({ _id: id, text })
    }
  }

  useEffect(() => {
    if (isSuccessUpdate) {
      router.replace('/chats')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete])

  useEffect(() => {
    isSuccessUpdate && setText('')
  }, [isSuccessUpdate])

  const userInfo = customLocalStorage() && customLocalStorage().userInfo

  useEffect(() => {
    const chatDiv = document.getElementById('chat-div')
    if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight
  }, [data])

  const endChatHandler = () => {
    confirmAlert(
      Confirm(() => {
        mutateAsyncDelete(id)
      }, 'Are you sure you want to end this chat?')
    )
  }

  return (
    <div>
      <Head>
        <title>Chatting</title>
        <meta property='og:title' content='Chatting' key='title' />
      </Head>

      {isError && <Message variant='danger'>{error}</Message>}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div>
          <form onSubmit={submitHandler}>
            <div
              className='container position-fixed'
              style={{
                bottom: 60,
                zIndex: 1,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control shadow-none'
                  aria-describedby='chat'
                  placeholder='Type your message'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isLoadingUpdate}
                  // add auto focus to input
                  autoFocus
                />
                <button
                  disabled={isLoadingUpdate}
                  className='input-group-text btn btn-primary btn-lg shadow-none'
                  id='chat'
                >
                  {isLoadingUpdate ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
                <button
                  onClick={() => endChatHandler()}
                  disabled={isLoadingDelete}
                  className='btn btn-outline-danger btn-lg shadow-none ms-1'
                >
                  {isLoadingDelete ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    <FaTimesCircle />
                  )}
                </button>
              </div>
            </div>
          </form>

          <div
            className='container'
            style={{
              overflow: 'auto',
              height: 'calc(100vh - 180px)',
            }}
            id='chat-div'
          >
            {data &&
              data.messages &&
              data.messages.map((message) => (
                <div
                  key={message._id}
                  className={
                    userInfo && message.user === userInfo._id
                      ? 'd-flex justify-content-end'
                      : 'd-flex justify-content-start'
                  }
                >
                  <div>
                    <div
                      className={
                        userInfo && message.user === userInfo._id
                          ? 'text-end'
                          : 'text-start'
                      }
                    >
                      <span className='text-muted' style={{ fontSize: 10 }}>
                        {moment(message.createdAt).format('LT')}
                      </span>
                    </div>
                    <div
                      className={`p-2 my-1 rounded-3 shadow-sm border ${
                        userInfo && message.user === userInfo._id
                          ? 'bg-light border-light'
                          : 'border-light'
                      }`}
                    >
                      <div>{message.text}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(IndividualChat)), {
  ssr: false,
})
