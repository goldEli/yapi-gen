// 需求设置主页

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import Main from './Main'
import Workflow from './Workflow'
import FieldSet from './FieldSet'
import { getParamsData } from '@/tools'
import PermissionWrap from '@/components/PermissionWrap'
import { useModel } from '@/models'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
})

const contentList = [
  { key: 'main', content: <Main /> },
  { key: 'work', content: <Workflow /> },
  { key: 'field', content: <FieldSet /> },
]

const DemandSet = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const pageIdx = paramsData.pageIdx || 'main'
  const { projectInfo } = useModel('project')

  return (
    <PermissionWrap
      auth="b/project/story_config"
      permission={projectInfo?.projectPermissions}
    >
      <Wrap>{contentList.filter(i => i.key === pageIdx)[0]?.content}</Wrap>
    </PermissionWrap>
  )
}

export default DemandSet
