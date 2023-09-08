import { useDispatch, useSelector } from '@store/index'
import { Drawer, Spin } from 'antd'
import { DragLine, MouseDom } from '../StyleCommon'
import { useEffect, useState } from 'react'
import { setContrastDrawer } from '@store/employeeProfile'
import {
  BackIcon,
  Box,
  Content,
  Header,
  ItemBox,
  ItemGroup,
  Line,
  TimeWrap,
  TitleWrap,
  Wrap,
} from './style'
import CommonIconFont from '../CommonIconFont'
import CommonUserAvatar from '../CommonUserAvatar'
import { getMemberOverviewCompare } from '@/services/employeeProfile'
import NewLoadingTransition from '../NewLoadingTransition'

const EmployeeProfileContrast = () => {
  const dispatch = useDispatch()
  const { contrastDrawer, filterParams } = useSelector(
    store => store.employeeProfile,
  )
  const { visible, params } = contrastDrawer
  const [focus, setFocus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<any>({})
  const leftWidth = 960

  const onDragLine = (e: React.MouseEvent) => {
    const drawer: HTMLElement = document.querySelector(
      '.drawerRoot .ant-drawer-content-wrapper',
    )!
    const drawerBody: HTMLElement = document.querySelector(
      '.drawerRoot .ant-drawer-body',
    )!
    const moveHandler = (ev: React.MouseEvent) => {
      setFocus(true)
      drawerBody.style.minWidth = '100%'
      drawerBody.style.right = '0px'
      const nextWidth = innerWidth - ev.clientX
      if (nextWidth <= leftWidth) return
      drawer!.style.width = innerWidth - ev.clientX + 'px'
    }
    drawer.style.transition = '0s'
    // const debounceWrap: any = throttle(moveHandler, 60, {})
    const debounceWrap: any = moveHandler
    document.addEventListener('mousemove', debounceWrap)
    document.addEventListener('mouseup', () => {
      drawer.style.transition = 'all 0.3s'
      setFocus(false)
      document.removeEventListener('mousemove', debounceWrap)
    })
  }

  // 关闭弹窗
  const onCancel = () => {
    dispatch(
      setContrastDrawer({
        visible: false,
        params: {},
      }),
    )
  }

  // 跳转汇报
  const onToReport = () => {
    window.open(
      `${window.origin}${import.meta.env.__URL_HASH__}Report/Review/List/1`,
    )
  }

  // 跳转效能洞察
  const onToPerformance = () => {}

  // 跳转效能洞察-明细
  const onToPerformanceDetail = () => {}

  // 获取对比数据
  const getContrast = async () => {
    setLoading(true)
    setDataSource({})
    const response = await getMemberOverviewCompare(filterParams)
    setDataSource(response)
    setLoading(false)
  }

  useEffect(() => {
    if (visible) {
      getContrast()
    }
  }, [visible])

  return (
    <Drawer
      closable={false}
      placement="right"
      bodyStyle={{ padding: 0, position: 'relative' }}
      width={leftWidth}
      open={visible}
      onClose={onCancel}
      destroyOnClose
      getContainer={false}
      className="drawerRoot"
    >
      <MouseDom active={focus} onMouseDown={onDragLine} style={{ left: 0 }}>
        <DragLine active={focus} className="line" style={{ marginLeft: 0 }} />
      </MouseDom>
      <Header>
        <BackIcon onClick={onCancel}>
          <CommonIconFont type="right-02" size={20} color="var(--neutral-n2)" />
        </BackIcon>
      </Header>
      <Content>
        <TimeWrap>
          工作对比报告 {filterParams?.time?.[0]} - {filterParams?.time?.[1]}
        </TimeWrap>
        <Box>
          <Spin
            spinning={loading}
            indicator={<NewLoadingTransition />}
            size="large"
          >
            <Wrap>
              <TitleWrap className="work">
                <div className="label">
                  工作完成率（{dataSource?.story?.average_completed_rate}%）
                </div>
                <div className="sub" onClick={onToPerformance}>
                  <span className="text">明细</span>
                  <CommonIconFont type="right" size={12} />
                </div>
              </TitleWrap>
              <ItemGroup>
                {dataSource?.story?.list?.map((i: any) => (
                  <ItemBox key={i.id} isWork>
                    <div className="avatar">
                      <CommonUserAvatar avatar={i.avatar} size="large" />
                    </div>
                    <div className="right">
                      <div className="name">
                        {i.name}（{i.position.name ?? '--'}）
                        <div className="progress">
                          {i.statistics.completed_rate}%
                        </div>
                      </div>
                      <div className="position">
                        {i.departments?.map((i: any) => i.name)?.join(' - ')}
                      </div>
                      <div className="totalBox">
                        <div className="total">
                          任务总数 {i.statistics.completed}/{i.statistics.total}
                        </div>
                        <div className="sub" onClick={onToPerformanceDetail}>
                          逾期完成 {i.statistics.overdue_completed}次
                        </div>
                      </div>
                    </div>
                  </ItemBox>
                ))}
              </ItemGroup>
            </Wrap>
            <Line />
            <Wrap>
              <TitleWrap className="report">
                <div className="label">日报人次</div>
                <div className="sub" onClick={onToReport}>
                  <span className="text">明细</span>
                  <CommonIconFont type="right" size={12} />
                </div>
              </TitleWrap>
              <ItemGroup>
                {dataSource?.report?.list?.map((i: any) => (
                  <ItemBox key={i.id}>
                    <div className="avatar">
                      <CommonUserAvatar avatar={i.avatar} size="large" />
                    </div>
                    <div className="right">
                      <div className="name">
                        {i.name}（{i.position.name ?? '--'}）
                      </div>
                      <div className="position">
                        {i.departments?.map((i: any) => i.name)?.join(' - ')}
                      </div>
                      <div className="totalBox">
                        <div className="total">
                          提交次数 {i.statistics.completed}/{i.statistics.total}
                        </div>
                      </div>
                    </div>
                  </ItemBox>
                ))}
              </ItemGroup>
            </Wrap>
          </Spin>
        </Box>
      </Content>
    </Drawer>
  )
}

export default EmployeeProfileContrast
