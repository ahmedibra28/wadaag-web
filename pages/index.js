import Head from 'next/head'
import Countdown from 'react-countdown'

export default function Home() {
  return (
    <div className='container'>
      <Head>
        <title>Wadaag App</title>
        <meta name='description' content='Wadaag App for web-based' />
        <link rel='icon' href='/favicon.png' />
      </Head>

      <div className='d-flex justify-content-center align-items-center vh-100 flex-column'>
        <div>
          <p className='border p-3'>
            web-based{' '}
            <span
              className='fw-bold fs-5 font-monospace'
              style={{ color: 'yellow' }}
            >
              wadaag app
            </span>{' '}
            coming soon!
          </p>
        </div>

        <div className='display-1 fw-bold font-monospace'>
          <Countdown date={Date.now() + 8640000} />
        </div>
      </div>
    </div>
  )
}
