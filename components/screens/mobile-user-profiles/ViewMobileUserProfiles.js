import { Search } from '../..'
import Image from 'next/image'

const ViewMobileUserProfiles = ({
  data,
  setQ,
  q,
  searchHandler,
  isLoadingUpdate,
  mutateAsyncUpdate,
}) => {
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='d-flex align-items-center flex-column mb-2'>
        <h3 className='fw-light text-muted'>
          Mobile User Profiles List{' '}
          <sup className='fs-6'> [{data && data.total}] </sup>
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
            <th>Mobile</th>
            <th>Points</th>
            <th>Expiration</th>
            <th>Type</th>
            <th>Approved</th>
            <th>Completed</th>
            <th>Plate</th>
            <th>License</th>
            <th>Owner</th>
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
                <td>{userProfile.user && userProfile.user.mobile}</td>
                <td>
                  <span className='text-info'>{userProfile.points}</span>
                </td>
                <td>
                  {userProfile.type === 'rider' ? (
                    userProfile.expiration < 10 ? (
                      <span className='text-danger'>
                        {userProfile.expiration}
                      </span>
                    ) : (
                      <span className='text-info'>
                        {userProfile.expiration}
                      </span>
                    )
                  ) : (
                    <span className='badge bg-danger'>ERROR!</span>
                  )}
                </td>
                <td>
                  {userProfile.type === 'driver' ? (
                    <span className='bg-success badge'>DRIVER</span>
                  ) : userProfile.type === 'rider' ? (
                    <span className='bg-primary badge'>RIDER</span>
                  ) : (
                    <span className='bg-danger badge'>ERROR!</span>
                  )}
                </td>

                <td>
                  <button
                    className='btn btn-sm p-0'
                    disabled={isLoadingUpdate}
                    onClick={() => mutateAsyncUpdate(userProfile)}
                  >
                    {isLoadingUpdate ? (
                      <span className='spinner-border spinner-border-sm mx-auto' />
                    ) : userProfile.approved ? (
                      <span className='badge bg-success'>APPROVED</span>
                    ) : (
                      <span className='badge bg-danger'>PENDING</span>
                    )}
                  </button>
                </td>
                <td>
                  {userProfile.profileCompleted ? (
                    <span className='badge bg-success'>COMPLETED</span>
                  ) : (
                    <span className='badge bg-danger'>PENDING</span>
                  )}
                </td>
                <td>
                  {userProfile.type === 'driver' ? (
                    userProfile.plate
                  ) : (
                    <span className='badge bg-danger'>ERROR!</span>
                  )}
                </td>
                <td>
                  {userProfile.type === 'driver' ? (
                    userProfile.license
                  ) : (
                    <span className='badge bg-danger'>ERROR!</span>
                  )}
                </td>
                <td>
                  {userProfile.type === 'driver' ? (
                    userProfile.owner
                  ) : (
                    <span className='badge bg-danger'>ERROR!</span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewMobileUserProfiles
