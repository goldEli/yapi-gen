import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { setFilterParamsOverall } from '@store/employeeProfile'
const useUpdateFilterParams = () => {
  const dispatch = useDispatch()
  const { filterParamsOverall } = useSelector(store => store.employeeProfile)
  const navigate = useNavigate()
  const updateFilterParams = (params: any) => {
    dispatch(
      setFilterParamsOverall({
        ...filterParamsOverall,
        ...params,
      }),
    )
  }
  const restRouter = () => {
    const searchParams = new URLSearchParams(location.search)

    searchParams.delete('data')

    const queryString = searchParams.toString()

    navigate(`?${queryString}`)
  }
  return {
    updateFilterParams,
    filterParamsOverall,
    restRouter,
  }
}
export default useUpdateFilterParams
