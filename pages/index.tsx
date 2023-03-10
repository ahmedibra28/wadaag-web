import Image from 'next/image'
import React from 'react'
import {
  FaApple,
  FaFacebook,
  FaGooglePlay,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa'

const Home = () => {
  return (
    <div className="hero">
      <div className="container">
        <div className="mx-auto text-center">
          <div className="mb-5" style={{ marginTop: -100 }}>
            <Image
              src="/logo.png"
              className="img-fluid rounded-pill mb-3"
              alt="Wadaag Logo"
              width={150}
              height={150}
            />

            <div className="fs-4 fw-bold text-light">
              Download Wadaag App Now
            </div>
          </div>

          <a
            href="https://apps.apple.com/ke/app/wadaag/id6444431746"
            target="_blank"
            rel="noreferrer"
            style={{ minWidth: 265 }}
            className="my-3 mx-3 btn btn-light rounded-4 px-4"
          >
            <div className="row px-2">
              <div className="col-auto my-auto text-start p-0">
                <FaApple
                  className="mb-1 my-primacy-color"
                  style={{ fontSize: '300%' }}
                />
              </div>
              <div className="col-auto my-auto text-start p-0 ms-3">
                <div className="fw-light">Download on the app</div>
                <div className="fs-3 fw-bold">App Store</div>
              </div>
            </div>
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.wadaag"
            target="_blank"
            rel="noreferrer"
            style={{ minWidth: 265 }}
            className="my-3 mx-3 btn btn-light rounded-4 px-4"
          >
            <div className="row px-2">
              <div className="col-auto my-auto text-start p-0">
                <FaGooglePlay
                  className="mb-1 my-primacy-color"
                  style={{ fontSize: '300%' }}
                />
              </div>
              <div className="col-auto my-auto text-start p-0 ms-3">
                <div className="fw-light text-uppercase">Get It On</div>
                <div className="fs-3 fw-bold">Google Play</div>
              </div>
            </div>
          </a>
        </div>

        <div className="text-light text-center mt-5">
          <hr className="text-light" />
          <a
            href="https://www.facebook.com/wadaagapp"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook className="text-light fs-3" />
          </a>
          <a
            className="mx-4"
            href="https://www.instagram.com/wadaagapp"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram className="text-light fs-3" />
          </a>
          <a
            href="https://www.tiktok.com/@wadaagapp"
            target="_blank"
            rel="noreferrer"
          >
            <FaTiktok className="text-light fs-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home
