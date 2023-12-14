import { Button, Drawer, Space } from 'antd'
import {
  ContentWrap,
  DrawerFooter,
  TabsBox,
  TabsWrap,
  TitleWrap,
  cusDrawer,
} from './style'
import CommonIconFont from '@/components/CommonIconFont'
import NoticeItem from '../NoticePopover/NoticeItem'
import { useEffect, useState } from 'react'
import AssignTask from './assignTask'
import ReviewTask from './reviewTask'
import MineNotice from './mineNotice'
import classNames from 'classnames'
import { getNotReadMsgStatics } from '@/services/mine'
import { useSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'
interface IProps {}

const TodoDrawer = (props: any) => {
  const { open = false, onCancel } = props
  const [active, setActive] = useState(1)
  const tabs = [
    { name: '@我的', value: 1, fields: 'at' },
    { name: '指派我的任务', value: 2, fields: 'handle' },
    { name: '待我审核任务', value: 3, fields: 'verify' },
  ]
  const content: any = {
    1: <MineNotice></MineNotice>,
    2: <AssignTask></AssignTask>,
    3: <ReviewTask></ReviewTask>,
  }
  const { msgStatics } = useSelector(store => store.mine)
  const { todoStatistics } = msgStatics ?? {}
  const { list } = todoStatistics ?? {}
  const navigate = useNavigate()
  const footer = (
    <DrawerFooter
      onClick={() => {
        if (active === 2) {
          navigate('Mine/Carbon')
        }
        if (active === 3) {
          navigate('Mine/Examine')
        }
      }}
    >
      查看我的工作<CommonIconFont type="right"></CommonIconFont>
    </DrawerFooter>
  )
  return (
    <div>
      <Drawer
        title={null}
        width={600}
        open={open}
        closable={false}
        mask={false}
        zIndex={196}
        drawerStyle={{ paddingTop: '56px' }}
        className={cusDrawer}
        footer={footer}
      >
        <TitleWrap>
          <TabsWrap>
            <TabsBox>
              {tabs.map(item => {
                return (
                  <div
                    key={item.value}
                    className={classNames('item', {
                      activity: active === item.value,
                    })}
                    onClick={() => setActive(item.value)}
                  >
                    {item.name}（{list && list[item.fields]}）
                  </div>
                )
              })}
            </TabsBox>
          </TabsWrap>
          <CommonIconFont type="close" onClick={onCancel}></CommonIconFont>
        </TitleWrap>
        <ContentWrap>{content[active]}</ContentWrap>
      </Drawer>
    </div>
  )
}
export default TodoDrawer
