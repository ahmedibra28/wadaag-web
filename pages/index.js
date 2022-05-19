import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Head from 'next/head'
import { FormContainer } from '../components'
import { useForm } from 'react-hook-form'
import { inputText } from '../utils/dynamicForm'

const Home = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const submitHandler = (data) => {}
  return (
    <FormContainer>
      <Head>
        <title>Direction</title>
        <meta property='og:title' content='Direction' key='title' />
      </Head>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-12'>
            {inputText({
              register,
              errors,
              label: 'From Where?',
              name: 'from',
              placeholder: 'From Where?',
            })}
          </div>
          <div className='col-12'>
            {inputText({
              register,
              errors,
              label: 'Where To?',
              name: 'to',
              placeholder: 'Where To?',
            })}
          </div>
        </div>
      </form>
    </FormContainer>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
