/* eslint-disable react-hooks/exhaustive-deps */
import { Divider } from 'antd'
import styled from '@emotion/styled'
import WrapRight from './components/WrapRight'
import WrapLeft from './components/WrapLeft'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

const DividerWrap = styled(Divider)({
  margin: '0 24px',
  height: '100%',
})

const Wrap = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 24px',
  background: 'white',
  height: 'calc(100% - 50px)',
})

const DemandInfo = () => {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const { getDemandInfo } = useModel('demand')
  const { isRefresh, setIsRefresh } = useModel('user')

  useEffect(() => {
    getDemandInfo({ projectId, id: demandId })
  }, [])

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
      <WrapLeft onUpdate={onUpdate} />
      <DividerWrap type="vertical" />
      <WrapRight />
    </Wrap>
  )
}

export default DemandInfo
