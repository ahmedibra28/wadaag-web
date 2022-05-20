import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Head from 'next/head'
import Link from 'next/link'
import { Message, Spinner } from '../components'
import { useState, useRef, useEffect } from 'react'
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
  FaArrowAltCircleRight,
} from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { startTrip } from '../redux/slice/trip'

const Home = () => {
  const [libraries] = useState(['places'])
  const [message, setMessage] = useState('')
  /** @type React.MutableRefObject<HTMLDivElement> */
  const originRef = useRef()

  /** @type React.MutableRefObject<HTMLDivElement> */
  const destinationRef = useRef()

  const tripString = useSelector((state) => state.trip)
  const dispatch = useDispatch()

  const trip = JSON.parse(JSON.stringify(tripString))

  const center = {
    lat: 2.037,
    lng: 45.32,
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

  async function submitHandler() {
    try {
      const directionsService = new google.maps.DirectionsService()

      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      })

      dispatch(
        startTrip({
          from: originRef.current.value,
          to: destinationRef.current.value,
          distance: results.routes[0].legs[0].distance.text,
          duration: results.routes[0].legs[0].duration.text,
          directionsResponse: JSON.stringify(results),
        })
      )
      setMessage('')
    } catch (error) {
      setMessage('No route could be found between the origin and destination.')
    }
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }
  }

  function clearRoute() {
    dispatch(
      startTrip({
        from: '',
        to: '',
        distance: '',
        duration: '',
        directionsResponse: null,
      })
    )
    setMessage('')
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

      <div className='row my-2'>
        <div className='col-lg-4 col-md-6 col-12'>
          <Autocomplete>
            <div className='mb-2'>
              <input
                ref={originRef}
                defaultValue={trip.from}
                type='text'
                className='form-control'
                placeholder='From where?'
              />
            </div>
          </Autocomplete>
        </div>
        <div className='col-lg-4 col-md-6 col-12'>
          <Autocomplete>
            <div className='mb-2'>
              <input
                ref={destinationRef}
                defaultValue={trip.to}
                type='text'
                className='form-control'
                placeholder='To where?'
              />
            </div>
          </Autocomplete>
        </div>
        <div className='col-lg-4 col-md-6 col-12'>
          <div className='mb-2'>
            <button
              type='submit'
              onClick={submitHandler}
              className='btn btn-sm btn-primary shadow-none'
            >
              <FaPaperPlane className='mb-1' />
            </button>
            {trip.directionsResponse && (
              <button
                className='btn btn-sm btn-danger ms-2 shadow-none'
                onClick={clearRoute}
              >
                <FaTimesCircle className='mb-1' />
              </button>
            )}

            {trip.duration && (
              <button className='btn btn-sm btn-light ms-2'>
                <FaClock className='mb-1 text-primary' /> {trip.duration}
              </button>
            )}

            {trip.distance && (
              <button className='btn btn-sm btn-light ms-2'>
                <FaTachometerAlt className='mb-1 text-primary' />{' '}
                {trip.distance}
              </button>
            )}
            {trip.directionsResponse && (
              <Link href='plate-confirmation'>
                <a className='btn btn-sm btn-success ms-2 shadow-none float-end'>
                  <FaArrowAltCircleRight className='mb-1' /> NEXT
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>

      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{
          width: '100%',
          height: 'calc(63vh )',
        }}
        options={{
          disableDefaultUI: true,
        }}
      >
        <Marker position={center} />
        {trip.directionsResponse && (
          <DirectionsRenderer
            directions={JSON.parse(trip.directionsResponse)}
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
