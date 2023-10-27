/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/indent */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Dropdown, Skeleton, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import * as services from '@/services'
import { isArray } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { useDispatch, useSelector } from '@store/index'
import { setDemandInfo } from '@store/demand'
import { setFlawInfo } from '@store/flaw'
import { setAffairsInfo } from '@store/affairs'
import { getVerifyUserList } from '@/services/mine'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import EditExamine from '@/components/EditExamine'
import NoData from '@/components/NoData'
import {
  ActiveTab,
  TabsWrap,
  TabsWrapItem,
} from '@/views/Layout/Trends/components/SiteDrawer/style'

const Container = styled.div<{ local?: string }>`
  width: ${props => (props.local === 'zh' ? '320px' : '400px')};
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
const ScrollWrap = styled.div`
  height: calc(100vh - 350px);
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
  /* margin-left: 8px; */
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

const CanClick = styled.div({
  height: 24,
  borderRadius: 6,
  padding: '0 8px',
  cursor: 'pointer',
  color: 'white',
  fontSize: 12,
  background: 'var(--primary-d2)',
  lineHeight: '24px',
  width: 'fit-content',
})

// 待审核样式
const VerifyItem = styled.div`
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    width: 78%;
    cursor: pointer;
    .img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .name {
      display: flex;
      flex-direction: column;
      width: 70%;
      span {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .title {
        font-size: 14px;
        color: var(--neutral-n1-d1);
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
      }
    }
  }
  &:hover {
    background: var(--hover-d3);
  }
`

