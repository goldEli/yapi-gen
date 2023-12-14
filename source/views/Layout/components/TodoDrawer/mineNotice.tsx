import { getMsg_list } from '@/services/SiteNotifications'
import NoticeItem from '../NoticePopover/NoticeItem'
import { useEffect, useState } from 'react'

const MineNotice = () => {
  const [data, setData] = useState([])
  const _getMsg_list = async () => {
    const res = await getMsg_list({
      business_type: 1,
      nowWhereReadAll: true,
    })
    setData(res?.list)
    console.log('res---', res)
  }
  useEffect(() => {
    _getMsg_list()
  }, [])
  return (
    <div>
      {data.map((item: any, index: number) => {
        return <NoticeItem index={index} key={index} data={item}></NoticeItem>
      })}
    </div>
  )
}

export default MineNotice
