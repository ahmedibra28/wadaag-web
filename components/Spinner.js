import LoadingIcons from 'react-loading-icons'

export const Spinner = (props) => {
  const { height = '3em', stroke = '#5c1a67' } = props
  return (
    <div className='text-center'>
      <LoadingIcons.ThreeDots
        stroke={stroke}
        height={height}
        fill='transparent'
      />
      <p style={{ color: '#5c1a67' }}>Loading...</p>
    </div>
  )
}
