import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import { useState } from 'react'

interface PropsType {
  text: string
}
const Container = styled.div`
  width: 320px;
  height: auto;
  background-color: var(--neutral-white-d6);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 0px 0px 6px 6px;
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
const ScrollWrap = styled.div``
const Footer = styled.div`
  height: 56px;
  line-height: 56px;
  padding-left: 24px;
  border-radius: 0px 0px 6px 6px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d2);
  margin: 8px 0;
  &:hover {
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
const MyDropdown = (props: PropsType) => {
  const [tabActive, setTabActive] = useState(1)
  const [iconState, setIconState] = useState(true)
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
  const itemArr = [
    {
      title: '需求名称',
      label: 'DXKJ-0001/项目名称',
    },
    {
      title: '需求名称需求名称需求名...',
      label: 'DXKJ-0001/项目名称',
    },
    {
      title: '需求名称需求名称需求名...',
      label: 'DXKJ-0001/项目名称',
    },
  ]
  const box = [
    {
      title: '最近联系',
      itemArr,
    },
    {
      title: '最近查看',
      itemArr,
    },
  ]
  const itmeMain = (item: any) => {
    return item.map((el: any) => (
      <ItemBox key={el.title}>
        <Row>
          <div>
            <IconFont
              type="calendar"
              style={{ fontSize: 20, color: '#323233' }}
            />
          </div>
          <ItemCenter>
            <ItemTitle>{el.title}</ItemTitle>
            <ItemMsg>{el.label}</ItemMsg>
          </ItemCenter>
          <>
            <BtnBox
              style={{
                background:
                  tabActive === 0
                    ? 'var(--function-success)'
                    : 'var(--neutral-n7)',
                color:
                  tabActive === 0
                    ? 'var(--neutral-white-d1)'
                    : 'var(--neutral-n1-d1)',
              }}
            >
              进行中
            </BtnBox>
          </>
        </Row>
      </ItemBox>
    ))
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
          {tabActive === 0
            ? box.map(el => (
                <div style={{ marginBottom: '16px' }} key={el.title}>
                  <Title>{el.title}</Title>
                  {itmeMain(el.itemArr)}
                </div>
              ))
            : itmeMain(itemArr)}
          {tabActive === 0 && (
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
          )}
        </ScrollWrap>
        <Footer>查看我的工作</Footer>
      </Container>
    )
  }
  return (
    <>
      <Dropdown dropdownRender={dropdownRender} placement="bottomLeft">
        <div style={{ height: '52px', lineHeight: '52px' }}>
          <span style={{ marginRight: '8px' }}>{props.text}</span>
          <CommonIconFont type="down" size={14} />
        </div>
      </Dropdown>
    </>
  )
}
export default MyDropdown
