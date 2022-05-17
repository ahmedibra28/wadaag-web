import Link from 'next/link'
import dynamic from 'next/dynamic'
import { FaPowerOff } from 'react-icons/fa'
import useAuthHook from '../utils/api/auth'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { customLocalStorage } from '../utils/customLocalStorage'

const OffCanvas = () => {
  const router = useRouter()
  const { postLogout } = useAuthHook()

  const { mutateAsync } = useMutation(postLogout, {
    onSuccess: () => router.push('/auth/login'),
  })

  const logoutHandler = () => {
    mutateAsync({})
  }

  const user = () => {
    const userInfo =
      customLocalStorage() &&
      customLocalStorage().userInfo &&
      customLocalStorage().userInfo

    return userInfo
  }

  const menus = () => {
    const dropdownItems =
      customLocalStorage() &&
      customLocalStorage().userAccessRoutes &&
      customLocalStorage().userAccessRoutes.clientPermission &&
      customLocalStorage().userAccessRoutes.clientPermission.map(
        (route) => route.menu
      )

    const menuItems =
      customLocalStorage() &&
      customLocalStorage().userAccessRoutes &&
      customLocalStorage().userAccessRoutes.clientPermission &&
      customLocalStorage().userAccessRoutes.clientPermission.map(
        (route) => route
      )

    const dropdownArray =
      dropdownItems &&
      dropdownItems.filter((item) => item !== 'hidden' && item !== 'normal')

    const uniqueDropdowns = [...new Set(dropdownArray)]

    return { uniqueDropdowns, menuItems }
  }

  const authItems = () => {
    return (
      <>
        <ul className='navbar-nav ms-auto'>
          {menus() &&
            menus().menuItems.map(
              (menu) =>
                menu.menu === 'normal' &&
                menu.auth === true && (
                  <li key={menu._id} className='nav-item'>
                    <Link href={menu.path}>
                      <a className='nav-link' aria-current='page'>
                        {menu.name}
                      </a>
                    </Link>
                  </li>
                )
            )}

          {menus() &&
            menus().uniqueDropdowns.map((item) => (
              <li key={item} className='nav-item dropdown'>
                <a
                  className='nav-link dropdown-toggle'
                  href='#'
                  id='navbarDropdownMenuLink'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  {item === 'profile'
                    ? user() && user().name
                    : item.charAt(0).toUpperCase() + item.substring(1)}
                </a>
                <ul
                  className='dropdown-menu border-0'
                  aria-labelledby='navbarDropdownMenuLink'
                >
                  {menus() &&
                    menus().menuItems.map(
                      (menu) =>
                        menu.menu === item && (
                          <li key={menu._id}>
                            <Link href={menu.path}>
                              <a className='dropdown-item'>{menu.name}</a>
                            </Link>
                          </li>
                        )
                    )}
                </ul>
              </li>
            ))}

          <li className='nav-item'>
            <Link href='/auth/login'>
              <a
                className='nav-link'
                aria-current='page'
                onClick={logoutHandler}
              >
                <FaPowerOff className='mb-1' /> Logout
              </a>
            </Link>
          </li>
        </ul>
      </>
    )
  }

  return (
    <div
      className='offcanvas offcanvas-start'
      tabIndex='-1'
      id='offcanvasExample'
      aria-labelledby='offcanvasExampleLabel'
    >
      <div className='offcanvas-header'>
        <h5 className='offcanvas-title' id='offcanvasExampleLabel'>
          Offcanvas
        </h5>
        <button
          type='button'
          className='btn-close'
          data-bs-dismiss='offcanvas'
          aria-label='Close'
        ></button>
      </div>
      <div className='offcanvas-body'>{authItems()}</div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(OffCanvas), { ssr: false })
