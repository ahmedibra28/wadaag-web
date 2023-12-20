import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../../HoC/withAuth'
import { Spinner, Pagination, Message, Search, Meta } from '../../../components'
import { FaInfoCircle } from 'react-icons/fa'
import apiHook from '../../../api'
import { IProfile } from '../../../models/Profile'
import Link from 'next/link'

const Orders = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['stores'],
    method: 'GET',
    url: `markets/stores?page=${page}&q=${q}&limit=${25}`,
  })?.get

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

  return (
    <>
      <Meta title="Stores" />

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
                <th>Address</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Type</th>
                <th>Company</th>
                <th>License</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IProfile, i: number) => (
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
                  <td>{item?.address}</td>
                  <td>{item?.mobile}</td>
                  <td>{item?.email}</td>
                  <td>{item?.type}</td>
                  <td>{item?.company}</td>
                  <td>{item?.license}</td>
                  <td>{item?.company}</td>
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
