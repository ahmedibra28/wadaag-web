import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import useAuthHook from '../../utils/api/auth'
import { customLocalStorage } from '../../utils/customLocalStorage'
import Head from 'next/head'
import { inputNumber } from '../../utils/dynamicForm'
import Image from 'next/image'

const Login = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { postLogin } = useAuthHook()

  const { isLoading, isError, error, mutateAsync, isSuccess, data } = postLogin

  useEffect(() => {
    if (isSuccess) {
      router.push(`/auth/otp?user=${data._id}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    customLocalStorage() && customLocalStorage().userInfo && router.push('/')
  }, [router])

  const submitHandler = async (data) => {
    mutateAsync(data)
  }

  return (
    <FormContainer>
      <Head>
        <title>Login</title>
        <meta property='og:title' content='Login' key='title' />
      </Head>
      <div className='mx-auto text-center'>
        <Image
          src='/wadaag-logo.png'
          width={150}
          height={117}
          alt='logo'
          className=';img-fluid'
        />
        <hr />
      </div>
      {/* <h3 className='fw-light font-monospace text-center'>Sign In / Sign Up</h3> */}
      {isError && <Message variant='danger'>{error}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputNumber({
          register,
          errors,
          label: 'Mobile number',
          name: 'mobileNumber',
          placeholder: 'Enter your mobile number',
        })}

        <button
          type='submit'
          className='btn btn-primary form-control '
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Sign In / Sign Up'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default Login
