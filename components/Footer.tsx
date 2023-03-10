// import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="text-primary container-fluid" style={{ minHeight: 30 }}>
      <div className="row ">
        <div className="col text-start py-1 footer font-monospace bg-light my-auto">
          Developed by{' '}
          <a target="_blank" href="https://ahmedibra.com" rel="noreferrer">
            Ahmed Ibrahim
          </a>
          {/* <br />
          <Image src="/footer.png" width="30" height="30" alt="logo" /> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
