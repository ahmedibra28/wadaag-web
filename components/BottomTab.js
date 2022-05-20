import { FaHome, FaMap, FaUser } from 'react-icons/fa'
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
    // {
    //   id: 2,
    //   title: 'Map',
    //   icon: <FaMap className='fs-3' />,
    //   link: '/map',
    // },
    {
      id: 3,
      title: 'Profile',
      icon: <FaUser className='fs-3' />,
      link: '/account/profile',
    },
  ]
  return (
    <div className='position-fixed bottom-0 bg-light w-100'>
      <ul className='nav justify-content-between bg-light p-2'>
        {items.map((item) => (
          <li key={item.id} className='nav-item'>
            <Link href={item.link}>
              <a
                className={`nav-link active bg-light ${
                  currentPath === item.link && 'shadow rounded-pill p-3'
                } `}
                style={{ marginTop: currentPath === item.link ? -15 : 0 }}
                aria-current='page'
              >
                {item.icon}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default dynamic(() => Promise.resolve(BottomTab), { ssr: false })
