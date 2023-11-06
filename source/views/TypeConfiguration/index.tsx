import CategoryList from './components/CategoryLeft'
import CategoryMain from './components/CategoryMain'
import { TypeConfigurationWrap } from './style'
import Workflow from '../Workflow'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

const TypeConfiguration = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [type, setType] = useState(1)

  useEffect(() => {
    if (paramsData?.id) {
      setType(paramsData?.key ?? 1)
    }
  }, [paramsData])

  return (
    <TypeConfigurationWrap>
      <CategoryList />
      {type === 1 ? <CategoryMain /> : <Workflow />}
    </TypeConfigurationWrap>
  )
}

export default TypeConfiguration
