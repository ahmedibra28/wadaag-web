import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import useAuthHook from '../../utils/api/auth'
import useUserRolesHook from '../../utils/api/userRoles'
import { customLocalStorage } from '../../utils/customLocalStorage'
import Head from 'next/head'
import { inputNumber } from '../../utils/dynamicForm'
import Image from 'next/image'

const OTP = () => {
  const router = useRouter()
  const pathName = router.query.next || '/'

  const orpTemp = router.query.otp
  const userId = router.query.user
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { postOTP } = useAuthHook()
  const { postUserRoleById } = useUserRolesHook({
    page: 1,
    q: '',
    limit: 10000000,
  })

  const { isLoading, isError, error, mutateAsync, isSuccess, data } = postOTP
  const {
    mutateAsync: userRoleMutateAsync,
    data: userRole,
    error: errorUserRole,
    isError: isErrorUserRole,
  } = postUserRoleById

  useEffect(() => {
    if (isSuccess) {
      userRoleMutateAsync(data._id)

      if (userRole) {
        typeof window !== undefined &&
          localStorage.setItem('userRole', JSON.stringify(userRole))

        typeof window !== undefined &&
          localStorage.setItem('userInfo', JSON.stringify(data))
        router.push(pathName)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, userRole])

  useEffect(() => {
    customLocalStorage() && customLocalStorage().userInfo && router.push('/')
  }, [router])

  const submitHandler = async (data) => {
    mutateAsync({
      otp: data.otp,
      userId,
    })
  }

  return (
    <FormContainer>
      <Head>
        <title>OTP</title>
        <meta property='og:title' content='OTP' key='title' />
      </Head>
      <div className='mx-auto text-center'>
        <Image
          src='/wadaag-logo.png'
          width={150}
          height={117}
          alt='logo'
          className='img-fluid'
        />
        <hr />
      </div>
      <h3 className='fw-light font-monospace text-center'>OTP Confirmation</h3>
      {isError && <Message variant='danger'>{error}</Message>}
      {isErrorUserRole && <Message variant='danger'>{errorUserRole}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputNumber({
          register,
          errors,
          label: 'OTP',
          name: 'otp',
          placeholder: 'Enter your OTP',
        })}

        <button
          type='submit'
          className='btn btn-primary form-control '
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Sign In'
          )}
        </button>

        <div className='text-center mt-3'>
          <span className='text-primary'>
            Login with this <span className='fw-bold'> {orpTemp}</span>{' '}
            temporary OTP
          </span>
        </div>
      </form>
    </FormContainer>
  )
}

export default OTP
