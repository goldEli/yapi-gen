/**
 * 计算日程冲突
 * 得到冲突日程的宽度 以及  left位置
 */

import { useSelector } from '@store/index'

const useCalculationConflict = () => {
  const list = useSelector(store => store.schedule.scheduleList)
}

export default useCalculationConflict
