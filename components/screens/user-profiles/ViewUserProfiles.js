import { Search } from '../../'
import Image from 'next/image'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const ViewUserProfiles = ({
  data,
  setQ,
  q,
  searchHandler,
  mutateAsyncUpdate,
  isLoadingUpdate,
}) => {
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          UserProfiles List <sup className='fs-6'> [{data && data.total}] </sup>
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
            <th>Image</th>
            <th>Name</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Approved</th>
            <th>Points</th>
            <th>Expiration</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.data.map((userProfile) => (
              <tr key={userProfile._id}>
                <td>
                  <Image
                    width='30'
                    height='30'
                    src={userProfile.image}
                    alt={userProfile.name}
                    className='img-fluid rounded-pill'
                  />
                </td>
                <td>
                  {userProfile.name || (
                    <span className='badge bg-danger'>ERROR!</span>
                  )}
                </td>
                <td>
                  {userProfile.isRider ? (
                    <span className='badge bg-primary'>RIDER</span>
                  ) : (
                    <span className='badge bg-success'>ADMIN</span>
                  )}
                </td>
                <td>{userProfile?.user?.mobileNumber}</td>
                <td>
                  {userProfile.approved ? (
                    <FaCheckCircle className='text-success' />
                  ) : (
                    <FaTimesCircle className='text-danger' />
                  )}
                </td>
                <td>
                  {userProfile?.points || (
                    <span className='text-danger'>0</span>
                  )}
                </td>
                <td>
                  {userProfile.expiration <= 10 ? (
                    <span className='text-danger'>
                      {userProfile.expiration} days
                    </span>
                  ) : userProfile.expiration >= 20 ? (
                    <span className='text-success'>
                      {userProfile.expiration} days
                    </span>
                  ) : (
                    <span className='text-warning'>
                      {userProfile.expiration} days
                    </span>
                  )}
                </td>
                <td>
                  {!userProfile.approved && (
                    <button
                      onClick={() => mutateAsyncUpdate(userProfile._id)}
                      disabled={isLoadingUpdate}
                      className={`btn btn-sm btn-success`}
                    >
                      {isLoadingUpdate ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        <>
                          <FaCheckCircle className='mb-1' /> Approve
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewUserProfiles
