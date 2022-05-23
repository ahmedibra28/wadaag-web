import { useDispatch, useSelector } from 'react-redux'
import { useState, useRef } from 'react'
import {
  FaRocketchat,
  FaArrowRight,
  FaTachometerAlt,
  FaArrowAltCircleRight,
  FaSearchLocation,
  FaTimesCircle,
  FaClock,
} from 'react-icons/fa'
import Head from 'next/head'
import Link from 'next/link'
import { FormContainer, Message, Spinner } from '../components'
import LazyLoad from 'react-lazyload'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  LoadScript,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { startRiderTwoTrip } from '../redux/slice/trip'

const Riders = () => {
  const dispatch = useDispatch()
  const [libraries, setLibraries] = useState(['places'])
  const [message, setMessage] = useState('')
  /** @type React.MutableRefObject<HTMLDivElement> */
  const originRef = useRef()

  /** @type React.MutableRefObject<HTMLDivElement> */
  const destinationRef = useRef()

  const trip = useSelector((state) =>
    JSON.parse(JSON.stringify(state.trip.riderTwo))
  )

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })

  if (!isLoaded) {
    return <Spinner />
  }

  const riders = [
    {
      _id: 1,
      mobile: '+252615301507',
      name: 'John Doe',
      from: 'Alakananda',
      to: 'Kathmandu',
      distance: '2.3 km',
      duration: '1 hour',
      image: 'https://github.com/ahmaat19.png',
    },
    {
      _id: 2,
      mobile: '+252615301507',
      name: 'John Doe',
      from: 'Alakananda',
      to: 'Kathmandu',
      distance: '2.3 km',
      duration: '1 hour',
      image: 'https://github.com/ibrahim.png',
    },
    {
      _id: 3,
      mobile: '+252615301507',
      name: 'John Doe',
      from: 'Alakananda',
      to: 'Kathmandu',
      distance: '2.3 km',
      duration: '1 hour',
      image: 'https://github.com/sara.png',
    },
  ]

  const chatHandler = (rider) => {
    console.log('chatHandler', rider)
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
        startRiderTwoTrip({
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
  return (
    <>
      {/* {isLoading && <Spinner />} */}
      <div className='bg-light p-4 mb-3'>
        <Head>
          <title>Search Ride</title>
          <meta property='og:title' content='Search Ride' key='title' />
        </Head>
        <div className='row gx-1 my-2'>
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
          <div className='col-lg-4 col-12'>
            <div className='mb-2 mt-1'>
              <button
                type='submit'
                onClick={submitHandler}
                className='btn btn-sm btn-primary shadow-none'
              >
                <FaSearchLocation className='mb-1' />
              </button>
              {trip.directionsResponse && (
                <button
                  className='btn btn-sm btn-danger shadow-none'
                  //   onClick={clearRoute}
                >
                  <FaTimesCircle className='mb-1' />
                </button>
              )}

              {trip.duration && (
                <button className='btn btn-sm btn-light ms-1'>
                  <FaClock className='mb-1 text-primary' /> {trip.duration}
                </button>
              )}

              {trip.distance && (
                <button className='btn btn-sm btn-light ms-1'>
                  <FaTachometerAlt className='mb-1 text-primary' />{' '}
                  {trip.distance}
                </button>
              )}
              {trip.directionsResponse && (
                <Link href='plate-confirmation'>
                  <a className='btn btn-sm btn-success ms- shadow-none float-end'>
                    <FaArrowAltCircleRight className='mb-1' /> NEXT
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* {isErrorPost && <Message variant='danger'>{errorPost}</Message>} */}
      {message && <Message variant='danger'>{message}</Message>}

      <div className='row gy-3'>
        {riders.map((rider) => (
          <div key={rider._id} className='col-lg-4 col-md-6 col-12'>
            <div className='card'>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-3 my-auto'>
                    <LazyLoad height={85} once>
                      <img
                        src={rider.image}
                        alt='avatar'
                        className='img-fluid img-thumbnail rounded-circle'
                        style={{
                          objectFit: 'cover',
                          height: '85px',
                          width: '85px',
                        }}
                      />
                    </LazyLoad>
                  </div>
                  <div className='col-7 my-auto border border-primary  border-top-0 border-bottom-0 text-center'>
                    <span className='card-title fw-bold font-monospace fs-4'>
                      {rider.name}
                    </span>
                    <br />
                    <span className='card-text'>{rider.mobile}</span>
                    <p className='card-text bg-primary text-light p-1 rounded-pill d-flex justify-content-around'>
                      <span>{rider.from}</span>
                      <FaArrowRight className='my-auto' />
                      <span>{rider.to}</span>
                    </p>
                  </div>
                  <div className='col-2 my-auto '>
                    <button
                      className='btn btn-primary btn-sm rounded-circle'
                      onClick={() => chatHandler(rider)}
                    >
                      <FaRocketchat className='mr-2' /> Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Riders
