import { useSelector } from '@store/index'
import React, { useMemo } from 'react'

const useGroupType = () => {
  const { sortByGroupOptions } = useSelector(store => store.kanBan)
  const groupType = useMemo(() => {
    return sortByGroupOptions?.find(item => item.check)?.key
  }, [sortByGroupOptions])
  const showUserRelatedInformation = useMemo(() => {
    return groupType === 'users'
  }, [groupType])
  return {
    groupType,
    showUserRelatedInformation,
  }
}

export default useGroupType
