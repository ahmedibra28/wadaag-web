import React from 'react'
import ReactMarkdown from 'react-markdown'

import { policy } from '../utils/policy'

const PrivacyPolicy = () => {
  return (
    <div className='container-fluid'>
      <nav className='navbar bg-light'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            Wadaag
          </a>
        </div>
      </nav>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-8 col-md-10 col-12 mx-auto'>
            <ReactMarkdown>{policy}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
