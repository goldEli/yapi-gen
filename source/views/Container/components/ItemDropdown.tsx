import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import * as services from '@/services'
import { useNavigate } from 'react-router-dom'

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
  /* padding-left: 24px; */
  border-radius: 0px 0px 6px 6px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d2);
  margin: 8px 0;
  & div:hover {
    background-color: var(--hover-d2);
    cursor: pointer;
  }
  & div {
    padding-left: 24px;
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
const ItemRow = styled(Row)`
  > img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
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
  const navigate = useNavigate()
  const [itemArr, setItemArr] = useState([])

  const onFectProjectList = async () => {
    const data = await services.project.getProjectRecent()
    setItemArr(data)
  }

  useEffect(() => {
    onFectProjectList()
  }, [])
  const itmeMain = (item: any) => {
    return item.map((el: any) => (
      <ItemRow key={el.name}>
        <img src={el.cover} />
        <ItemTitle>{el.name}</ItemTitle>
      </ItemRow>
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
          <div
            onClick={() => {
              navigate('/ProjectManagement/Project')
            }}
          >
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
            创建项目 123
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
