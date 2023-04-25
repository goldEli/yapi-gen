import React from 'react'

const useRepeatSchedule = (data?: Model.Schedule.Info | null) => {
  const isRepeatSchedule = React.useMemo(() => {
    if (!data) {
      return false
    }
    const { repeat_type } = data
    return (
      repeat_type === 1 ||
      repeat_type === 2 ||
      repeat_type === 3 ||
      repeat_type === 4
    )
  }, [data])
  return {
    isRepeatSchedule,
  }
}

export default useRepeatSchedule
