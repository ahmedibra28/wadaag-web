import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../../HoC/withAuth'
import { Spinner, Pagination, Message, Search, Meta } from '../../../components'
import moment from 'moment'
import apiHook from '../../../api'
import { IOrder } from '../../../models/Order'
import { currency } from '../../../utils/currency'
import { useRouter } from 'next/router'

const Orders = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const router = useRouter()
  const { id } = router.query

  const getApi = apiHook({
    key: ['stores', `${id}`],
    method: 'GET',
    url: `markets/stores/${id}?page=${page}&q=${q}&limit=${25}`,
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

  const name = 'Orders List'

  return (
    <>
      <Meta title="Orders" />

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
                placeholder="Search by name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Customer</th>
                <th>Owner</th>
                <th>Product</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Price</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IOrder, i: number) => (
                <tr key={i}>
                  <td>{item?.customer?.name}</td>
                  <td>{item?.owner?.name}</td>
                  <td>{item?.name}</td>
                  <td>{item?.product?.category}</td>
                  <td>{item?.quantity}</td>
                  <td>{currency(item?.cost, 2)}</td>
                  <td>{currency(item?.price, 2)}</td>
                  <td>{moment(item?.createdAt).format('lll')}</td>
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
