/* eslint-disable consistent-return */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Tree, type TreeProps } from 'antd'
import { useEffect, useState } from 'react'
import { getTreeList } from '@/services/project/tree'

const Left = styled.div<{ isShowLeft: boolean }>(
  {
    width: 300,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    borderRight: '1px solid #EBEDF0',
    padding: '0px 16px 10px',
    background: 'white',
    height: 'calc(100vh - 64px)',
    '.ant-space-item': {
      display: 'flex',
    },
  },
  ({ isShowLeft }) => ({
    display: isShowLeft ? 'block' : 'none',
  }),
)

const TitleWrap = styled.div({
  fontSize: 14,
  color: '#646566',
  lineHeight: '52px',
})

interface Props {
  isShowLeft: boolean
  projectId: any
}

const WrapLeft = (props: Props) => {
  const init = async () => {
    const res = await getTreeList({ id: props.projectId })
    // console.log(res)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Left isShowLeft={props.isShowLeft}>
      <TitleWrap>需求分类</TitleWrap>
    </Left>
  )
}

export default WrapLeft
