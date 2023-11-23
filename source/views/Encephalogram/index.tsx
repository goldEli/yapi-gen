import MapContent from './components/MapContent'
import { EncephalogramBox } from './styles'
import ToolBar from './components/ToolBar'
import TopArea from './components/TopArea'
import FullScreenBox from './components/FullScreenBox'
import { Spin } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { useSelector } from '@store/index'

const Encephalogram = () => {
  const { loading } = useSelector(store => store.encephalogram)
  return (
    <FullScreenBox>
      <Spin indicator={<NewLoadingTransition />} spinning={loading}>
        <EncephalogramBox className="encephalogramBox">
          <TopArea />
          <ToolBar />
          <MapContent />
        </EncephalogramBox>
      </Spin>
    </FullScreenBox>
  )
}
export default Encephalogram
