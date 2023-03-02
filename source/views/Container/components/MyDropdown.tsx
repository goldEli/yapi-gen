/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/indent */
import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import * as services from '@/services'
import { isArray } from 'lodash'
import { useNavigate } from 'react-router-dom'

interface PropsType {
  text: string
}
const Container = styled.div`
  width: 320px;
  max-height: calc(100vh - 120px);
  background-color: var(--neutral-white-d6);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 0px 0px 6px 6px;
  padding-bottom: 8px;
`
const HeraderTabs = styled.div`
  width: 100%;
  background-color: var(--neutral-white-d6);
  padding: 16px;
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
    background-color: var(--neutral-white-d6);
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
  height: 56px;
  line-height: 56px;
  border-radius: 0px 0px 6px 6px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d2);
  margin: 8px 16px;
  border-top: 1px solid #ecedef;
  > div {
    padding-left: 24px;
  }
  > div:hover {
    background-color: var(--hover-d2);
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
  height: 56px;
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
const OpenWrap = styled.div`
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Border = styled.div`
  margin: 0 16px;
  text-align: center;
  border-bottom: 1px solid var(--neutral-n6-d1);
`

const Img = styled.img`
  width: 20px;
  height: 20px;
`
const MyDropdown = (props: PropsType) => {
  const navigate = useNavigate()
  const [tabActive, setTabActive] = useState(0)
  const [iconState, setIconState] = useState(false)
  const tabs = [
    {
      label: '待办',
    },
    {
      label: '已办',
    },
    {
      label: '最近',
    },
  ]
  const [itemArr, setItemArr] = useState<any>()
  const [noFinishList, setNoFinishList] = useState<any>()
  const [finishList, setFinishList] = useState<any>()
  const [recentList, setRecentList] = useState<any>()
  const box = [
    {
      title: '最近查看',
      name: 'recent_see',
    },
    {
      title: '最近创建',
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
    onFetchList()
  }, [tabActive])
  const onClick = () => {
    navigate('/Mine')
  }
  const itmeMain = (item: any) => {
    return (
      isArray(item) &&
      item?.map((el: any) => (
        <ItemBox key={el.title}>
          <Row>
            <div>
              {/* <IconFont
                type="calendar"
                style={{ fontSize: 20, color: '#323233' }}
              /> */}
              <Img src={el.category_attachment} />
            </div>
            <ItemCenter>
              <ItemTitle>{el.feedable?.name || el.name}</ItemTitle>
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
          {/* 
          {tabActive === 2 && (
            <>
              <OpenWrap>
                <IconFont
                  type={iconState ? 'down' : 'up'}
                  style={{
                    fontSize: 16,
                    color: 'var(--neutral-n2)',
                    marginBottom: '7px',
                  }}
                  onClick={() => setIconState(!iconState)}
                />
              </OpenWrap>
              <Border />
            </>
          )} */}
        </ScrollWrap>
        <Footer onClick={onClick}>
          <div>查看我的工作</div>
        </Footer>
      </Container>
    )
  }
  return (
    <Dropdown dropdownRender={dropdownRender} placement="bottomLeft">
      <div style={{ height: '52px', lineHeight: '52px' }}>
        <span style={{ marginRight: '8px' }}>{props.text}</span>
        <CommonIconFont type="down" size={14} />
      </div>
    </Dropdown>
  )
}

export default MyDropdown
