import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'

const Home = () => {
  return (
    <div className='container'>
      <h1 className='text-center text-primary'>wadaag.app</h1>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
