import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import withAuth from '../HOC/withAuth'
import { FormContainer, Message } from '../components'
import { useForm } from 'react-hook-form'
import useRidesHook from '../utils/api/rides'
import Head from 'next/head'
import { inputText } from '../utils/dynamicForm'
import { useSelector, useDispatch } from 'react-redux'
import { plateConfirmation } from '../redux/slice/trip'

const PlateConfirmation = () => {
  const router = useRouter()

  const [showConfirmation, setShowConfirmation] = useState(false)

  const trip = useSelector((state) => JSON.parse(JSON.stringify(state.trip)))
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { postRide } = useRidesHook({
    page: 1,
    limit: 25,
  })

  const {
    mutateAsync: rideMutateAsync,
    error: errorRide,
    isError: isErrorRide,
    isLoading: isLoadingRide,
    isSuccess: isSuccessRide,
    data: dataRide,
  } = postRide

  const submitHandler = async (data) => {
    dispatch(plateConfirmation({ plate: data.plate }))

    setShowConfirmation(true)
  }

  useEffect(() => {
    if (isSuccessRide) {
      dispatch(plateConfirmation({ id: dataRide._id }))
      router.replace('/ride-waiting')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessRide])

  const confirmRideHandler = () => {
    rideMutateAsync(trip)
  }

  useEffect(() => {
    if (!trip || !trip.from || !trip.to) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cancelRideHandler = () => {
    dispatch(plateConfirmation({ plate: '' }))
    router.replace('/')
  }

  return (
    <FormContainer>
      <Head>
        <title>Plate Confirmation</title>
        <meta property='og:title' content='Plate Confirmation' key='title' />
      </Head>

      {isErrorRide && <Message variant='danger'>{errorRide}</Message>}

      {showConfirmation ? (
        <div className='text-center'>
          <p>
            Please, click <strong>Confirm Ride</strong> to continue or{' '}
            <strong>Cancel ride</strong> to go back!
          </p>

          <div className='btn-group'>
            <button
              className='btn btn-primary'
              onClick={() => confirmRideHandler()}
            >
              Confirm Ride
            </button>

            <button
              className='btn btn-danger ms-3'
              onClick={() => cancelRideHandler()}
            >
              Cancel Ride
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className='fw-light font-monospace text-center'>
            Plate Confirmation
          </h3>

          <form onSubmit={handleSubmit(submitHandler)}>
            {inputText({
              register,
              errors,
              label: 'Plate Number',
              name: 'plate',
              placeholder: 'Enter your plate number',
            })}

            <button
              type='submit'
              className='btn btn-primary form-control '
              disabled={isLoadingRide}
            >
              {isLoadingRide ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Confirm'
              )}
            </button>
          </form>
        </>
      )}
    </FormContainer>
  )
}

export default dynamic(() => Promise.resolve(withAuth(PlateConfirmation)), {
  ssr: false,
})
