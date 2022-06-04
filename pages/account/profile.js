import { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import useProfilesHook from '../../utils/api/profiles'
import useUploadHook from '../../utils/api/upload'
import { inputFile, inputText } from '../../utils/dynamicForm'
import LazyLoad from 'react-lazyload'
import { Spinner } from '../../components'
import { FaMoneyBillAlt } from 'react-icons/fa'

const Profile = () => {
  const [file, setFile] = useState(null)
  const [fileLink, setFileLink] = useState(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { getProfile, postProfile } = useProfilesHook({
    page: 1,
    q: '',
    limit: 25,
  })
  const { postUpload } = useUploadHook()

  const { data, isLoading, isError, error } = getProfile
  const {
    data: dataUpload,
    isLoading: isLoadingUpload,
    isError: isErrorUpload,
    error: errorUpload,
    mutateAsync: mutateAsyncUpload,
    isSuccess: isSuccessUpload,
  } = postUpload

  const {
    isSuccess,
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    mutateAsync,
  } = postProfile

  useEffect(() => {
    setValue('name', !isLoading ? data && data.name : '')
  }, [isLoading, setValue, data])

  const submitHandler = (data) => {
    if (!file && !fileLink) {
      mutateAsync({
        name: data.name,
      })
    } else {
      mutateAsync({
        name: data.name,
        image: fileLink,
      })
    }
  }

  useEffect(() => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      mutateAsyncUpload({ type: 'image', formData })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    if (isSuccessUpload) {
      setFileLink(
        dataUpload &&
          dataUpload.filePaths &&
          dataUpload.filePaths[0] &&
          dataUpload.filePaths[0].path
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpload])

  return (
    <FormContainer>
      <Head>
        <title>Profile</title>
        <meta property='og:title' content='Profile' key='title' />
      </Head>

      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}
      {isErrorUpload && <Message variant='danger'>{errorUpload}</Message>}
      {isError && <Message variant='danger'>{error}</Message>}
      {isSuccess && (
        <Message variant='success'>User has been updated successfully</Message>
      )}

      {isLoading && <Spinner />}
      <form onSubmit={handleSubmit(submitHandler)}>
        {data && data.isRider && data.expiration < 10 && (
          <>
            <button
              type='button'
              className='btn btn-outline-primary form-control mb-2 shadow-none'
            >
              Your subscription for <strong>Rider </strong> is about to expire.
              <strong> {data.expiration}</strong> days left.
            </button>
            {data.expiration < 5 && (
              <a
                href='tel:*789*631000*1#'
                className='btn btn-outline-success form-control mb-2 shadow-none'
              >
                <FaMoneyBillAlt className='fs-3' />
                <span className='ms-2'>Pay Now</span>
              </a>
            )}
          </>
        )}

        {data && !data.profileCompleted && (
          <div className='alert alert-danger pb-0 pt-1 border-0 rounded-0 mb-0'>
            <li>Please complete your profile.</li>
          </div>
        )}

        {data && !data.approved && (
          <div className='alert alert-danger pb-0 pt-1 border-0 rounded-0'>
            <li>Please wait until you get approved</li>
          </div>
        )}
        {data && data.image && (
          <div className='d-flex justify-content-center position-relative'>
            <LazyLoad height={150} once>
              <img
                src={data && data.image}
                alt='avatar'
                className='img-fluid img-thumbnail rounded-circle'
                style={{
                  objectFit: 'cover',
                  height: '150px',
                  width: '150px',
                }}
              />
            </LazyLoad>
          </div>
        )}

        <div className='row'>
          <div className='col-12'>
            {inputText({
              register,
              errors,
              label: 'Name',
              name: 'name',
              placeholder: 'Name',
            })}
          </div>

          <div className='col-12'>
            {inputFile({
              register,
              errors,
              label: 'Image',
              name: 'image',
              setFile,
              isRequired: false,
              placeholder: 'Choose an image',
            })}
          </div>
        </div>

        <button
          type='submit'
          className='btn btn-primary form-control'
          disabled={isLoadingPost || isLoadingUpload}
        >
          {isLoadingPost || isLoadingUpload ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Update'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Profile)), { ssr: false })
