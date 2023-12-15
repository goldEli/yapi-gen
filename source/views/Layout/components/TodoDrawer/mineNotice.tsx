import { getMsg_list, setReadApi } from '@/services/SiteNotifications'
import NoticeItem from '../NoticePopover/NoticeItem'
import { useEffect, useState } from 'react'
import { setIsNewMsg } from '@store/mine'
import { useDispatch, useSelector } from '@store/index'
import NoData from '@/components/NoData'
const MineNotice = () => {
  const [data, setData] = useState<any[]>([])
  const dispatch = useDispatch()
  const { isNewMsg, msgStatics } = useSelector(store => store.mine)
  const { todoStatistics } = msgStatics
  const _getMsg_list = async () => {
    const res = await getMsg_list({
      business_type: 2,
      nowWhereReadAll: true,
    })
    const data = res?.list
    // 只有未读消息才走这个逻辑
    if (res?.nowWhereReadAllNum) {
      setTimeout(() => {
        for (const iterator of data) {
          if (parseInt(iterator.read, 10) === 0) {
            iterator.read = 1
            // 更新统计
            dispatch(setIsNewMsg(isNewMsg + 1))
          }
        }
        setData([...data])
      }, 6000)
    }
    setData(data)
  }
  // 消息推送更新
  useEffect(() => {
    _getMsg_list()
  }, [todoStatistics?.total])
  const setRead = async (index: number, msgIds: string) => {
    const res = await setReadApi({ read: 2, msgIds: [msgIds] })
    if (res.code === 0) {
      data[index].read = 2
      setTimeout(() => {
        setData([...data])
      })
    }
  }
  const onReadClick = (index: number, msgIds: string) => {
    setRead(index, msgIds)
  }
  return (
    <div>
      {data.length ? (
        data.map((item: any, index: number) => {
          return (
            <NoticeItem
              index={index}
              key={index}
              data={item}
              onReadClick={onReadClick}
            ></NoticeItem>
          )
        })
      ) : (
        <NoData></NoData>
      )}
    </div>
  )
}

export default MineNotice
