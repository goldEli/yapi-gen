import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import { seleData1, seleData2, seleData3 } from './DataList'
const AddPersonText = styled.div`
  margin-left: 26px;
  display: flex;
  margin-bottom: 8px;
`
const AddPersonTitleText = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--neutral-n1-d1);
  margin-right: 16px;
  span:nth-child(2) {
    color: var(--function-error);
  }
`
const PersonContainer = styled.div`
  width: 100%;
  padding: 0 24px;
  display: flex;
  margin-bottom: 24px;
`
const Col = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 116px;
  height: 32px;
  background-color: var(--neutral-n8);
  border-radius: 6px;
  color: var(--neutral-n2);
  padding: 8px;
  margin-right: 24px;
  img {
    width: 24px;
    height: 24px;
    border: 1px solid red;
  }
`
const NameText = styled.div`
  padding: 0 10px;
`

interface RowsItem {
  label: string
  id: number
}
interface Props {
  // 成员数据
  data: Array<RowsItem>
  // 标题名称
  title: string
  // 红色必选
  isShow: boolean
  // 类型
  state: string
}
interface Item {
  label: string
  key: string
}
const Addperson = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [member, setMember] = useState(props.data)
  const [items, setItems] = useState<Array<Item>>()
  // 下拉
  const onOpenChange = (e: { key: string }) => {
    setIsOpen(false)
  }
  // 删除添加的成员
  const delPerson = (el: { id: number }) => {
    setMember(member.filter(item => item.id !== el.id))
  }
  useEffect(() => {
    switch (props.state) {
      case '1':
        setItems(seleData1)
        break
      case '2':
        setItems(seleData2)
        break
      case '3':
        setItems(seleData3)
        break
    }
  }, [props.state])
  return (
    <>
      <AddPersonText>
        <AddPersonTitleText>
          <span>{props.title}</span>
          {props.isShow ? <span>*</span> : null}
        </AddPersonTitleText>
        <Dropdown
          placement="bottomLeft"
          open={isOpen}
          trigger={['click']}
          menu={{ items, onClick: onOpenChange }}
          overlayStyle={{
            width: 120,
            background: 'var(--neutral-white-d1)',
          }}
        >
          <CommonButton type="primaryText" onClick={() => setIsOpen(!isOpen)}>
            添加
            <CommonIconFont
              type={isOpen ? 'up' : 'down'}
              size={14}
              color="var(--primary-d2)"
            />
          </CommonButton>
        </Dropdown>
      </AddPersonText>
      <PersonContainer>
        {member.map(el => (
          <Col key={el.id}>
            <img src="" />
            <NameText>{el.label}</NameText>
            <CommonIconFont
              onClick={() => delPerson(el)}
              type="close"
              size={14}
              color="var(--neutral-n3)"
            />
          </Col>
        ))}
      </PersonContainer>
    </>
  )
}
export default Addperson
