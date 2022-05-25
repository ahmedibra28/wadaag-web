import { useDispatch, useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import {
  FaRocketchat,
  FaTimesCircle,
  FaTachometerAlt,
  FaArrowAltCircleRight,
  FaSearchLocation,
  FaSignature,
  FaClock,
  FaPhoneAlt,
  FaMapPin,
  FaFlagCheckered,
} from 'react-icons/fa'
import Head from 'next/head'
import Link from 'next/link'
import { FormContainer, Message, Spinner } from '../components'
import LazyLoad from 'react-lazyload'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { cancelRiderTwoTrip, startRiderTwoTrip } from '../redux/slice/trip'
import useRidesHook from '../utils/api/rides'
import useChatsHook from '../utils/api/chats'
import { useRouter } from 'next/router'

const Riders = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [libraries, setLibraries] = useState(['places'])
  const [message, setMessage] = useState('')
  /** @type React.MutableRefObject<HTMLDivElement> */
  const originRef = useRef()

  /** @type React.MutableRefObject<HTMLDivElement> */
  const destinationRef = useRef()

  const [temp, setTemp] = useState('')

  const trip = useSelector((state) =>
    JSON.parse(JSON.stringify(state.trip.riderTwo))
  )

  const { getPendingRider, postNearRiders } = useRidesHook({
    page: 1,
    limit: 25,
  })

  const { postChat } = useChatsHook({
    page: 1,
    limit: 25,
  })

  const { data } = getPendingRider

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    mutateAsync,
    data: dataPost,
  } = postNearRiders

  const {
    isLoading: isLoadingChatPost,
    isError: isErrorChatPost,
    error: errorChatPost,
    mutateAsync: mutateAsyncChat,
    isSuccess: isSuccessChatPost,
  } = postChat

  useEffect(() => {
    if (data) {
      router.push('/ride-waiting')
    }
  }, [data, router])

  useEffect(() => {
    if (isSuccessChatPost) {
      router.push(`/chats/${temp._id}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessChatPost])

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })

  if (!isLoaded) {
    return <Spinner />
  }

  const chatHandler = (rider) => {
    setTemp(rider)
    mutateAsyncChat({ user: rider._id, text: 'Asckm' })
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
          originLatLng:
            results.routes[0].legs[0].start_location.lat() +
            ',' +
            results.routes[0].legs[0].start_location.lng(),
          destinationLatLng:
            results.routes[0].legs[0].end_location.lat() +
            ',' +
            results.routes[0].legs[0].end_location.lng(),
        })
      )

      mutateAsync({
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
    dispatch(cancelRiderTwoTrip())
    setMessage('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  return (
    <>
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}
      {isErrorChatPost && <Message variant='danger'>{errorChatPost}</Message>}
      {message && <Message variant='danger'>{message}</Message>}

      {dataPost && dataPost.length === 0 && (
        <Message variant='danger'>No riders found near you 😢</Message>
      )}

      {/* {isLoading && <Spinner />} */}
      <div className='bg-light p-3 mb-3'>
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
                disabled={isLoadingPost}
              >
                {isLoadingPost ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <FaSearchLocation className='mb-1' />
                )}
              </button>

              {trip.duration && (
                <button
                  className='btn btn-sm btn-light'
                  style={{ fontSize: 14 }}
                >
                  <FaClock className='mb-1 text-primary' /> {trip.duration}
                </button>
              )}

              {trip.distance && (
                <button
                  className='btn btn-sm btn-light'
                  style={{ fontSize: 13 }}
                >
                  <FaTachometerAlt className='mb-1 text-primary' />{' '}
                  {trip.distance}
                </button>
              )}
              {trip.directionsResponse && (
                <button
                  className='btn btn-sm btn-danger shadow-none float-end'
                  onClick={clearRoute}
                >
                  <FaTimesCircle className='mb-1' />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoadingPost ? (
        <Spinner />
      ) : isErrorPost ? (
        <Message variant='danger'>{errorPost}</Message>
      ) : (
        <div className='row gy-3'>
          {dataPost &&
            dataPost.map((rider) => (
              <div key={rider._id} className='col-lg-4 col-md-6 col-12'>
                <div className='card shadow border-0'>
                  <div className='card-body p-2'>
                    <div className='row'>
                      <div className='col-3 my-auto'>
                        <LazyLoad height={63} once>
                          <img
                            src={rider.image}
                            alt='avatar'
                            className='img-fluid img-thumbnail rounded-circle'
                            style={{
                              objectFit: 'cover',
                              height: '63px',
                              width: '63px',
                            }}
                          />
                        </LazyLoad>
                      </div>
                      <div
                        className='col-7 my-auto border border-primary  border-top-0 border-bottom-0'
                        style={{ fontSize: 12 }}
                      >
                        <div className='fw-bold text-primary fs-6'>
                          <FaSignature /> {rider.name}
                        </div>

                        <div>
                          <FaPhoneAlt className='text-primary' />{' '}
                          {rider.mobileNumber}
                        </div>
                        <div>
                          <FaMapPin className='text-primary' /> {rider.from}
                        </div>
                        <div>
                          <FaFlagCheckered className='text-primary' />{' '}
                          {rider.to}
                        </div>
                      </div>
                      <div className='col-2 my-auto '>
                        <button
                          className='btn btn-primary btn-sm rounded-circle'
                          onClick={() => chatHandler(rider)}
                          disabled={isLoadingChatPost}
                        >
                          {isLoadingChatPost ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <FaRocketchat />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  )
}

export default Riders
