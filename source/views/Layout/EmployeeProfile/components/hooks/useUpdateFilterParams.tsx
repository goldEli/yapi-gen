import { getParamsData } from '@/tools'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { setFilterParamsOverall } from '@store/employeeProfile'
const useUpdateFilterParams = () => {
  const dispatch = useDispatch()
  const { filterParamsOverall } = useSelector(store => store.employeeProfile)
  const updateFilterParams = (params: any) => {
    dispatch(
      setFilterParamsOverall({
        ...filterParamsOverall,
        ...params,
      }),
    )
  }
  return {
    updateFilterParams,
    filterParamsOverall,
  }
}
export default useUpdateFilterParams
