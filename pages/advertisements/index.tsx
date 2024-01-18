import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { Spinner, Pagination, Message, Meta } from '../../components'
import { FaCheckCircle } from 'react-icons/fa'
import moment from 'moment'
import apiHook from '../../api'
import { IAdvertisement } from '../../models/Advertisement'

const Advertisements = () => {
  const [page, setPage] = useState(1)

  const getApi = apiHook({
    key: ['advertisements'],
    method: 'GET',
    url: `advertisements?page=${page}&q=&limit=${25}`,
  })?.get

  const updateApi = apiHook({
    key: ['advertisements'],
    method: 'PUT',
    url: `advertisements`,
  })?.put

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
    }
    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  const name = 'Advertisements List'
  const label = 'Advertisement'

  return (
    <>
      <Meta title="Advertisements" />

      {updateApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been updated successfully.`}
        />
      )}
      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}

      <div className="ms-auto text-end">
        <Pagination data={getApi?.data} setPage={setPage} />
      </div>

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{getApi?.data?.total}] </sup>
            </h3>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Image</th>
                <th>User</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IAdvertisement, i: number) => (
                <tr
                  key={i}
                  className={`${
                    item.status === 'DELETED' ? 'text-danger' : ''
                  }`}
                >
                  <td style={{ height: 30 }}>
                    <img
                      src={item?.image}
                      alt={item?.user?.name}
                      style={{ width: '30px', height: '30px' }}
                      className="img-fluid rounded-pill"
                    />
                  </td>
                  <td>{item?.user?.name}</td>
                  <td>{item?.user?.mobile}</td>
                  <td>
                    {item?.status === 'ACTIVE' ? (
                      <div className="badge bg-success">{item?.status}</div>
                    ) : item?.status === 'PENDING' ? (
                      <div className="badge bg-info">{item?.status}</div>
                    ) : (
                      <div className="badge bg-danger">{item?.status}</div>
                    )}
                  </td>

                  <td>{moment(item?.createdAt).format('lll')}</td>
                  <td>
                    <div className="btn-group">
                      {item?.status === 'PENDING' && (
                        <button
                          className="btn btn-success btn-sm rounded-pill me-2"
                          onClick={() =>
                            updateApi?.mutateAsync({
                              _id: item._id,
                              status: 'ACTIVE',
                            })
                          }
                        >
                          <FaCheckCircle /> Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Advertisements)), {
  ssr: false,
})
