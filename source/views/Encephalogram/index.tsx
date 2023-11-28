import MapContent from './components/MapContent'
import { EncephalogramBox } from './styles'
import ToolBar from './components/ToolBar'
import TopArea from './components/TopArea'
import FullScreenBox from './components/FullScreenBox'
import { Spin } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'

const Encephalogram = () => {
  const { loading } = useSelector(store => store.encephalogram)
  const { projectInfo } = useSelector(store => store.project)
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0
  return (
    <PermissionWrap
      auth="b/map"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <FullScreenBox>
        <Spin indicator={<NewLoadingTransition />} spinning={loading}>
          <EncephalogramBox className="encephalogramBox">
            <TopArea />
            <ToolBar />
            <MapContent />
          </EncephalogramBox>
        </Spin>
      </FullScreenBox>
    </PermissionWrap>
  )
}
export default Encephalogram
