const districts = [
  { label: 'Ceelasha Biyaha', value: 'Ceelasha Biyaha' },
  { label: 'Grasbaaleey', value: 'Grasbaaleey' },
  { label: 'Kaxda', value: 'Kaxda' },
  { label: 'Dayniile', value: 'Dayniile' },
  { label: 'Dharkeynleey', value: 'Dharkeynleey' },
  { label: 'Wadajir', value: 'Wadajir' },
  { label: 'Waaberi', value: 'Waaberi' },
  { label: 'Hodan', value: 'Hodan' },
  { label: 'Hawlwadaag', value: 'Hawlwadaag' },
  { label: 'Xamar Jajab', value: 'Xamar Jajab' },
  { label: 'Wartanabada', value: 'Wartanabada' },
  { label: 'Xamar Weyne', value: 'Xamar Weyne' },
  { label: 'Yaaqshid', value: 'Yaaqshid' },
  { label: 'Boondheere', value: 'Boondheere' },
  { label: 'Cabdicasiis', value: 'Cabdicasiis' },
  { label: 'Shibis', value: 'Shibis' },
  { label: 'Shangaani', value: 'Shangaani' },
  { label: 'Hiliwaa', value: 'Hiliwaa' },
  { label: 'Kaaraan', value: 'Kaaraan' },
]

export const getDistricts = () => districts

export const getDistrictsByLabel = (label: string) => {
  const district = districts.find((d) => d.label === label)
  return district
}
