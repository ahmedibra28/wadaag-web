import { useEffect } from 'react'
import useRidesHook from '../utils/api/rides'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm, Message } from '../components'
import { FaTrash, FaCheckCircle } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { cancelTrip } from '../redux/slice/trip'
import { useRouter } from 'next/router'

const WaitingForRiderTwo = () => {
  const router = useRouter()

  const { deleteRide, getPendingRider } = useRidesHook({
    page: 1,
    limit: 25,
  })

  const { data, isLoading } = getPendingRider

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteRide

  const dispatch = useDispatch()

  const deleteHandler = (id) => {
    const dataId = id ? id : data && data._id
    confirmAlert(
      Confirm(() => {
        mutateAsyncDelete({ id: dataId, status: 'cancelled' })
      })
    )
  }

  const completeRideHandler = (id) => {
    const dataId = id ? id : data && data._id
    confirmAlert(
      Confirm(() => {
        mutateAsyncDelete({ id: dataId, status: 'completed' })
      }, 'Are you sure you want to complete this ride?')
    )
  }

  useEffect(() => {
    if (!isLoading && data && !data._id) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isSuccessDelete) {
      router.replace('/')
      dispatch(cancelTrip())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete])

  return (
    <div className='text-center h-100'>
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      <div className='text-center alert alert-success'>
        Your ride has been confirmed. Thank you for using our service.
      </div>

      <button
        className='btn btn-primary w-75'
        onClick={() => completeRideHandler(data && data._id)}
        disabled={isLoadingDelete}
      >
        {isLoadingDelete ? (
          <span className='spinner-border spinner-border-sm' />
        ) : (
          <span>
            <FaCheckCircle className='mb-1' /> Ride Completed
          </span>
        )}
      </button>

      <div className='my-5 py-5 shadow rounded-3'>
        <p>Waiting request from the second rider</p>
        <span className='spinner spinner-border' />
      </div>

      <div
        className='position-absolute'
        style={{ bottom: 100, right: 0, left: 0 }}
      >
        <p>If you want to cancel your ride, please click the button below.</p>
        <button
          className='btn btn-danger w-75 mx-auto '
          onClick={() => deleteHandler(data && data._id)}
          disabled={isLoadingDelete}
        >
          {isLoadingDelete ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            <span>
              <FaTrash className='mb-1' /> Cancel Ride
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default WaitingForRiderTwo
