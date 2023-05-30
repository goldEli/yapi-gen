import { useSelector } from '@store/index'
import React, { useMemo } from 'react'

const useGroupType = () => {
  const { sortByGroupOptions } = useSelector(store => store.kanBan)
  const type = useMemo(() => {
    return sortByGroupOptions?.find(item => item.check)?.key
  }, [sortByGroupOptions])
  const showUserRelatedInformation = useMemo(() => {
    return type === 'users'
  }, [type])
  return {
    type,
    showUserRelatedInformation,
  }
}

export default useGroupType
