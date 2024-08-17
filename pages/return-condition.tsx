import React from 'react'
import ReactMarkdown from 'react-markdown'

import { returnCondition } from '../utils/return-condition'

const PrivacyReturnCondition = () => {
  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 col-12 mx-auto">
            <ReactMarkdown>{returnCondition}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyReturnCondition
