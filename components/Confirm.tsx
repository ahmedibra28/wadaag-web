import 'react-confirm-alert/src/react-confirm-alert.css'
import { FaCheckCircle, FaTrash } from 'react-icons/fa'

const Confirm = (action: () => void, status = 'delete') => {
  return {
    customUI: ({ onClose }: { onClose: () => void }) => {
      return (
        <div className="px-5 py-3 shadow-lg text-center text-dark">
          <h1>Are you sure?</h1>
          <p>You want to {status} this?</p>
          <div className="btn-group d-flex justify-content-between">
            <button className="btn btn-outline-dark bg-sm" onClick={onClose}>
              No
            </button>
            <button
              className="btn btn-outline-danger bg-sm ml-1"
              onClick={() => {
                action()
                onClose()
              }}
            >
              {status === 'delete' ? (
                <FaTrash className="mb-1" />
              ) : (
                <FaCheckCircle className="mb-1" />
              )}{' '}
              Yes, {status} it!
            </button>
          </div>
        </div>
      )
    },
  }
}

export default Confirm
