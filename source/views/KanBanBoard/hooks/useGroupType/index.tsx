import { useSelector } from '@store/index'
import React, { useMemo } from 'react'

const useGroupType = () => {
  const { sortByGroupOptions } = useSelector(store => store.kanBan)

  const groupType = useMemo(() => {
    return sortByGroupOptions?.find(item => item.check)?.key
  }, [sortByGroupOptions])

  // 按用户分组
  const showUserRelatedInformation = useMemo(() => {
    return groupType === 'users'
  }, [groupType])

  // 没有分组
  const isNoGroup = useMemo(() => {
    return groupType === 'none'
  }, [groupType])

  return {
    groupType,
    showUserRelatedInformation,
    isNoGroup,
  }
}

export default useGroupType
