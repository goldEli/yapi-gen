/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
/* eslint-disable no-constant-binary-expression */
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import { seleData1, seleData2, seleData3 } from './DataList'
import CommonModal from '@/components/AddUser/CommonModal'
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
    border-radius: 50%;
  }
  &:hover {
    cursor: pointer;
    background-color: var(--neutral-white-d4);
    box-shadow: 0px 0px 10px 0px rgba(9, 9, 9, 0.09);
  }
`
const NameText = styled.div`
  padding: 0 10px;
`
const DefalutIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(125, 189, 225, 1);
`
interface RowsItem {
  name: string
  id: number
}
interface Props {
  // 成员数据
  person: any
  // 标题名称
  title: string
  // 红色必选
  isShow: boolean
  // 类型
  state: number
  onChangeValues(value: any): void
}
interface Item {
  label: string
  key: string
}
const Addperson = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<Array<Item>>()
  const [isVisible, setIsVisible] = useState(false)
  const [userType, setUserType] = useState<number>(0)
  const [targetType, setTargetType] = useState<number>(0)
  const [personData, setPersonData] = useState<any>()
  // 去重
  const fitlerDataList = (data: any) => {
    let obj: any = {}
    let set: any = data?.reduce((cur: any, next: any) => {
      obj[next.target_id] ? '' : (obj[next.target_id] = true && cur.push(next))
      return cur
    }, [])
    return set
  }
  // 获取名称和固定的id
  const getName = (key: string, type: string) => {
    switch (key) {
      case 'obj':
        return type == 'id' ? 1 : '汇报对象'
      case 'departmentHead':
        return type == 'id' ? 2 : '部门主管'
      case 'teamManagement':
        return type == 'id' ? 3 : '团队管理'
      case 'reportsTo':
        return type == 'id' ? 4 : '直属主管'
      case 'allSuperiors':
        return type == 'id' ? 5 : '所有上级'
      case 'all':
        return '全部'
    }
  }
  // 下拉
  const onOpenChange = (e: { key: string }) => {
    setIsOpen(false)
    setIsVisible(e.key === 'user' ? true : false)
    setUserType(props.state)
    switch (e.key) {
      case 'user':
        setTargetType(1)
        break
      case 'department':
        setTargetType(2)
        break
      case 'team':
        setTargetType(3)
        break
      case 'all':
        const data = [
          {
            user_type: props.state,
            key: 'all',
            id: -props.state,
            target_id: -props.state,
            name: getName(e.key, ''),
            avatar: '',
            target_value: {
              user_type: props.state,
              key: 'all',
              name: getName(e.key, ''),
              avatar: '',
            },
          },
        ]
        props.onChangeValues(data)
        break
      default:
        const data1 = [
          {
            user_type: props.state,
            key: e.key,
            target_type: 4,
            name: getName(e.key, ''),
            avatar: '',
            target_id: getName(e.key, 'id'),
            target_value: {
              user_type: props.state,
              key: e.key,
              target_type: 4,
              name: getName(e.key, ''),
              avatar: '',
            },
          },
        ]
        props.onChangeValues(data1)
        setTargetType(4)
        break
    }
  }
  // 删除添加的成员
  const delPerson = (el: { id: any }) => {
    // 这抛回去
    const values = personData?.filter((item: any) => item.id !== el.id)
    setPersonData(values)
    props.onChangeValues(values)
  }
  useEffect(() => {
    switch (props.state) {
      case 1:
        setItems(seleData1)
        break
      case 2:
        setItems(seleData2)
        break
      case 3:
        setItems(seleData3)
        break
    }
  }, [props.state])
  const onConfirm = (data: any) => {
    const setData = data.map((el: any) => ({
      ...el,
      user_type: userType,
      target_type: targetType,
      target_value: { name: el.name, avatar: el.avatar },
    }))
    const values = setData
    props.onChangeValues(values)
    setIsVisible(false)
  }
  useEffect(() => {
    setPersonData(fitlerDataList(props.person))
  }, [props.person])
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
        {personData?.map((el: any) => (
          <Col key={el.id}>
            {el?.target_value?.avatar ? (
              <img src={el?.target_value?.avatar} />
            ) : (
              <DefalutIcon>
                <CommonIconFont
                  type="userAll"
                  size={16}
                  color="var(--neutral-white-d7)"
                />
              </DefalutIcon>
            )}
            <NameText>{el?.target_value?.name}</NameText>
            <CommonIconFont
              onClick={() => delPerson(el)}
              type="close"
              size={14}
              color="var(--neutral-n3)"
            />
          </Col>
        ))}
      </PersonContainer>
      {/* 添加成员弹窗 */}
      {isVisible && (
        <CommonModal
          title={'添加成员'}
          state={2}
          isVisible={isVisible}
          onConfirm={onConfirm}
          onClose={() => setIsVisible(false)}
        />
      )}
    </>
  )
}
export default Addperson
