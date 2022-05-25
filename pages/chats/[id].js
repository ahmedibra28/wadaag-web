import { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { FormContainer, Message, Spinner } from '../../components'
import useChatsHook from '../../utils/api/chats'
import { inputCheckRadio, inputFile, inputText } from '../../utils/dynamicForm'
import LazyLoad from 'react-lazyload'
import { useRouter } from 'next/router'
import { FaPaperPlane } from 'react-icons/fa'

const IndividualChat = () => {
  const router = useRouter()
  const { id } = router.query
  const [text, setText] = useState('')

  const { getChattingById, updateChat } = useChatsHook({
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

  const submitHandler = (e) => {
    e.preventDefault()
    console.log('submitted', text)
    // mutateAsyncUpdate({})
  }

  return (
    <div>
      <Head>
        <title>Chatting</title>
        <meta property='og:title' content='Chatting' key='title' />
      </Head>

      {isError && <Message variant='danger'>{error}</Message>}

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div>
          <form onSubmit={submitHandler}>
            <div className='container'>{text}</div>
            <div
              className='container position-absolute'
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
                />
                <button
                  className='input-group-text btn btn-primary btn-lg shadow-none'
                  id='chat'
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(IndividualChat)), {
  ssr: false,
})
