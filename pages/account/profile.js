import { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import useProfilesHook from '../../utils/api/profiles'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import useUploadHook from '../../utils/api/upload'
import {
  inputCheckRadio,
  inputFile,
  inputPassword,
  inputTel,
  inputText,
  inputTextArea,
} from '../../utils/dynamicForm'
import Image from 'next/image'
import { Spinner } from '../../components'

const Profile = () => {
  const [file, setFile] = useState(null)
  const [fileLink, setFileLink] = useState(null)
  const {
    register,
    handleSubmit,
    watch,
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
    setValue('license', !isLoading ? data && data.license : '')
    setValue('plate', !isLoading ? data && data.plate : '')
    setValue('owner', !isLoading ? data && data.owner : '')
    setValue('type', !isLoading ? data && data.type : '')
  }, [isLoading, setValue, data])

  const submitHandler = (data) => {
    if (!file && !fileLink) {
      mutateAsync({
        name: data.name,
        license: data.license,
        plate: data.plate,
        type: data.type,
        owner: data.owner,
      })
    } else {
      mutateAsync({
        name: data.name,
        license: data.license,
        plate: data.plate,
        type: data.type,
        owner: data.owner,
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
        {(data && !data.profileCompleted) ||
          (data && !data.approved && (
            <div className='alert alert-warning pb-1 border-0'>
              <ul>
                {data && !data.profileCompleted && (
                  <li> Please complete your profile. </li>
                )}
                {data && !data.approved && (
                  <li> Please wait until you get approved </li>
                )}
              </ul>
            </div>
          ))}
        {data && data.image && (
          <div className='d-flex justify-content-center position-relative'>
            <Image
              src={data && data.image}
              alt='avatar'
              className='rounded-circle'
              width='200'
              height='200'
            />
            {data.approved ? (
              <FaCheckCircle className='text-success position-absolute bottom-0 fs-1' />
            ) : (
              <FaTimesCircle className='text-danger position-absolute bottom-0 fs-1' />
            )}
          </div>
        )}

        <div className='row'>
          <div className='col-12'>
            {inputCheckRadio({
              register,
              errors,
              label: 'User type',
              name: 'type',
              data: [
                { _id: 'driver', name: 'Driver' },
                { _id: 'rider', name: 'Rider' },
              ],
            })}
          </div>
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

          {watch().type === 'rider' && (
            <label className='text-danger text-center my-2'>
              Implement monthly payment here
            </label>
          )}
          {watch().type === 'driver' && (
            <>
              <div className='col-12'>
                {inputText({
                  register,
                  errors,
                  label: 'Owner name',
                  name: 'owner',
                  placeholder: 'Owner name',
                })}
              </div>
              <div className='col-12'>
                {inputText({
                  register,
                  errors,
                  label: 'Plate',
                  name: 'plate',
                  placeholder: 'Plate',
                })}
              </div>
              <div className='col-12'>
                {inputText({
                  register,
                  errors,
                  label: 'License',
                  name: 'license',
                  placeholder: 'License',
                })}
              </div>
            </>
          )}
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
