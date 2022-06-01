import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import useReportsHook from '../../utils/api/reports'
import { Spinner, Message, ViewPaymentReports } from '../../components'
import { useForm } from 'react-hook-form'

const PaymentReports = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const { postPaymentReport } = useReportsHook()

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    mutateAsync: mutateAsyncPost,
    data,
  } = postPaymentReport

  const submitHandler = (data) => {
    mutateAsyncPost(data)
  }

  console.log(data && data)

  return (
    <>
      <Head>
        <title>Payments Report</title>
        <meta property='og:title' content='Payments Report' key='title' />
      </Head>
      <ViewPaymentReports
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        isLoadingPost={isLoadingPost}
        isErrorPost={isErrorPost}
        errorPost={errorPost}
        data={data}
      />
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(PaymentReports)), {
  ssr: false,
})