const MyDropdown = (props: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [tabActive, setTabActive] = useState(0)
  const tabs = [
    {
      label: t('mine.needDeal'),
    },
    {
      label: t('pendingReview'),
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
  // 审核数据
  const [verifyList, setVerifyList] = useState<any>({
    list: [],
    total: 0,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const tabBox = useRef<HTMLDivElement>(null)
  const { isRefresh, userInfo } = useSelector(store => store.user)
  const { language } = useSelector(store => store.global)
  const tabActive2 = useRef<HTMLDivElement>(null)
  // 审核列表-分页
  const [verifyPage, setVerifyPage] = useState(1)
  // 审核数据
  const [verifyInfo, setVerifyInfo] = useState({})
  const [isVisible, setIsVisible] = useState(false)

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
  // 最近
  const onGetMyRecent = async () => {
    setIsSpinning(true)
    const res = await services.user.getMyRecent()
    setRecentList(res)
    setIsSpinning(false)
  }
  // 已办
  const onGetMineFinishList = async () => {
    setIsSpinning(true)
    const res = await services.mine.getMineFinishList({
      page: 1,
      pagesize: 10,
    })
    setFinishList(res.list)
    setIsSpinning(false)
  }
  // 待办
  const onGetMineNoFinishList = async () => {
    setIsSpinning(true)
    const res = await services.mine.getMineNoFinishList({
      page: 1,
      pagesize: 10,
    })
    setNoFinishList(res.list)
    setIsSpinning(false)
  }

  // 获取待审核的列表
  const getVerifyList = async () => {
    setIsSpinning(true)
    const params = {
      userId: userInfo?.id,
      projectId: 0,
      verifyStatus: 1,
      page: verifyPage,
      pageSize: 12,
    }
    const result = await getVerifyUserList(params)
    setIsSpinning(false)
    setVerifyList({
      list: result.list || [],
      total: result.total || 0,
    })
  }

  const onFetchList = async () => {
    setVerifyPage(1)
    setVerifyList({})
    switch (tabActive) {
      case 3:
        onGetMyRecent()
        break
      case 2:
        onGetMineFinishList()
        break
      case 1:
        // 待审核
        getVerifyList()
        break

      default:
        onGetMineNoFinishList()
        break
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
    dispatch(setDemandInfo({}))
    dispatch(setFlawInfo({}))
    dispatch(setAffairsInfo({}))
    navigate(`${url}?data=${encryptPhp(JSON.stringify(params))}`)
    setIsOpen(false)
  }

  const itmeMain = (item: any, type: any) => {
    return (
      isArray(item) &&
      item
        .filter(i => i.is_member)
        ?.map((el: any) => (
          <ItemBox key={el.id}>
            <Row onClick={() => onRoute(el, type)}>
              <div style={{ display: 'flex', gap: '12px' }}>
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
              </div>

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

  // 待审核-点击跳转详情
  const onClickItem = async (item: any) => {
    let url = null
    let params: any = {
      id: item.project_id ?? item.projectId,
      detailId: item.demandId,
      isOpenScreenDetail: true,
    }
    if (item.project_type === 2) {
      url = '/SprintProjectManagement/Affair'
      params.specialType = 1
    }
    if (item.project_type === 1 && item.is_bug === 2) {
      url = '/ProjectManagement/Defect'
      params.specialType = 2
    }
    if (item.project_type === 1 && item.is_bug === 1) {
      url = '/ProjectManagement/Demand'
      params.specialType = 3
    }
    dispatch(setDemandInfo({}))
    dispatch(setFlawInfo({}))
    dispatch(setAffairsInfo({}))
    navigate(`${url}?data=${encryptPhp(JSON.stringify(params))}`)
    setIsOpen(false)
    setVerifyList({})
    setVerifyPage(1)
  }
  useEffect(() => {
    if (isOpen) {
      setTabActive(0)
    }
    setTimeout(() => {
      if (tabActive2.current && isOpen) {
        tabActive2.current.style.left = `${
          (tabBox.current?.children[0] as HTMLDivElement).offsetLeft
        }px`
        tabActive2.current.style.width = `${tabBox.current?.children[0].clientWidth}px`
      }
    }, 500)
  }, [isOpen, isRefresh])
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
  }, [])

  useEffect(() => {
    if (!tabBox.current) {
      return
    }
    const index = tabs.findIndex((i: any, index2) => index2 === tabActive)

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
  }, [tabActive, isRefresh])

  // 除待审核的，下拉渲染
  const dropdownRender = () => {
    return (
      <Container local={language}>
        {isVisible && (
          <EditExamine
            isVisible={isVisible}
            onClose={() => {
              setIsVisible(false)
              setVerifyInfo({})
            }}
            item={verifyInfo}
            isEdit={true}
            onUpdate={getVerifyList}
          />
        )}
        <HeraderTabs>
          <TabsWrap
            style={{ width: '100%', justifyContent: 'space-around' }}
            ref={tabBox}
          >
            {tabs.map((i: any, index) => (
              <TabsWrapItem
                onClick={() => setTabActive(index)}
                active={tabActive === index}
                key={i.label}
              >
                {i.label}
              </TabsWrapItem>
            ))}
            <ActiveTab style={{ width: '60px' }} ref={tabActive2} />
          </TabsWrap>
        </HeraderTabs>
        {tabActive === 1 && (
          <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
            <InfiniteScroll
              dataLength={verifyList?.list?.length || 0}
              next={fetchMoreData}
              hasMore={
                (verifyList?.list?.length || 0) < (verifyList?.total || 0)
              }
              loader={null}
              scrollableTarget="scrollableDiv"
              style={{
                overflow: 'auto',
                height: 'calc(100vh - 350px)',
              }}
              height="calc(100vh - 350px)"
            >
              {verifyList?.list?.length > 0 && (
                <>
                  {verifyList?.list?.map((i: any) => (
                    <VerifyItem key={i.id}>
                      <div className="left" onClick={() => onClickItem(i)}>
                        <img className="img" src={i.category_attachment} />
                        <div className="name">
                          <span className="title">{i.demandName}</span>
                          <span className="sub">
                            {i.storyPrefixKey}/{i.project_name}
                          </span>
                        </div>
                      </div>
                      <CanClick onClick={() => onOpenExamine(i)}>
                        {t('newlyAdd.waitExamine')}
                      </CanClick>
                    </VerifyItem>
                  ))}
                </>
              )}
              {verifyList?.list?.length <= 0 && <NoData />}
            </InfiniteScroll>
          </Spin>
        )}
        {tabActive !== 1 && (
          <ScrollWrap>
            <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
              {tabActive === 3 &&
                box.map(el => (
                  <div key={el.title}>
                    {recentList?.[el.name].length >= 1 && (
                      <Title>{el.title}</Title>
                    )}
                    <div
                      style={{
                        marginTop:
                          recentList?.[el.name].length >= 1 ? '16px' : '0px',
                      }}
                    >
                      {' '}
                      {itmeMain(recentList?.[el.name], el.name)}
                    </div>
                  </div>
                ))}
              {tabActive === 0 && itmeMain(noFinishList, 'story')}
              {tabActive === 2 && itmeMain(finishList, 'story')}
            </Spin>
          </ScrollWrap>
        )}
        <Border />
        <Footer onClick={onClick}>
          <div>{t('Check_out_my_work') as string}</div>
        </Footer>
      </Container>
    )
  }

  // 待审核数据加载更多
  const fetchMoreData = async () => {
    const page = verifyPage + 1
    setVerifyPage(page)
    const params = {
      userId: userInfo?.id,
      projectId: 0,
      verifyStatus: 1,
      page: page,
      pageSize: 12,
    }
    const result = await getVerifyUserList(params)
    setVerifyList({
      list: [...verifyList?.list, ...result.list],
      total: result.total || 0,
    })
  }

  // 点击打开审核弹窗
  const onOpenExamine = (item: any) => {
    setIsOpen(false)
    setVerifyInfo(item)
    setIsVisible(true)
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
