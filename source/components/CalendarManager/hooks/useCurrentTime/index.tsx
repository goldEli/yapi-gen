import dayjs from 'dayjs'

const useCurrentTime = () => {
  const currentTime = dayjs()

  return { currentTime }
}

export default useCurrentTime
