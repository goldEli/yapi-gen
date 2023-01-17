// 需求详情

/* eslint-disable react-hooks/exhaustive-deps */
import styled from '@emotion/styled'
import WrapRight from './components/WrapRight'
import WrapLeft from './components/WrapLeft'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import { getDemandInfo } from '@/services/project/demand'
import { setDemandInfo } from '@store/demand'

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
  const dispatch = useDispatch()
  const { isRefresh } = useSelector((store: { user: any }) => store.user)

  const onUpdate = async () => {
    const result = await getDemandInfo({ projectId, id: demandId })
    dispatch(setDemandInfo(result))
  }

  useEffect(() => {
    if (isRefresh) {
      onUpdate()
      dispatch(setIsRefresh(false))
    }
  }, [isRefresh])

  return (
    <Wrap>
      <WrapLeft />
      <WrapRight onUpdate={onUpdate} />
    </Wrap>
  )
}

export default DemandInfo
