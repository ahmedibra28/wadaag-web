import 'react-confirm-alert/src/react-confirm-alert.css'
import { FaCheckCircle } from 'react-icons/fa'

export const Confirm = (action, message = 'Yes, Delete it!') => {
  return {
    customUI: ({ onClose }) => {
      return (
        <div className='px-5 py-3 shadow-lg text-center text-dark'>
          <h1>Are you sure?</h1>
          <p>You want to do this?</p>
          <div className='btn-group d-flex justify-content-between'>
            <button className='btn btn-outline-dark bg-sm' onClick={onClose}>
              No
            </button>
            <button
              className='btn btn-outline-primary bg-sm ml-1 ms-2'
              onClick={() => {
                action()
                onClose()
              }}
            >
              <FaCheckCircle className='mb-1' /> {message}
            </button>
          </div>
        </div>
      )
    },
  }
}
