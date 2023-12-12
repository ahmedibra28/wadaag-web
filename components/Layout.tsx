import Navigation from './Navigation'
import Footer from './Footer'
import { ReactNode } from 'react'
import Meta from './Meta'
import { userInfo } from '../api/api'
import { useRouter } from 'next/router'

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const { pathname } = router

  return (
    <div>
      <Meta />
      {userInfo()?.userInfo && <Navigation />}
      <div className="d-flex justify-content-between">
        {pathname !== '/' ? (
          <main
            className="py-2 container"
            style={{
              minHeight: 'calc(100vh - 120px)',
            }}
          >
            {children}
          </main>
        ) : (
          <main
            className="m-0 p-0 w-100"
            style={{
              minHeight: 'calc(100vh - 35px)',
            }}
          >
            {children}
          </main>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
