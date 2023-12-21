import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'

interface Props {
  url: string
}

const ViewVideo = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  return (
    <div className={styles.view_video}>
      <video
        ref={videoRef}
        className={styles.video_box}
        controls
        autoPlay
        playsInline
        src={props.url}
      />
    </div>
  )
}

export default ViewVideo
