import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Head from 'next/head'
import { FormContainer, Message, Spinner } from '../components'
import { useForm } from 'react-hook-form'
import { inputText } from '../utils/dynamicForm'
import { useEffect, useState, useRef } from 'react'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  LoadScript,
  DirectionsRenderer,
} from '@react-google-maps/api'
import {
  FaTachometerAlt,
  FaTimesCircle,
  FaPaperPlane,
  FaClock,
} from 'react-icons/fa'

const Home = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [libraries] = useState(['places'])
  const [message, setMessage] = useState('')

  /** @type React.MutableRefObject<HTMLDivElement> */
  const originRef = useRef()

  /** @type React.MutableRefObject<HTMLDivElement> */
  const destinationRef = useRef()

  const routePolyline = useRef()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const position = {
    lat: 2.023543,
    lng: 45.3312573,
  }

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })

  if (!isLoaded) {
    return <Spinner />
  }

  const center = {
    lat: 2.0213184,
    lng: 45.3272868,
  }

  async function submitHandler() {
    try {
      const directionsService = new google.maps.DirectionsService()

      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      })

      setMessage('')
      setDirectionsResponse(results)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.text)
    } catch (error) {
      setMessage('No route could be found between the origin and destination.')
      console.log(error)
    }
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }
  }

  function clearRoute() {
    setMessage('')
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  return (
    <div style={{ marginTop: -8 }} id='map'>
      <Head>
        <title>Direction</title>
        <meta property='og:title' content='Direction' key='title' />
        <LoadScript libraries={['places']} />
      </Head>

      {message && <Message variant='danger'>{message}</Message>}

      <div>
        <div className='row my-2'>
          <div className='col-4 px-2'>
            <Autocomplete>
              <input
                ref={originRef}
                type='text'
                className='form-control'
                placeholder='From where?'
              />
            </Autocomplete>
          </div>

          <div className='col-4 px-2'>
            <Autocomplete>
              <input
                ref={destinationRef}
                type='text'
                className='form-control'
                placeholder='To where?'
              />
            </Autocomplete>
          </div>

          <div className='col-4 px-2 btn-group'>
            <button
              type='submit'
              onClick={submitHandler}
              className='btn btn-primary shadow-none'
            >
              <FaPaperPlane className='mb-1' />
            </button>
            <button
              className='btn btn-danger ms-2 shadow-none'
              onClick={clearRoute}
            >
              <FaTimesCircle className='mb-1' />
            </button>
          </div>
          <div className='col-12 mt-1'>
            <div className='d-flex justify-content-start'>
              {duration && (
                <div>
                  <FaClock className='mb-1 text-primary' /> {duration}
                </div>
              )}
              {distance && (
                <div className='ms-5'>
                  <FaTachometerAlt className='mb-1 text-primary' /> {distance}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{
          width: '100%',
          height: 'calc(100vh - 145px)',
        }}
        options={{
          disableDefaultUI: true,
        }}
      >
        <Marker position={center} />
        <Marker position={position} />
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              polylineOptions: {
                strokeColor: '#5c1a67',
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
