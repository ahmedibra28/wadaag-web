import Navigation from './Navigation'
import Head from 'next/head'
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
      {userInfo && <Navigation />}
      <main className='container py-2'>{children}</main>
      {/* <Footer /> */}
    </>
  )
}
