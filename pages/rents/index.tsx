import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
  Meta,
} from '../../components'
import { FaCheckCircle, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import apiHook from '../../api'
import { IRent } from '../../models/Rent'

const Rents = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['rents'],
    method: 'GET',
    url: `rents/rents?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const updateApi = apiHook({
    key: ['rents'],
    method: 'PUT',
    url: `rents/rents`,
  })?.put

  const deleteApi = apiHook({
    key: ['rents'],
    method: 'DELETE',
    url: `rents/rents`,
  })?.deleteObj

  useEffect(() => {
    if (updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch()
    }
    // eslint-disable-next-line
  }, [updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Rents List'
  const label = 'Rent'

  return (
    <>
      <Meta title="Rents" />

      {deleteApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been deleted successfully.`}
        />
      )}
      {deleteApi?.isError && (
        <Message variant="danger" value={deleteApi?.error} />
      )}
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

            <div className="col-auto">
              <Search
                placeholder="Search by district"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Image</th>
                <th>Owner</th>
                <th>District</th>
                <th>Type</th>
                <th>Properties</th>
                <th>Contact</th>
                <th>Price</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IRent, i: number) => (
                <tr
                  key={i}
                  className={`${
                    item.status === 'deleted' ? 'text-danger' : ''
                  }`}
                >
                  <td style={{ height: 30 }}>
                    <img
                      src={item?.images?.[0]}
                      alt={item?.district}
                      style={{ width: '30px', height: '30px' }}
                      className="img-fluid rounded-pill"
                    />
                  </td>
                  <td>{item?.user?.name}</td>
                  <td>{item?.district}</td>
                  <td>{item?.type}</td>
                  <td>{`R-${item?.rooms} K-${item?.kitchen} T-${item?.toilet}`}</td>
                  <td>{item?.contact}</td>
                  <td>${item?.price}</td>
                  <td>{moment(item?.createdAt).format('lll')}</td>
                  <td>
                    <div className="btn-group">
                      {item?.status === 'pending' && (
                        <button
                          className="btn btn-success btn-sm rounded-pill me-2"
                          onClick={() =>
                            updateApi?.mutateAsync({
                              _id: item._id,
                              status: 'active',
                            })
                          }
                        >
                          <FaCheckCircle /> Approve
                        </button>
                      )}

                      {item?.status !== 'deleted' && (
                        <button
                          className="btn btn-danger btn-sm ms-1 rounded-pill"
                          onClick={() => deleteHandler(item._id)}
                          disabled={deleteApi?.isLoading}
                        >
                          {deleteApi?.isLoading ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <span>
                              <FaTrash />
                            </span>
                          )}
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

export default dynamic(() => Promise.resolve(withAuth(Rents)), {
  ssr: false,
})
