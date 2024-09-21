import React from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { Spinner, Message, Meta } from '../../components'
import moment from 'moment'
import apiHook from '../../api'
import { ITransaction } from '../../models/Transaction'
import { useForm } from 'react-hook-form'
import { DynamicFormProps, inputDate, inputText } from '../../utils/dForms'
import Image from 'next/image'

interface Item extends Omit<ITransaction, 'authenticated'> {
  image: string
  name: string
}

const Transactions = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const postApi = apiHook({
    key: ['transactions-report'],
    method: 'POST',
    url: `reports/payments`,
  })?.post

  const name = 'Transactions List'

  const submitHandler = async (data: {
    sender: string
    startDate: Date
    endDate: Date
  }) => {
    postApi?.mutateAsync(data)
  }
  return (
    <>
      <Meta title="Transactions" />

      {postApi?.isLoading ? (
        <Spinner />
      ) : postApi?.isError ? (
        <Message variant="danger" value={postApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{postApi?.data?.length || 0}] </sup>
            </h3>
            <form onSubmit={handleSubmit(submitHandler as any)} className="">
              <div className="row border">
                <div className="col-auto">
                  {inputText({
                    register,
                    errors,
                    label: 'Sender',
                    name: 'sender',
                    placeholder: 'Mobile',
                    isRequired: false,
                  } as DynamicFormProps)}
                </div>
                <div className="col-auto">
                  {inputDate({
                    register,
                    errors,
                    label: 'Start Date',
                    name: 'startDate',
                    placeholder: 'Start Date',
                    isRequired: false,
                  } as DynamicFormProps)}
                </div>
                <div className="col-auto">
                  {inputDate({
                    register,
                    errors,
                    label: 'End Date',
                    name: 'endDate',
                    placeholder: 'End Date',
                    isRequired: false,
                  } as DynamicFormProps)}
                </div>
                <div className="col-auto flex my-auto">
                  <button
                    type="submit"
                    className="btn btn-primary form-control mt-2"
                    disabled={postApi?.isLoading}
                  >
                    {postApi?.isLoading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Image</th>
                <th>Sender</th>
                <th>Mobile</th>
                <th>Amount</th>
                <th>Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {postApi?.data?.map((item: Item, i: number) => (
                <tr key={i}>
                  <td>
                    {item?.image ? (
                      <Image
                        width="30"
                        height="30"
                        src={item?.image}
                        alt={item?.name}
                        className="img-fluid rounded-pill"
                      />
                    ) : (
                      <span className="badge bg-danger">Not Found</span>
                    )}
                  </td>
                  <td>
                    {item?.name || (
                      <span className="badge bg-danger">Not Found</span>
                    )}
                  </td>
                  <td>{item?.mobile}</td>
                  <td>${item?.amount?.toFixed(2)}</td>
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

export default dynamic(() => Promise.resolve(withAuth(Transactions)), {
  ssr: false,
})
