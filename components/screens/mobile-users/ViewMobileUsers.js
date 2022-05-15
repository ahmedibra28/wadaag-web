import { Search } from '../..'
import { FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa'
import Image from 'next/image'

const ViewMobileUsers = ({
  data,
  setQ,
  q,
  searchHandler,
  deleteHandler,
  isLoadingDelete,
}) => {
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          Mobile Users List <sup className='fs-6'> [{data && data.total}] </sup>
        </h3>

        <div className='col-auto'>
          <Search
            placeholder='Search by name'
            setQ={setQ}
            q={q}
            searchHandler={searchHandler}
          />
        </div>
      </div>
      <table className='table table-sm table-border'>
        <thead className='border-0'>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.data.map((mobileUser) => (
              <tr key={mobileUser._id}>
                <td>
                  {mobileUser.name ? (
                    mobileUser.name
                  ) : (
                    <span className='text-danger'>Waiting profile update</span>
                  )}
                </td>
                <td>{mobileUser.mobile}</td>
                <td>
                  {mobileUser.isActive ? (
                    <FaCheckCircle className='text-success' />
                  ) : (
                    <FaTimesCircle className='text-danger' />
                  )}
                </td>
                <td>
                  <button
                    className='btn btn-danger btn-sm rounded-pill'
                    onClick={() => deleteHandler(mobileUser._id)}
                    disabled={isLoadingDelete}
                  >
                    {isLoadingDelete ? (
                      <span className='spinner-border spinner-border-sm' />
                    ) : (
                      <span>
                        <FaTrash />
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewMobileUsers
