/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/indent */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Dropdown, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import * as services from '@/services'
import { isArray } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { t } from 'i18next'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import {
  ActiveTab,
  TabsWrap,
  TabsWrapItem,
} from '@/views/SiteNotifications/components/SiteDrawer/style'
import { useSelector } from '@store/index'

const Container = styled.div`
  width: 320px;
  max-height: calc(100vh - 120px);
  background-color: var(--neutral-white-d5);
  box-shadow: 0px 7px 13px 0px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
`
const HeraderTabs = styled.div`
  width: 100%;
  background-color: var(--neutral-white-d5);
  padding: 16px;
  border-radius: 6px 6px 0 0;
`
const Tabs = styled.div`
  width: 100%;
  height: 32px;
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  background-color: var(--hover-d2);
  padding: 2px;
  color: var(--neutral-n2);
  font-size: 12px;
  font-weight: 400;
  .tabsActive {
    background-color: var(--neutral-white-d5);
    color: var(--primary-d2);
  }
  span {
    display: inline-block;
    width: 72px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    border-radius: 4px;
  }
  .hoverItem:hover {
    color: var(--primary-d2);
    cursor: pointer;
  }
`
const ScrollWrap = styled.div`
  height: calc(100vh - 256px);
  overflow-y: auto;
`
const Footer = styled.div`
  div:nth-child(1) {
    height: 52px;
    width: 100%;
    line-height: 52px;
    border-radius: 0px 0px 6px 6px;
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral-n1-d2);
  }
  padding-bottom: 8px;
  > div {
    padding-left: 24px;
  }
  > div:hover {
    background-color: var(--hover-d3);
    cursor: pointer;
  }
`
const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const Title = styled.div`
  font-size: 12px;
  font-weight: 400;
  padding-left: 24px;
  color: var(--neutral-n3);
`
const Row = styled.div`
  width: 100%;
  padding: 0 16px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
    background-color: var(--hover-d3);
  }
`
const ItemCenter = styled.div`
  width: 166px;
  overflow: hidden;
  margin-left: 8px;
`
const ItemTitle = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
`
const ItemMsg = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n3);
`
const BtnBox = styled.div`
  width: 52px;
  height: 22px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 22px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
`

const Border = styled.div`
  margin: 0 16px;
  text-align: center;
  border-bottom: 1px solid var(--neutral-n6-d2);
`

const Img = styled.img`
  width: 20px;
  height: 20px;
`
const MyDropdown = (props: any) => {
  const navigate = useNavigate()
  const [tabActive, setTabActive] = useState(0)
  const tabs = [
    {
      label: t('mine.needDeal'),
    },
    {
      label: t('have_done'),
    },
    {
      label: t('recently'),
    },
  ]
  const [noFinishList, setNoFinishList] = useState<any>()
  const [finishList, setFinishList] = useState<any>()
  const [recentList, setRecentList] = useState<any>()
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const box = [
    {
      title: t('last_viewed'),
      name: 'recent_see',
    },
    {
      title: t('recently_created'),
      name: 'recent_create',
    },
  ]
  const onGetMyRecent = async () => {
    setIsSpinning(true)
    const res = await services.user.getMyRecent()
    setRecentList(res)
    setIsSpinning(false)
  }
  const onGetMineFinishList = async () => {
    setIsSpinning(true)
    const res = await services.mine.getMineFinishList({
      page: 1,
      pagesize: 10,
    })
    setFinishList(res.list)
    setIsSpinning(false)
  }
  const onGetMineNoFinishList = async () => {
    setIsSpinning(true)
    const res = await services.mine.getMineNoFinishList({
      page: 1,
      pagesize: 10,
    })
    setNoFinishList(res.list)
    setIsSpinning(false)
  }
  const onFetchList = async () => {
    if (tabActive === 2) {
      onGetMyRecent()
    }
    if (tabActive === 1) {
      onGetMineFinishList()
    }
    if (tabActive === 0) {
      onGetMineNoFinishList()
    }
  }

  useEffect(() => {
    isOpen && onFetchList()
  }, [isOpen, tabActive])

  const onClickIsOpen = () => {
    setIsOpen(false)
  }
  const onClick = () => {
    onClickIsOpen()
    navigate('/ProjectManagement/Mine/Profile')
  }
  /**
   *
   * @param el
   * @param type story 待办和已办
   * @param feedable_type project -项目  iterate-冲刺、迭代   story-需求、事务（缺陷
   *  // 1：迭代-需求类型，2：迭代-缺陷类型，3：冲刺-长故事事务类型，4：冲刺-标准事务类型，5：冲刺-故障事务类型，6：冲刺-子任务类型
   */
  // 接口上下接口不同，取值不同，需要加判断取
  /**
   *
   * @param el
   * @param type
   */
  const onRoute = (el: any, type: string) => {
    let resultType: any = el?.feedable_type
    let project_type: any = el?.feedable?.project?.project_type
    let isDefect: any = el?.feedable?.is_bug
    // 迭代详情 需求详情  事务详情  缺陷详情
    // const url = {
    //   iterate: '/ProjectManagement/IterationDetail',
    //   story: '/ProjectManagement/Demand',
    //   Affair: '/SprintProjectManagement/Affair',
    //   Defect: '/ProjectManagement/Defect',
    // }
    let url = null
    let params: any = {
      id: project_type ? el?.feedable?.project_id : el.project_id,
      detailId: project_type ? el?.feedable?.id : el.id,
      iterateId: project_type ? el?.feedable?.id : el.id,
    }
    // 从待办和已办入口
    if (!project_type) {
      project_type = el.project_type
    }
    if (!resultType) {
      if (el.work_type === 1) {
        resultType = 'Demand'
      }
      if (el.work_type === 2 && el.is_bug === 1) {
        resultType = 'Defect'
      }
    }
    if (project_type === 2) {
      url = `/SprintProjectManagement/Affair`
      params = { ...params, specialType: 1, isOpenScreenDetail: true }
    }

    if (project_type === 1) {
      if (
        (resultType === 'story' && isDefect === 2) ||
        resultType === 'project'
      ) {
        url = '/ProjectManagement/Demand'
        params = { ...params, specialType: 3, isOpenScreenDetail: true }
      }
      // TODO 还差一种情况 从最近的入口无法判断是缺陷还是需求
      if (resultType === 'iterate') {
        url = `/ProjectManagement/IterationDetail`
      }
      if (
        resultType === 'Defect' ||
        (resultType === 'story' && isDefect === 1)
      ) {
        url = '/ProjectManagement/Defect'
        params = { ...params, specialType: 2, isOpenScreenDetail: true }
      }
      if (resultType === 'Demand') {
        url = '/ProjectManagement/Demand'
        params = { ...params, specialType: 3, isOpenScreenDetail: true }
      }
    }
    // return
    navigate(`${url}?data=${encryptPhp(JSON.stringify(params))}`)
    setIsOpen(false)
    let iterParmas = null
    return
    const paramsKey: { [key: string]: string } = {
      1: 'demandId',
      2: 'sprintId',
    }
    const urlMaps: { [key: number]: string } = {
      1: '/ProjectManagement/DemandDetail',
      2: '/SprintProjectManagement/SprintProjectDetail',
    }
    let router = ''

    if (type === 'story') {
      iterParmas = encryptPhp(
        JSON.stringify({
          id: el.project_id,
          [paramsKey[el.project_type]]: el.id,
        }),
      )
      router = `${urlMaps[el.project_type]}?data=${iterParmas}`
    } else {
      const resultType = el?.feedable_type ?? el?.actionable_type
      if (resultType === 'project') {
        iterParmas = encryptPhp(
          JSON.stringify({
            id: el.feedable_id,
          }),
        )
        const url =
          el.feedable.project_type === 2
            ? '/SprintProjectManagement/Affair'
            : '/ProjectManagement/Demand'
        router = `${url}?data=${iterParmas}`
      } else {
        const params: any = {
          id: el?.feedable?.project_id ?? el.project_id,
        }
        if (resultType === 'iterate') {
          params.iterateId = el?.feedable_id ?? el.id
        }
        if (resultType === 'story') {
          params[paramsKey[el.feedable.project.project_type]] =
            el?.feedable_id ?? el.id
        }
        iterParmas = encryptPhp(JSON.stringify(params))
        if (el.feedable.project.project_type === 1) {
          router = `/ProjectManagement/${
            resultType === 'iterate' ? 'Iteration' : 'DemandDetail'
          }?data=${iterParmas}`
        }
        if (el.feedable.project.project_type === 2) {
          router = `/SprintProjectManagement/${
            resultType === 'iterate' ? 'Affair' : 'SprintProjectDetail'
          }?data=${iterParmas}`
        }
      }
    }
    setIsOpen(false)
    navigate(router)
  }
  const itmeMain = (item: any, type: any) => {
    return (
      isArray(item) &&
      item?.map((el: any) => (
        <ItemBox key={el.id}>
          <Row onClick={() => onRoute(el, type)}>
            9999
            <div>
              {(el?.category_attachment || el?.feedable?.attachment) && (
                <Img
                  src={el?.category_attachment || el?.feedable?.attachment}
                />
              )}
              {!(el?.category_attachment || el?.feedable?.attachment) && (
                <CommonIconFont
                  type="interation-2"
                  color="var(--neutral-n2)"
                  size={20}
                />
              )}
            </div>
            <ItemCenter>
              <ItemTitle>{el.feedable?.name || el?.name}</ItemTitle>
              <ItemMsg>
                {el.feedable?.project?.name || el.project?.name}
              </ItemMsg>
            </ItemCenter>
            <BtnBox
              style={{
                background:
                  el.status?.is_start === 1 && el.status?.is_end === 2
                    ? 'var(--primary-d2)'
                    : el.status?.is_end === 1 && el.status?.is_start === 2
                    ? 'var(--neutral-n7)'
                    : el.status?.is_start === 2 && el.status?.is_end === 2
                    ? 'var(--function-success)'
                    : '',
                color:
                  el.status?.is_start === 1 && el.status?.is_end === 2
                    ? 'var(--neutral-n7)'
                    : el.status?.is_end === 1 && el.status?.is_start === 2
                    ? 'var(--neutral-n1-d1)'
                    : el.status?.is_start === 2 && el.status?.is_end === 2
                    ? 'var(--neutral-n7)'
                    : '',
              }}
            >
              {el.status?.status?.content}
            </BtnBox>
          </Row>
        </ItemBox>
      ))
    )
  }
  const tabBox = useRef<HTMLDivElement>(null)
  const { isRefresh } = useSelector(store => store.user)
  const tabActive2 = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen) {
      return
    }
    for (let i = 0; i < 3; i++) {
      tabBox.current?.children[i].addEventListener('click', e => {
        if (tabActive2.current) {
          tabActive2.current.style.left = `${
            (tabBox.current?.children[i] as HTMLDivElement).offsetLeft
          }px`
          tabActive2.current.style.width = `${tabBox.current?.children[i].clientWidth}px`
        }
      })
    }
  }, [isOpen])
  useEffect(() => {
    if (!isOpen) {
      return
    }
    const index = tabs.findIndex((i: any, index) => index === tabActive)
    tabActive2.current!.style.left = `${
      (tabBox.current?.children[index] as HTMLDivElement).offsetLeft === 0
        ? 2
        : (tabBox.current?.children[index] as HTMLDivElement).offsetLeft
    }px`

    tabActive2.current!.style.width = `${
      tabBox.current?.children[index].clientWidth === 0
        ? 60
        : tabBox.current?.children[index].clientWidth
    }px`
  }, [tabActive, isRefresh, isOpen])
  const dropdownRender = () => {
    return (
      <Container>
        <HeraderTabs>
          <TabsWrap style={{ width: '288px' }} ref={tabBox}>
            {tabs.map((i: any, index) => (
              <TabsWrapItem
                onClick={() => setTabActive(index)}
                active={tabActive === index}
                key={i.label}
              >
                {i.label}
              </TabsWrapItem>
            ))}
            <ActiveTab ref={tabActive2} />
          </TabsWrap>
        </HeraderTabs>
        <ScrollWrap>
          <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
            {tabActive === 2 &&
              box.map(el => (
                <div style={{ marginBottom: '16px' }} key={el.title}>
                  <Title>{el.title}</Title>
                  {itmeMain(recentList?.[el.name], el.name)}
                </div>
              ))}
            {tabActive === 0 && itmeMain(noFinishList, 'story')}
            {tabActive === 1 && itmeMain(finishList, 'story')}
          </Spin>
        </ScrollWrap>
        <Border />
        <Footer onClick={onClick}>
          <div>{t('Check_out_my_work') as string}</div>
        </Footer>
      </Container>
    )
  }

  return (
    <Dropdown
      dropdownRender={dropdownRender}
      placement="bottomLeft"
      trigger={['click']}
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <div style={{ height: '52px', lineHeight: '52px' }}>
        <span
          style={{
            marginRight: '8px',
            color: isOpen ? 'var(--primary-d2)' : '',
          }}
        >
          {props.text}
        </span>
        <CommonIconFont
          type="down"
          size={14}
          color={isOpen ? 'var(--primary-d2)' : ''}
        />
      </div>
    </Dropdown>
  )
}

export default MyDropdown
