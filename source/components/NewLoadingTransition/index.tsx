import React from 'react'
import spingImg from '/newLoading.gif'

const NewLoadingTransition = (props: any) => {
  return (
    <img
      src={spingImg}
      style={{
        width: props.size ? props.size : 100,
        height: props.size ? props.size : 100,
      }}
      alt=""
    />
  )
}

export default NewLoadingTransition
