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
import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'
import { useDispatch } from '@store/index'
import { setEditSave } from '@store/formWork'
import CommonUserAvatar from '@/components/CommonUserAvatar'
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
  flex-wrap: wrap;
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
  margin-bottom: 12px;
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
  min-width: 40px;
`
const DefalutIcon = styled.div<{ bgc?: any }>(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
  },
  ({ bgc }) => ({
    backgroundColor: bgc,
  }),
)
const DefalutIcon1 = styled.div<{ bgc?: any }>(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1px solid  #DDE3F3',
  },
  ({ bgc }) => ({
    backgroundColor: bgc,
  }),
)
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
  onChangedel(value: any): void
}
interface Item {
  label: string
  key: string
}
const Addperson = (props: Props) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<Array<Item>>()
  const [isVisible, setIsVisible] = useState(false)
  // 添加部门/团队弹窗
  const [isAddVisible, setIsAddVisible] = useState(false)
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
        return type === 'id' ? 1 : '汇报对象'
      case 'departmentHead':
        return type === 'id' ? 2 : '部门主管'
      case 'teamManagement':
        return type === 'id' ? 3 : '团队管理'
      case 'reportsTo':
        return type === 'id' ? 4 : '直属主管'
      case 'allSuperiors':
        return type === 'id' ? 5 : '所有上级'
      case 'all':
        return '全部'
    }
  }
  // 下拉
  const onOpenChange = (e: { key: string }) => {
    dispatch(setEditSave(false))
    setIsOpen(false)
    setIsVisible(e.key === 'user')
    setIsAddVisible(['department', 'team'].includes(e.key))
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
  const delPerson = (el: { target_id: any }) => {
    props.onChangedel(el)
    dispatch(setEditSave(false))
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
  // 添加成员弹窗
  const onConfirm = (data: any) => {
    const setData = data.map((el: any) => ({
      ...el,
      user_type: userType,
      target_type: targetType,
      target_value: { name: el.name, avatar: el.avatar },
    }))

    props.onChangeValues(setData)
    setIsVisible(false)
  }

  // 添加团队部门
  const onAddConfirm = (data: any) => {
    const values = data.map((item: any) => ({
      ...item,
      user_type: userType,
      target_type: item.type === 1 ? 2 : item.type,
      target_value: {
        name: item.name,
        avatar: item.type === 1 ? 2 : item.type,
      },
    }))
    props.onChangeValues(values)
  }
  const getImg = (item: any) => {
    if (
      item.target_value?.avatar &&
      item.target_value?.avatar !== 3 &&
      item.target_value?.avatar !== 2 &&
      item.target_value?.avatar !== 4
    ) {
      return <img src={item?.target_value?.avatar} />
    } else if (item.target_value?.avatar === 2) {
      return (
        <DefalutIcon bgc="rgba(152, 172, 224, 1)">
          <CommonIconFont
            type="team-2"
            size={16}
            color="var(--neutral-white-d7)"
          />
        </DefalutIcon>
      )
    } else if (item.target_value?.avatar === 4) {
      return (
        <DefalutIcon bgc="rgba(121, 209, 193, 1)">
          <CommonIconFont
            type="branch"
            size={16}
            color="var(--neutral-white-d7)"
          />
        </DefalutIcon>
      )
    } else if (item.target_value.key === 'all' || item.target_type === 4) {
      return (
        <DefalutIcon bgc="rgba(125, 189, 225, 1)">
          <CommonIconFont
            type="userAll"
            size={16}
            color="var(--neutral-white-d7)"
          />
        </DefalutIcon>
      )
    } else {
      return <CommonUserAvatar />
    }
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
            {getImg(el)}
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
      <AddDepartmentOrTeamModal
        isVisible={isAddVisible}
        onClose={() => setIsAddVisible(false)}
        type={targetType === 2 ? 4 : 3}
        onConfirm={onAddConfirm}
      />
    </>
  )
}
export default Addperson
