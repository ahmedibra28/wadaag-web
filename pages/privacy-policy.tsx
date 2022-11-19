import React from 'react'
import ReactMarkdown from 'react-markdown'

import { policy } from '../utils/policy'

const PrivacyPolicy = () => {
  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 col-12 mx-auto">
            <ReactMarkdown>{policy}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
