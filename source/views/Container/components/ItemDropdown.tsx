import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'

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
const ScrollWrap = styled.div``
const Footer = styled.div`
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
  & div {
    display: flex;
    align-items: center;
    height: 56px;
  }
`
const Title = styled.div`
  font-size: 12px;
  font-weight: 400;
  height: 36px;
  line-height: 36px;
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
    cursor: pointer;
    background-color: var(--hover-d3);
  }
`
const ItemTitle = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  margin-left: 12px;
  color: var(--neutral-n1-d1);
`
const Border = styled.div`
  margin: 0 16px;
  text-align: center;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
const ItemDropdown = (props: PropsType) => {
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
  const itmeMain = (item: any) => {
    return item.map((el: any) => (
      <Row key={el.title}>
        <IconFont type="calendar" style={{ fontSize: 32, color: '#323233' }} />
        <ItemTitle>{el.title}</ItemTitle>
      </Row>
    ))
  }
  const dropdownRender = () => {
    return (
      <Container>
        <ScrollWrap>
          <Title>最近项目</Title>
          {itmeMain(itemArr)}
        </ScrollWrap>
        <Border />
        <Footer>
          <div>
            <IconFont
              type="folder-open-nor"
              style={{
                fontSize: 20,
                marginRight: 12,
                color: 'var(--neutral-n3)',
              }}
            />
            查看所有项目
          </div>
          <div>
            <IconFont
              type="plus"
              style={{
                fontSize: 20,
                marginRight: 12,
                color: 'var(--neutral-n3)',
              }}
            />
            创建项目
          </div>
        </Footer>
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
      {dropdownRender}
    </>
  )
}
export default ItemDropdown
