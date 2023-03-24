/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/indent */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import * as services from '@/services'
import { isArray } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { t } from 'i18next'

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
  width: 100%;
  height: 52px;
  line-height: 52px;
  border-radius: 0px 0px 6px 6px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d2);
  /* margin: 8px 0px; */
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
  padding: 0 24px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
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
    const res = await services.user.getMyRecent()
    setRecentList(res)
  }
  const onGetMineFinishList = async () => {
    const res = await services.mine.getMineFinishList({
      page: 1,
      pagesize: 10,
    })
    setFinishList(res.list)
  }
  const onGetMineNoFinishList = async () => {
    const res = await services.mine.getMineNoFinishList({
      page: 1,
      pagesize: 10,
    })
    setNoFinishList(res.list)
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
  // 接口上下接口不同，取值不同，需要加判断取
  const onRoute = (el: any) => {
    let iterParmas = null
    let router = ''
    if (el?.actionable_type === 'iterate') {
      iterParmas = encryptPhp(
        JSON.stringify({
          type: 'info',
          id: el.project_id,
          iterateId: el.id,
        }),
      )
      router = `/ProjectManagement/Iteration?data=${iterParmas}`
    } else if (el?.feedable_type === 'iterate') {
      iterParmas = encryptPhp(
        JSON.stringify({
          type: 'info',
          id: el?.feedable?.project_id,
          iterateId: el.feedable_id,
        }),
      )
      router = `/ProjectManagement/Iteration?data=${iterParmas}`
    } else if (el?.actionable_type === 'story') {
      iterParmas = encryptPhp(
        JSON.stringify({
          type: 'info',
          id: el.project_id,
          demandId: el.id,
        }),
      )
      router = `/ProjectManagement/Demand?data=${iterParmas}`
    } else if (el?.feedable_type === 'story') {
      iterParmas = encryptPhp(
        JSON.stringify({
          type: 'info',
          id: el?.feedable?.project_id,
          demandId: el.feedable_id,
        }),
      )
      router = `/ProjectManagement/Demand?data=${iterParmas}`
    }
    navigate(router)
  }
  const itmeMain = (item: any) => {
    return (
      isArray(item) &&
      item?.map((el: any) => (
        <ItemBox key={el.title}>
          <Row onClick={() => onRoute(el)}>
            <div>
              {(el?.category_attachment || el?.feedable?.attachment) && (
                <Img
                  src={el?.category_attachment || el?.feedable?.attachment}
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

  const dropdownRender = () => {
    return (
      <Container>
        <HeraderTabs>
          <Tabs>
            {tabs.map((el, index) => (
              <span
                onClick={() => setTabActive(index)}
                key={el.label}
                className={tabActive === index ? 'tabsActive' : 'hoverItem'}
              >
                {el.label}
              </span>
            ))}
          </Tabs>
        </HeraderTabs>
        <ScrollWrap>
          {tabActive === 2 &&
            box.map(el => (
              <div style={{ marginBottom: '16px' }} key={el.title}>
                <Title>{el.title}</Title>
                {itmeMain(recentList?.[el.name])}
              </div>
            ))}
          {tabActive === 0 && itmeMain(noFinishList)}
          {tabActive === 1 && itmeMain(finishList)}
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
