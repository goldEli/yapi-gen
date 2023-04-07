/* eslint-disable @typescript-eslint/naming-convention */
import CommonButton from '@/components/CommonButton'
import LeftTitle from '@/components/LeftTitle'
import { useDispatch } from '@store/index'
import { changeVisibleFilter } from '@store/SiteNotifications'
import { useParams } from 'react-router'
import AllSideFilter from '../components/AllSideFilter/AllSideFilter'
import ContentItem from '../components/ContentItem/ContentItem'

interface ZoomRatioType {
  [MapZoom: string]: string
}
const Index = () => {
  // const titles =
  const dispatch = useDispatch()
  const { id } = useParams()
  const titles: ZoomRatioType = {
    1: '全部通知',
    2: '未读通知',
    3: '已读通知',
    4: '提及我的',
  }

  return (
    <div>
      <AllSideFilter />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px 24px',
          alignItems: 'center',
        }}
      >
        <LeftTitle title={titles[id as string]} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <CommonButton
            onClick={() => dispatch(changeVisibleFilter(true))}
            type="light"
          >
            筛选通知
          </CommonButton>
          {id !== '3' && <CommonButton type="light">全部已读</CommonButton>}
        </div>
      </div>

      <div style={{ padding: '0 80px' }}>
        <ContentItem />
      </div>
    </div>
  )
}

export default Index
