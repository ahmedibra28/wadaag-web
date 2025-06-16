import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../../HoC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
  Meta,
} from '../../../components'
import { FaTrash } from 'react-icons/fa'
import moment from 'moment'
import apiHook from '../../../api'
import { IOrder } from '../../../models/Order'
import { currency } from '../../../utils/currency'

const Orders = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['orders'],
    method: 'GET',
    url: `markets/orders?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const updateApi = apiHook({
    key: ['orders'],
    method: 'PUT',
    url: `markets/orders`,
  })?.put

  const deleteApi = apiHook({
    key: ['orders'],
    method: 'DELETE',
    url: `markets/orders`,
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

  const updateStatusHandler = (_id: any, status: any) => {
    if (status === 'cancelled') {
      confirmAlert(Confirm(() => deleteApi?.mutateAsync(_id)))
    } else {
      confirmAlert(
        Confirm(() => updateApi?.mutateAsync({ _id, status }), status)
      )
    }
  }

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const name = 'Orders List'
  const label = 'Order'

  return (
    <>
      <Meta title="Orders" />

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IOrder, i: number) => (
                <tr key={i}>
                  <td>{item?.customer?.name}</td>
                  <td>{item?.owner?.name}</td>
                  <td>
                    <span>{item?.name}</span> <br />
                    {item?.variants?.map((v, i) => {
                      return (
                        <div key={i}>
                          <span
                            className="text-muted"
                            style={{ fontSize: '12px' }}
                          >
                            {v.color} - {v.size}
                          </span>
                          <br />
                        </div>
                      )
                    })}
                  </td>
                  <td>{item?.product?.category}</td>
                  <td>{item?.quantity}</td>
                  <td>{currency(item?.cost, 2)}</td>
                  <td>{currency(item?.price, 2)}</td>
                  <td>{moment(item?.createdAt).format('lll')}</td>
                  <td>
                    <div className="btn-group">
                      {[
                        'pending',
                        'confirmed',
                        'preparing',
                        'delivered',
                        'cancelled',
                      ].map((status) => (
                        <button
                          key={status}
                          className={`btn ${
                            status === item?.status
                              ? 'btn-success'
                              : 'btn-outline-primary'
                          } btn-sm ms-1 rounded-pill`}
                          onClick={() => updateStatusHandler(item._id, status)}
                          disabled={
                            deleteApi?.isLoading || updateApi?.isLoading
                          }
                        >
                          {deleteApi?.isLoading || updateApi?.isLoading ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <span>
                              {(
                                status.charAt(0).toUpperCase() + status.slice(1)
                              ).slice(0, 4)}
                            </span>
                          )}
                        </button>
                      ))}
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
