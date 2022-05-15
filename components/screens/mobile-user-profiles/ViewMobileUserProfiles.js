import { Search } from '../..'
import Image from 'next/image'
import moment from 'moment'

const ViewMobileUserProfiles = ({ data, setQ, q, searchHandler }) => {
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
            <th>Type</th>
            <th>Mobile</th>
            <th>Joined Date</th>
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
                    <span className='text-danger'>Waiting profile update</span>
                  )}
                </td>
                <td>{userProfile.type}</td>
                <td>{userProfile.user && userProfile.user.mobile}</td>
                <td>{moment(userProfile.createdAt).format('ll')}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewMobileUserProfiles
