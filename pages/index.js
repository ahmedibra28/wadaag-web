import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Head from 'next/head'
import { FormContainer, Spinner } from '../components'
import { useForm } from 'react-hook-form'
import { inputText } from '../utils/dynamicForm'
import { useEffect, useState, useRef } from 'react'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from '@react-google-maps/api'

const Home = () => {
  // const { directionsResponse, setDirectionsResponse } = useState(null)
  // const { distance, setDistance } = useState('')
  // const { duration, setDuration } = useState('')
  // const originRef = useRef('')
  // const destinationRef = useRef('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const submitHandler = (data) => {}

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

  useLoadScript({
    libraries: ['places'],
  })
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  if (!isLoaded) {
    return <Spinner />
  }

  const center = {
    lat: 2.0213184,
    lng: 45.3272868,
  }

  return (
    <div style={{ marginTop: -8 }}>
      <Head>
        <title>Direction</title>
        <meta property='og:title' content='Direction' key='title' />
      </Head>

      <div
        className='row position-absolute'
        style={{
          zIndex: 1,
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          minWidth: '100%',
        }}
      >
        <div className='col-lg-3 col-md-4 col-10 bg-light px-3 py-1 mx-auto'>
          <div className='mb-2'>
            <Autocomplete>
              <input
                type='text'
                className='form-control'
                placeholder='From Where?'
              />
            </Autocomplete>
          </div>
          <div className='mb-2'>
            <Autocomplete>
              <input
                type='text'
                className='form-control'
                placeholder='To Where?'
              />
            </Autocomplete>
          </div>
        </div>
      </div>

      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{
          width: '100%',
          height: 'calc(100vh - 112px)',
        }}
        options={{
          disableDefaultUI: true,
        }}
      >
        <Marker position={center} />
        <Marker position={{ let: 2.020044, lng: 45.3267753 }} />
      </GoogleMap>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
