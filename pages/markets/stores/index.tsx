import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../../HoC/withAuth'
import { Spinner, Pagination, Message, Search, Meta } from '../../../components'
import { FaInfoCircle } from 'react-icons/fa'
import apiHook from '../../../api'
import { IMarketUser } from '../../../models/MarketUser'
import Link from 'next/link'

const Orders = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['stores'],
    method: 'GET',
    url: `markets/stores?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const updateApi = apiHook({
    key: ['stores', 'update'],
    method: 'PUT',
    url: `markets/stores`,
  })?.put

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

  const name = 'Stores List'

  const handleApprove = (item: any) => {
    console.log(item)
    updateApi
      ?.mutateAsync({ id: item._id, _id: item._id })
      .then(() => getApi?.refetch())
      .catch((error) => console.log(error))
  }

  return (
    <>
      <Meta title="Stores" />

      <div className="ms-auto text-end">
        <Pagination data={getApi?.data} setPage={setPage} />
      </div>

      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error || 'error'} />
      )}

      {updateApi?.isSuccess && (
        <Message variant="success" value="Successfully updated" />
      )}

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
                placeholder="Search by owner name"
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
                <th>Mobile</th>
                <th>District</th>
                <th>Type</th>
                <th>Is Approved?</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IMarketUser, i: number) => (
                <tr key={i}>
                  <td style={{ height: 30 }}>
                    <img
                      src={item?.image}
                      alt={item?.name}
                      style={{ width: '30px', height: '30px' }}
                      className="img-fluid rounded-pill"
                    />{' '}
                  </td>
                  <td>{item?.name}</td>
                  <td>{item?.mobile}</td>
                  <td>{item?.district}</td>
                  <td>
                    {item?.type === 'individual' ? 'Individual' : 'Company'}
                  </td>
                  <td>
                    {item?.isApproved ? (
                      <button
                        onClick={() => handleApprove(item)}
                        className="btn btn-danger rounded-2 py-1 btn-sm"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(item)}
                        className="btn btn-success rounded-2 py-1 btn-sm"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                  <td>{item?.createdAt?.slice(0, 10)}</td>
                  <td>
                    <div className="btn-group">
                      <Link
                        href={`/markets/stores/${item._id}`}
                        className="btn btn-danger btn-sm ms-1 rounded-pill"
                      >
                        <FaInfoCircle /> Details
                      </Link>
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

export default dynamic(() => Promise.resolve(withAuth(Orders)), {
  ssr: false,
})
