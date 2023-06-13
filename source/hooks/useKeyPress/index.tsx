import React from 'react'
// import { useHotkeys } from 'react-hotkeys-hook'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { getParamsData } from '@/tools'
const useKeyPress = () => {
  const navigator = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  const { type } = paramsData || {}
  const useKeys = (key: string, url: string) => {
    // useHotkeys(
    //   key,
    //   () => {
    //     const paramsData = encryptPhp(
    //       JSON.stringify({
    //         projectId: projectId,
    //         id: projectId,
    //         type: type,
    //       }),
    //     )
    //     navigator(`${url}?data=${paramsData}`)
    //   },
    //   [],
    // )
  }
  return {
    useKeys,
  }
}

export default useKeyPress
