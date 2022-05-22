import { useEffect } from 'react'
import useRidesHook from '../utils/api/rides'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm, Message } from '../components'
import { FaTrash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { cancelTrip } from '../redux/slice/trip'
import { useRouter } from 'next/router'

const WaitingForRiderTwo = () => {
  const router = useRouter()

  const { deleteRide, getPendingRider } = useRidesHook({
    page: 1,
    limit: 25,
  })

  const { data } = getPendingRider

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteRide

  const dispatch = useDispatch()

  const deleteHandler = (id) => {
    const dataId = id ? id : data._id
    confirmAlert(
      Confirm(() => {
        mutateAsyncDelete({ id: dataId, status: 'cancelled' })
      })
    )
  }

  useEffect(() => {
    if (isSuccessDelete) {
      router.push('/')
      dispatch(cancelTrip())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete])

  return (
    <div className='text-center'>
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      <div className='text-center alert alert-success'>
        Your ride has been confirmed. Thank you for using our service.
      </div>

      <button
        className='btn btn-danger btn-sm'
        onClick={() => deleteHandler(data && data._id)}
        disabled={isLoadingDelete}
      >
        {isLoadingDelete ? (
          <span className='spinner-border spinner-border-sm' />
        ) : (
          <span>
            <FaTrash /> Cancel Ride
          </span>
        )}
      </button>
    </div>
  )
}

export default WaitingForRiderTwo
