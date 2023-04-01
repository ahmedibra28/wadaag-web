import React from 'react'
import ReactMarkdown from 'react-markdown'

import { termsOfUse } from '../utils/terms-of-use'

const TermsOfUse = () => {
  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 col-12 mx-auto">
            <ReactMarkdown>{termsOfUse}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfUse
