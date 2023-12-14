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
import AssignTask from './Project'
import ReviewTask from './Task'
import MineNotice from './Report'
import classNames from 'classnames'
import { getNotReadMsgStatics } from '@/services/mine'
import { useSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'
interface IProps {}

const RecomendDrawer = (props: any) => {
  const { open = false, onCancel } = props
  const [active, setActive] = useState(1)
  const tabs = [
    { name: '日报', value: 1, fields: 'at' },
    { name: '项目', value: 2, fields: 'handle' },
    { name: '任务', value: 3, fields: 'verify' },
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
        if (active === 1) {
          navigate('Mine/Carbon')
          return
        }
        navigate('Project')
      }}
    >
      {active === 1 ? '查看所有日报' : '查看所有项目'}
      <CommonIconFont type="right"></CommonIconFont>
    </DrawerFooter>
  )
  return (
    <div>
      <Drawer
        title={null}
        width={480}
        open={open}
        closable={false}
        maskStyle={{ background: 'transparent' }}
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
                    {item.name}
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
export default RecomendDrawer
