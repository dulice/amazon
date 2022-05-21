import React from 'react'

const getError = (error) => {
  return (
    error.response && error.response.data 
        ? error.response.data.message 
        : error.message 
    )
}

export default getError