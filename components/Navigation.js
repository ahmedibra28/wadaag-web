import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  FaSignInAlt,
  FaUserPlus,
  FaPowerOff,
  FaBars,
  FaBell,
} from 'react-icons/fa'
import useAuthHook from '../utils/api/auth'
import usePaymentsHook from '../utils/api/payments'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'

const Navigation = () => {
  const router = useRouter()

  const { postLogout } = useAuthHook()
  const { getPayments } = usePaymentsHook()

  const { data: merchantData, error: merchantError, isError } = getPayments

  console.log(
    'MERCHANT INFO ==> ⚠🔥🔥🔥🔥⚠ ',
    !isError ? merchantData && merchantData.merchantInfo : merchantError
  )

  const { mutateAsync } = useMutation(postLogout, {
    onSuccess: () => router.push('/auth/login'),
  })

  const logoutHandler = () => {
    mutateAsync({})
  }

  const userInfo =
    typeof window !== 'undefined' && localStorage.getItem('userInfo')
      ? JSON.parse(
          typeof window !== 'undefined' && localStorage.getItem('userInfo')
        )
      : null

  const guestItems = () => {
    return (
      <>
        <ul className='navbar-nav ms-auto'>
          <li className='nav-item'>
            <Link href='/auth/login'>
              <a className='nav-link' aria-current='page'>
                <FaUserPlus className='mb-1' /> Register
              </a>
            </Link>
          </li>
          <li className='nav-item'>
            <Link href='/auth/login'>
              <a className='nav-link' aria-current='page'>
                <FaSignInAlt className='mb-1' /> Login
              </a>
            </Link>
          </li>
        </ul>
      </>
    )
  }

  const authItems = () => {
    return (
      <>
        <ul className='navbar-nav ms-auto flex-row'>
          <li className='nav-item ms-3'>
            <Link href='/'>
              <a className='nav-link' aria-current='page'>
                <FaBell className='fs-5' />
              </a>
            </Link>
          </li>

          <li className='nav-item ms-3'>
            <Link href='/auth/login'>
              <a
                className='nav-link'
                aria-current='page'
                onClick={logoutHandler}
              >
                <FaPowerOff className='fs-5' />
              </a>
            </Link>
          </li>
        </ul>
      </>
    )
  }

  return (
    <nav className='navbar navbar-light bg-light'>
      <div className='container py-0'>
        <FaBars
          className='fs-3 shadow-none text-primary'
          data-bs-toggle='offcanvas'
          data-bs-target='#offcanvasExample'
          aria-controls='offcanvasExample'
        />

        {userInfo ? authItems() : guestItems()}
      </div>
    </nav>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })
