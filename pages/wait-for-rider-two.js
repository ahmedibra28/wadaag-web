import useRidesHook from '../utils/api/rides'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components'
import { FaTrash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { cancelTrip } from '../redux/slice/trip'
import { useRouter } from 'next/router'

const WaitingForRiderTwo = () => {
  const router = useRouter()

  const { deleteRide } = useRidesHook({
    page: 1,
    limit: 25,
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteRide

  const trip = useSelector((state) => JSON.parse(JSON.stringify(state.trip)))
  const dispatch = useDispatch()

  const deleteHandler = (id) => {
    confirmAlert(
      Confirm(() => {
        mutateAsyncDelete(id)
        dispatch(cancelTrip())
        router.push('/')
      })
    )
  }

  return (
    <div className='text-center'>
      <div className='text-center alert alert-success'>
        Your ride has been confirmed. Thank you for using our service.
      </div>

      <button
        className='btn btn-danger btn-sm'
        onClick={() => deleteHandler(trip._id)}
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
