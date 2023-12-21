import React from 'react'
import Icon from '../../assets/icons'
import { Audio } from './components/audio'
import styles from './style.module.css'

interface Props {
  url: string
}

const ViewAudio = (props: Props) => {
  return (
    <div className={styles.view_audio}>
      <div className={styles.audio_box}>
        <Audio src={props.url} />
        <Icon className={styles.player_icon} type="file-audio" />
      </div>
    </div>
  )
}

export default ViewAudio
