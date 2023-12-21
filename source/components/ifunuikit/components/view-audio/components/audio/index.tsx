import React, {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  type MouseEvent,
  type FC,
} from 'react'
import { uniqueId } from 'lodash'
import styles from './style.module.css'
import Icon from '../../../../assets/icons'
import { Button, Tooltip } from 'antd'

function transTime(value: number) {
  function formatTime(val: string) {
    let time = ''
    const s = val.split(':')
    let i = 0
    for (; i < s.length - 1; i++) {
      time += s[i].length === 1 ? `0${s[i]}` : s[i]
      time += ':'
    }
    time += s[i].length === 1 ? `0${s[i]}` : s[i]

    return time
  }

  let val = value
  let time = ''
  const h = parseInt(String(val / 3600), 10)
  val %= 3600
  const m = parseInt(String(val / 60), 10)
  const s = parseInt(String(val % 60), 10)
  if (h > 0) {
    time = formatTime(`${h}:${m}:${s}`)
  } else {
    time = formatTime(`${m}:${s}`)
  }

  return time
}

export const Audio: FC<any> = props => {
  const { src, errorHandle } = props
  const audioRef = useRef<HTMLAudioElement>(null)
  const barBgRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const [toggle, setToggle] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)
  const [duration, setDuration] = useState<string>('00 : 00')
  const [currentTime, setCurrentTime] = useState<string>('00:00')
  const [isLoop, setIsLoop] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(100)

  useLayoutEffect(() => {
    if (audioRef.current && src) {
      audioRef.current.addEventListener('play', (e: Event) => {
        const pid = (e.target as HTMLAudioElement).getAttribute('pid')
        const audios = document.querySelectorAll('audio')
        audios.forEach((element, index) => {
          if (element.getAttribute('pid') === pid) {
            return
          }
          element.pause()
        })
      })

      audioRef.current.addEventListener('loadedmetadata', e => {
        const durat = transTime(
          (e.target as HTMLAudioElement).duration as number,
        )
        setDuration(durat)
      })
      audioRef.current.addEventListener('play', () => {
        setToggle(false)
      })
      audioRef.current.addEventListener('pause', () => {
        setToggle(true)
      })
      audioRef.current.addEventListener('timeupdate', e => {
        const value =
          (e.target as HTMLAudioElement).currentTime /
          (audioRef.current as HTMLAudioElement).duration
        setProgress(value * 100)
        setCurrentTime(transTime((e.target as HTMLAudioElement).currentTime))

        // console.log('timeupdate res', res.target.currentTime);
      })
    }
  }, [src])

  useEffect(() => {
    if (dotRef.current && src) {
      const position = {
        oriOffestLeft: 0,
        oriX: 0,
        maxLeft: 0,
        maxRight: 0,
      }
      let flag = false

      // 按下
      const down = (event: TouchEvent | MouseEvent) => {
        if (!audioRef.current?.paused || audioRef.current.currentTime !== 0) {
          flag = true
          position.oriOffestLeft = dotRef.current?.offsetLeft ?? 0
          position.oriX =
            event instanceof TouchEvent
              ? event.touches[0].clientX
              : event.clientX
          position.maxLeft = position.oriOffestLeft
          position.maxRight =
            barBgRef.current?.offsetWidth ?? 0 - position.oriOffestLeft

          if (event && event.preventDefault) {
            event.preventDefault()
          }

          // 禁止事件冒泡
          if (event && event.stopPropagation) {
            event.stopPropagation()
          }
        }
      }

      // 移动
      const move = (event: TouchEvent | MouseEvent) => {
        if (flag && barBgRef.current) {
          const clientX =
            event instanceof TouchEvent
              ? event.touches[0].clientX
              : event.clientX

          let length = clientX - position.oriX
          if (length > position.maxRight) {
            length = position.maxRight
          } else if (length < -position.maxLeft) {
            length = -position.maxLeft
          }

          // let pgsWidth = barBgRef.current?.offsetWidth;
          const pgsWidth = parseFloat(
            window.getComputedStyle(barBgRef.current).width.replace('px', ''),
          )
          const rate = (position.oriOffestLeft + length) / pgsWidth
          ;(audioRef.current as HTMLAudioElement).currentTime =
            (audioRef.current as HTMLAudioElement).duration * rate
        }
      }

      // 结束
      const end = () => {
        flag = false
      }

      // 鼠标按下时
      dotRef.current.addEventListener('mousedown', down as any, false)
      dotRef.current.addEventListener('touchstart', down, false)

      // 开始拖动
      document.addEventListener('mousemove', move as any, false)
      document.addEventListener('touchmove', move, false)

      // 拖动结束
      document.addEventListener('mouseup', end, false)
      barBgRef.current?.addEventListener('touchend', end, false)
    }
  }, [src])

  useEffect(() => {
    if (audioRef.current) {
      setVolume(audioRef.current.volume * 100)
      audioRef.current.onerror = function () {
        errorHandle()
      }
    }
  }, [])

  const handlePaly = () => {
    if (toggle && src) {
      audioRef.current?.play()
      return
    }
    audioRef.current?.pause()
  }
  const handleScroll = (e: any) => {
    if (audioRef.current) {
      if (e.nativeEvent.deltaY > 0) {
        if (audioRef.current.volume >= 0.1) {
          audioRef.current.volume -= 0.1
        }
      } else if (audioRef.current.volume <= 0.9) {
        audioRef.current.volume += 0.1
      }
      setVolume(Math.trunc(audioRef.current.volume * 100))
    }
  }

  return (
    <div className={styles.audio_div}>
      <audio
        src={src}
        loop={isLoop}
        preload="metadata"
        ref={audioRef}
        onError={props.onFail}
      />
      <div className={styles.audio_container}>
        <div className={styles.progress}>
          <div className={styles.audio_progress_bar_bg} ref={barBgRef}>
            <span
              ref={dotRef}
              className={styles.progress_dot}
              style={{ left: `${progress}%` }}
            />
            <div
              ref={barRef}
              className={styles.audio_progress_bar}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
        <div id="pop" className={styles.action}>
          <div onClick={handlePaly}>
            {toggle && src ? (
              <Icon className={styles.audio_toggle} type="play" />
            ) : (
              <Icon className={styles.audio_toggle} type="pause-2" />
            )}
          </div>
          <div className={styles.audio_time}>
            {currentTime} /{' '}
            <span style={{ color: 'rgba(187, 189, 191, 1)' }}>{duration}</span>
          </div>
          <Tooltip
            placement="bottom"
            title="音量"
            getPopupContainer={() =>
              document.getElementById('pop') as HTMLElement
            }
          >
            <Button
              onWheel={handleScroll}
              style={{ marginRight: '24px' }}
              type="ghost"
              icon={<Icon style={{ color: 'white' }} type="volume" />}
            >
              <span style={{ color: 'white' }}>
                {volume}
                {'%'}
              </span>
            </Button>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title="循环播放"
            getPopupContainer={() =>
              document.getElementById('pop') as HTMLElement
            }
          >
            <Button
              onClick={() => setIsLoop(!isLoop)}
              type={isLoop ? 'default' : 'ghost'}
              icon={
                <Icon
                  style={{ color: isLoop ? '#617EF2' : 'white' }}
                  type="circulate"
                />
              }
            />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default Audio
