// 需求详情

/* eslint-disable react-hooks/exhaustive-deps */
import styled from '@emotion/styled'
import WrapRight from './components/WrapRight'
import WrapLeft from './components/WrapLeft'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getParamsData } from '@/tools'

const Wrap = styled.div({
  display: 'flex',
  padding: '0 4px 0 24px',
  background: 'white',
  height: 'calc(100% - 64px)',
  margin: 16,
  borderRadius: 6,
})

const DemandInfo = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const { getDemandInfo } = useModel('demand')
  const { isRefresh, setIsRefresh } = useModel('user')

  useEffect(() => {
    if (isRefresh) {
      getDemandInfo({ projectId, id: demandId })
      setIsRefresh(false)
    }
  }, [isRefresh])

  const onUpdate = () => {
    getDemandInfo({ projectId, id: demandId })
  }

  return (
    <Wrap>
      <WrapLeft />
      <WrapRight onUpdate={onUpdate} />
    </Wrap>
  )
}

export default DemandInfo
