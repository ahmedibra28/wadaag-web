import Navigation from './Navigation'
import Head from 'next/head'
import OffCanvas from './OffCanvas'
import BottomTab from './BottomTab'
// import Footer from './Footer'

export default function Layout({ children }) {
  const userInfo =
    typeof window !== 'undefined' && localStorage.getItem('userInfo')
      ? JSON.parse(
          typeof window !== 'undefined' && localStorage.getItem('userInfo')
        )
      : null

  return (
    <>
      <Head>
        <title>Wadaag APP</title>
        <meta property='og:title' content='Wadaag APP' key='title' />
      </Head>

      {userInfo && (
        <>
          <Navigation />
          <OffCanvas />
        </>
      )}

      <main className='container py-2'>{children}</main>
      {userInfo && <BottomTab />}
      {/* <Footer /> */}
    </>
  )
}
