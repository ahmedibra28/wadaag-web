import { FaHome, FaSearchLocation, FaUser, FaRocketchat } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

function BottomTab() {
  const router = useRouter()

  const currentPath = router.pathname

  const items = [
    {
      id: 1,
      title: 'Home',
      icon: <FaHome className='fs-3' />,
      link: '/',
    },
    {
      id: 2,
      title: 'Riders',
      icon: <FaSearchLocation className='fs-3' />,
      link: '/riders',
    },
    {
      id: 3,
      title: 'Chats',
      icon: <FaRocketchat className='fs-3' />,
      link: '/chats',
    },
    {
      id: 4,
      title: 'Profile',
      icon: <FaUser className='fs-3' />,
      link: '/account/profile',
    },
  ]
  return (
    <div className='position-fixed bottom-0 bg-light w-100'>
      <ul className='nav justify-content-between bg-light p-1 container'>
        {items.map((item) => (
          <li key={item.id} className='nav-item'>
            <Link href={item.link}>
              <a
                className={`nav-link active bg-light py-0 text-center ${
                  currentPath === item.link && 'shadow rounded-pill py-2'
                } `}
                style={{
                  marginTop: currentPath === item.link ? -15 : 0,
                  transition: 'all 0.3s ease-in-out',
                }}
                aria-current='page'
              >
                {item.icon} <br />
                <span className='' style={{ fontSize: 12 }}>
                  {item.title}
                </span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default dynamic(() => Promise.resolve(BottomTab), { ssr: false })
