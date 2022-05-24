const requestedRiders = [
  {
    _id: '1',
    from: 'Yardımeli Hospital, Mogadishu, Somalia',
    to: 'Beydan, Mogadishu, Somalia',
    distance: '2.7 km',
    duration: '9 mins',
    originLatLng: '2.0215638,45.3272154',
    destinationLatLng: '2.0330259,45.3140678',
  },
  {
    _id: '2',
    from: 'Yardımeli Hospital, Mogadishu, Somalia',
    to: 'Beydan, Mogadishu, Somalia',
    distance: '2.7 km',
    duration: '9 mins',
    originLatLng: '2.0215638,45.3272154',
    destinationLatLng: '2.0330259,45.3140678',
  },
  {
    _id: '3',
    from: 'Liberia Road, Mogadishu, Somalia',
    to: 'Milgo, Makkah Almukarramah Avenue, Mogadishu, Somalia',
    distance: '1.0 km',
    duration: '6 mins',
    originLatLng: '2.0382793,45.3165633',
    destinationLatLng: '2.0325899,45.3139413',
  },
  {
    _id: '4',
    from: 'Milgo, Makkah Almukarramah Avenue, Mogadishu, Somalia',
    to: 'Yardımeli Hospital, Mogadishu, Somalia',
    distance: '2.9 km',
    duration: '10 mins',
    originLatLng: '2.0325899,45.3139413',
    destinationLatLng: '2.0215638,45.3272154',
  },
  {
    _id: '5',
    from: 'Beydan, Mogadishu, Somalia',
    to: 'Yardımeli Hospital, Mogadishu, Somalia',
    distance: '3.0 km',
    duration: '11 mins',
    originLatLng: '2.0330259,45.3140678',
    destinationLatLng: '2.0215638,45.3272154',
  },
  {
    _id: '6',
    from: 'Yardımeli Hospital, Mogadishu, Somalia',
    to: 'Sada, Mogadishu, Somalia',
    distance: '2.6 km',
    duration: '9 mins',
    originLatLng: '2.0215638,45.3272154',
    destinationLatLng: '2.0325929,45.3139712',
  },
  {
    _id: '7',
    from: 'Yardımeli Hospital, Mogadishu, Somalia',
    to: 'Hotel Makka Al-Mukaramah, Somalia',
    distance: '2.1 km',
    duration: '10 mins',
    originLatLng: '2.0215638,45.3272154',
    destinationLatLng: '2.0342921,45.3222911',
  },
  {
    _id: '8',
    from: 'DFS Somalia, Mogadishu, Somalia',
    to: 'Java coffee, Mogadishu, Somalia',
    distance: '4.0 km',
    duration: '13 mins',
    originLatLng: '2.020037,45.3177179',
    destinationLatLng: '2.0327255,45.315271',
  },
  {
    _id: '9',
    from: 'Dagmada Xamar Jajab, Mogadishu, Somalia',
    to: 'Midnimo Supermarket, Makkah Almukarramah Avenue, Mogadishu, Somalia',
    distance: '1.7 km',
    duration: '10 mins',
    originLatLng: '2.024269,45.3298833',
    destinationLatLng: '2.0342048,45.3221025',
  },
]

const riderRequest = {
  _id: 18,
  from: 'Yardımeli Hospital, Mogadishu, Somalia',
  to: 'Midnimo Supermarket, Makkah Almukarramah Avenue, Mogadishu, Somalia',
  originLatLng: '2.0215638,45.3272154',
  destinationLatLng: '2.0329175,45.318861',
}

const nearOrigin = requestedRiders.filter(
  (rider) =>
    Math.abs(
      Number(rider.originLatLng.split(',')[0]) -
        Number(riderRequest.originLatLng.split(',')[0])
    ) < 0.005 &&
    Math.abs(
      Number(rider.originLatLng.split(',')[1]) -
        Number(riderRequest.originLatLng.split(',')[1])
    ) < 0.005
)

const nearDestination = nearOrigin.filter(
  (rider) =>
    Math.abs(
      Number(rider.destinationLatLng.split(',')[0]) -
        Number(riderRequest.destinationLatLng.split(',')[0])
    ) < 0.005 &&
    Math.abs(
      Number(rider.destinationLatLng.split(',')[1]) -
        Number(riderRequest.destinationLatLng.split(',')[1])
    ) < 0.005
)

const metric = 1
const km = 111

const convertMetricToKm = (metric) => {
  return `${metric * km} km`
}

// console.log(convertMetricToKm(0.1))
// console.log(convertMetricToKm(0.005))
// console.log(convertMetricToKm(0.001))
