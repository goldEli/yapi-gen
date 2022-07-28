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
  height: 'inherit',
})

const DemandInfo = () => {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const { getDemandInfo } = useModel('demand')

  useEffect(() => {
    getDemandInfo({ projectId, id: demandId })
  }, [])

  const onUpdate = () => {
    getDemandInfo({ projectId, id: demandId })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'white',
      }}
    >
      <WrapLeft onUpdate={onUpdate} />
      <DividerWrap type="vertical" />
      <WrapRight />
    </div>
  )
}

export default DemandInfo
