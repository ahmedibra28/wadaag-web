import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/main.min.css'
import '../styles/globals.css'

import { Layout } from '../components'
import 'animate.css'

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { store } from '../redux/store'
import { Provider } from 'react-redux'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap')
      : null
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  )
}

export default MyApp
