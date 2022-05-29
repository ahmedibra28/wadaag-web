import { Spinner, Message } from '../../'
import {
  inputCheckBox,
  inputEmail,
  inputPassword,
  inputTel,
  inputText,
} from '../../../utils/dynamicForm'

const FormUsers = ({
  edit,
  formCleanHandler,
  isLoading,
  register,
  isError,
  errors,
  watch,
  isLoadingUpdate,
  isLoadingPost,
  handleSubmit,
  submitHandler,
  error,
}) => {
  return (
    <div
      className='modal fade'
      id='userModal'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex='-1'
      aria-labelledby='userModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content modal-background'>
          <div className='modal-header'>
            <h3 className='modal-title ' id='userModalLabel'>
              {edit ? 'Edit User' : 'Post User'}
            </h3>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={formCleanHandler}
            ></button>
          </div>
          <div className='modal-body'>
            {isLoading ? (
              <Spinner />
            ) : isError ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <form onSubmit={handleSubmit(submitHandler)}>
                {inputText({
                  register,
                  errors,
                  label: 'Name',
                  name: 'name',
                  placeholder: 'Name',
                })}
                {inputTel({
                  register,
                  errors,
                  label: 'Mobile',
                  name: 'mobileNumber',
                  placeholder: 'Mobile',
                })}

                {inputCheckBox({
                  register,
                  errors,
                  watch,
                  name: 'isActive',
                  label: 'Active',
                  isRequired: false,
                  placeholder: 'Active',
                })}

                {inputCheckBox({
                  register,
                  errors,
                  watch,
                  name: 'blocked',
                  label: 'Blocked',
                  isRequired: false,
                  placeholder: 'Blocked',
                })}
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary '
                    data-bs-dismiss='modal'
                    onClick={formCleanHandler}
                  >
                    Close
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary '
                    disabled={isLoadingPost || isLoadingUpdate}
                  >
                    {isLoadingPost || isLoadingUpdate ? (
                      <span className='spinner-border spinner-border-sm' />
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormUsers
