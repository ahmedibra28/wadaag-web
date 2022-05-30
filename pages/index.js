import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Head from 'next/head'
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
  FaSearchLocation,
  FaClock,
  FaArrowAltCircleRight,
} from 'react-icons/fa'
import { useRouter } from 'next/router'
import useRidesHook from '../utils/api/rides'

const Home = () => {
  const router = useRouter()

  const [libraries] = useState(['places'])
  const [message, setMessage] = useState('')
  /** @type React.MutableRefObject<HTMLDivElement> */
  const originRef = useRef()

  /** @type React.MutableRefObject<HTMLDivElement> */
  const destinationRef = useRef()

  const initialState = {
    from: '',
    to: '',
    distance: '',
    duration: '',
    directionsResponse: null,
    _id: '',
    originLatLng: null,
    destinationLatLng: null,
  }

  const [state, setState] = useState(initialState)

  const { getPendingRider, postRide } = useRidesHook({
    page: 1,
    limit: 25,
  })

  const { data } = getPendingRider

  const {
    mutateAsync: rideMutateAsync,
    error: errorRide,
    isError: isErrorRide,
    isLoading: isLoadingRide,
    isSuccess: isSuccessRide,
  } = postRide

  useEffect(() => {
    if (isSuccessRide) {
      router.replace('/ride-waiting')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessRide])

  useEffect(() => {
    if (data) {
      router.push('/ride-waiting')
    }
  }, [data, router])

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

      setState({
        from: originRef.current.value,
        to: destinationRef.current.value,
        distance: results.routes[0].legs[0].distance.text,
        duration: results.routes[0].legs[0].duration.text,
        directionsResponse: JSON.stringify(results),
        originLatLng:
          results.routes[0].legs[0].start_location.lat() +
          ',' +
          results.routes[0].legs[0].start_location.lng(),
        destinationLatLng:
          results.routes[0].legs[0].end_location.lat() +
          ',' +
          results.routes[0].legs[0].end_location.lng(),
      })
      setMessage('')
    } catch (error) {
      setMessage('No route could be found between the origin and destination.')
    }
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }
  }

  function clearRoute() {
    setState(initialState)
    setMessage('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  const confirmRideHandler = () => {
    rideMutateAsync(state)
    console.log(state)
  }

  return (
    <div style={{ marginTop: -8 }} id='map'>
      <Head>
        <title>Direction</title>
        <meta property='og:title' content='Direction' key='title' />
        <LoadScript libraries={['places']} />
      </Head>

      {message && <Message variant='danger'>{message}</Message>}
      {isErrorRide && <Message variant='danger'>{errorRide}</Message>}

      <div className='row gx-1 my-2'>
        <div className='col-lg-4 col-md-6 col-12'>
          <Autocomplete>
            <div className='mb-2'>
              <input
                ref={originRef}
                defaultValue={state.from}
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
                defaultValue={state.to}
                type='text'
                className='form-control'
                placeholder='To where?'
              />
            </div>
          </Autocomplete>
        </div>
        <div className='col-lg-4 col-12'>
          <div className='mb-2 mt-1'>
            <button
              type='submit'
              onClick={submitHandler}
              className='btn btn-sm btn-primary shadow-none'
            >
              <FaSearchLocation className='mb-1' />
            </button>
            {state.directionsResponse && (
              <button
                className='btn btn-sm btn-danger shadow-none'
                onClick={clearRoute}
              >
                <FaTimesCircle className='mb-1' />
              </button>
            )}

            {state.duration && (
              <button className='btn btn-sm btn-light ms-1'>
                <FaClock className='mb-1 text-primary' /> {state.duration}
              </button>
            )}

            {state.distance && (
              <button className='btn btn-sm btn-light ms-1'>
                <FaTachometerAlt className='mb-1 text-primary' />{' '}
                {state.distance}
              </button>
            )}
            {state.directionsResponse && (
              <button
                onClick={confirmRideHandler}
                className='btn btn-sm btn-success ms- shadow-none float-end'
                disabled={isLoadingRide}
              >
                {isLoadingRide ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <>
                    <FaArrowAltCircleRight className='mb-1' /> SUBMIT
                  </>
                )}
              </button>
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
        {state.directionsResponse && (
          <DirectionsRenderer
            directions={JSON.parse(state.directionsResponse)}
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
