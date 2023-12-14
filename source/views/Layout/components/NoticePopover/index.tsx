import { Button, Popover } from 'antd'
import { ContentList, FooterBox, NoticePopoverWrap } from './style'
import CommonIconFont from '@/components/CommonIconFont'
import { ICON_TYPE_DATA } from './constant'
import NoticeItem from './NoticeItem'
import { useEffect, useState } from 'react'
import { getMsg_list } from '@/services/SiteNotifications'
import dayjs from 'dayjs'
interface IProps {}
const NoticePopover = (props: any) => {
  const { onHistoryStatics } = props
  const [data, setData] = useState([])
  const _getMsg_list = async () => {
    const todayDate = dayjs(new Date()).format('YYYY-MM-DD')
    const lastSevenDays = dayjs(todayDate)
      .subtract(7, 'days')
      .format('YYYY-MM-DD')
    console.log(
      todayDate,
      lastSevenDays,
      new Date(lastSevenDays).valueOf() / 1000,
    )
    const res = await getMsg_list({
      business_type: 1,
      latTime: new Date(lastSevenDays).valueOf() / 1000,
      nowWhereReadAll: true,
    })
    setData(res?.list)
  }
  useEffect(() => {
    _getMsg_list()
  }, [])

  return (
    <NoticePopoverWrap>
      <ContentList>
        {data.map((item: any, index: number) => {
          return <NoticeItem index={index} key={index} data={item}></NoticeItem>
        })}
      </ContentList>
      <FooterBox>
        <div className="current-week">已为您显示近一周的动态信息</div>
        <div className="more-notice" onClick={onHistoryStatics}>
          历史动态<CommonIconFont type="right"></CommonIconFont>
        </div>
      </FooterBox>
    </NoticePopoverWrap>
  )
}
export default NoticePopover
