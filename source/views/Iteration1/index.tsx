import PermissionWrap from '@/components/PermissionWrap'
import { useSelector } from '@store/index'
import { Content, IterationContent } from './style'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import IterationList from './components/IterationList'
import { useState } from 'react'

const Iteration = () => {
  const { currentMenu } = useSelector(store => store.user)
  const [isShowLeft, setIsShowLeft] = useState(true)
  //   搜索
  const onInputSearch = () => {
    //
  }

  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <Content>
        <ProjectCommonOperation onInputSearch={onInputSearch} />
        <IterationContent>
          <IterationList isShowLeft={isShowLeft} />
        </IterationContent>
      </Content>
    </PermissionWrap>
  )
}

export default Iteration
