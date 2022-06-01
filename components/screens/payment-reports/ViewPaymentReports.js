import { inputDate, inputNumber } from '../../../utils/dynamicForm'
import { Message, Spinner } from '../../'
import moment from 'moment'

const ViewPaymentReports = ({
  data,
  handleSubmit,
  submitHandler,
  register,
  errors,
  isLoadingPost,
  isErrorPost,
  errorPost,
}) => {
  return (
    <div className='table-responsive bg-light p-3 mt-2'>
      <div className='mb-2'>
        <h3 className='fw-light text-center text-muted'>
          Payments Report List{' '}
          <sup className='fs-6'> [{data ? data.length : 0}] </sup>
        </h3>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className='row'>
            <div className='col-md-4 col-6'>
              {inputDate({
                register,
                errors,
                label: 'Start Date',
                name: 'startDate',
                placeholder: 'Start Date',
              })}
            </div>
            <div className='col-md-4 col-6'>
              {inputDate({
                register,
                errors,
                label: 'End Date',
                name: 'endDate',
                placeholder: 'End Date',
              })}
            </div>
            <div className='col-md-4 col-6'>
              {inputNumber({
                register,
                errors,
                label: 'Mobile Number',
                name: 'mobileNumber',
                placeholder: 'Mobile Number',
                isRequired: false,
              })}
            </div>
            <div className='col-6 ms-auto my-auto'>
              <button
                type='submit'
                className='btn btn-primary float-end'
                disabled={isLoadingPost}
              >
                {isLoadingPost ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {isLoadingPost ? (
        <Spinner />
      ) : isErrorPost ? (
        <Message variant='danger'>{errorPost}</Message>
      ) : (
        <table className='table table-sm table-border font-monospace'>
          <thead className='border-0'>
            <tr>
              <th>Transaction</th>
              <th>Mobile</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data &&
              data.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.transactionId}</td>
                  <td>{payment.mobileNumber}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>
                    {moment(payment.date).format('MMMM Do YYYY, h:mm:ss a')}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ViewPaymentReports
