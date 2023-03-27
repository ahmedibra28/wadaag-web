import Navigation from './Navigation'
import Footer from './Footer'
import { ReactNode } from 'react'
import Meta from './Meta'
import { userInfo } from '../api/api'

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => (
  <div>
    <Meta />
    {userInfo()?.userInfo && <Navigation />}
    <div className="d-flex justify-content-between">
      <main
        className={`${
          userInfo()?.userInfo ? 'py-2 container' : 'm-0 p-0 w-100'
        }`}
        style={{
          minHeight: userInfo()?.userInfo
            ? 'calc(100vh - 120px)'
            : 'calc(100vh - 35px)',
        }}
      >
        {children}
      </main>
    </div>
    <Footer />
  </div>
)

export default Layout
