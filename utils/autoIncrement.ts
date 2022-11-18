const autoIncrement = (lastRecordId: number) => {
  const increasedNo = lastRecordId + 1
  let kmsStr = 'W'
  for (let i = 0; i < 6 - increasedNo.toString().length; i++) {
    kmsStr = kmsStr + '0'
  }
  kmsStr = kmsStr + increasedNo.toString()
  return kmsStr
}

export default autoIncrement
