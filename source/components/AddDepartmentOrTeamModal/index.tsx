import { Checkbox, Input, Select } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useEffect, useState } from 'react'
import CommonModal from '../CommonModal'
import CommonUserAvatar from '../CommonUserAvatar'
import IconFont from '../IconFont'
import NoData from '../NoData'
import {
  CheckBoxWrap,
  ContentBox,
  ContentLeft,
  ContentRight,
  Header,
  IconWrap,
  LeftItem,
  LeftItems,
  ListItem,
  ListWraps,
} from './style'

interface AddDepartmentModalProps {
  isVisible: boolean
  onClose(): void
  onConfirm(list: Model.Calendar.MemberItem[]): void
  type: Model.Calendar.ChooseAddType
}

const data: Model.Calendar.MemberItem[] = [
  { name: '哈哈哈', id: 0, is_checked: 1 },
  { name: '12121', id: 2, is_checked: 0 },
  { name: '哈哈1212哈', id: 3, is_checked: 0 },
  { name: '44444', id: 4, is_checked: 0 },
  { name: '哈哈222哈', id: 5, is_checked: 0 },
  { name: '1222222121', id: 6, is_checked: 0 },
  { name: '哈哈12222212哈', id: 7, is_checked: 0 },
  { name: '44222222222224442222222222', id: 8, is_checked: 0 },
  { name: '44444', id: 9, is_checked: 0 },
  { name: '哈哈222哈', id: 10, is_checked: 0 },
  { name: '1222222121', id: 11, is_checked: 0 },
  { name: '哈哈12222212哈', id: 12, is_checked: 0 },
  { name: '44222222222224442222222222', id: 13, is_checked: 0 },
]

const AddDepartmentModal = (props: AddDepartmentModalProps) => {
  const [checkedList, setCheckedList] = useState<Model.Calendar.MemberItem[]>(
    [],
  )
  const [dataList, setDataList] = useState<Model.Calendar.MemberItem[]>(data)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (props.isVisible) {
      setCheckedList(
        dataList.filter((i: Model.Calendar.MemberItem) => i.is_checked === 1),
      )
    }
  }, [props.isVisible])

  // 关闭
  const onClose = () => {
    setCheckedList([])
    props.onClose()
  }

  // 确认
  const onConfirm = () => {
    props.onConfirm(checkedList)
    props.onClose()
  }

  //全选
  const checkAllChange = (e: CheckboxChangeEvent) => {
    const result: Model.Calendar.MemberItem[] = dataList.map(
      (i: Model.Calendar.MemberItem) => ({
        ...i,
        is_checked: e.target.checked ? 1 : 0,
      }),
    )
    setDataList(result)
    if (e.target.checked) {
      setCheckedList(data)
    } else {
      setCheckedList([])
    }
  }

  // 清空
  const onClearAll = () => {
    const result: Model.Calendar.MemberItem[] = dataList.map(
      (i: Model.Calendar.MemberItem) => ({
        ...i,
        is_checked: 0,
      }),
    )
    setDataList(result)
    setCheckedList([])
  }

  // 勾选框
  const onChangeChecked = (
    item: Model.Calendar.MemberItem,
    checked: boolean,
  ) => {
    let resultList: Model.Calendar.MemberItem[]
    let newDataList: Model.Calendar.MemberItem[]
    if (checked) {
      resultList = [...checkedList, ...[item]]
      newDataList = dataList.map((i: Model.Calendar.MemberItem) => ({
        ...i,
        is_checked: i.id === item.id ? 1 : i.is_checked,
      }))
    } else {
      resultList = checkedList.filter(
        (i: Model.Calendar.MemberItem) => i.id !== item.id,
      )
      newDataList = dataList.map((i: Model.Calendar.MemberItem) => ({
        ...i,
        is_checked: i.id === item.id ? 0 : i.is_checked,
      }))
    }
    setDataList(newDataList)
    setCheckedList(resultList)
  }

  // 点击图标删除
  const onDeleteItem = (item: Model.Calendar.MemberItem) => {
    const resultList = checkedList.filter(
      (i: Model.Calendar.MemberItem) => i.id !== item.id,
    )
    const newDataList = dataList.map((i: Model.Calendar.MemberItem) => ({
      ...i,
      is_checked: i.id === item.id ? 0 : i.is_checked,
    }))

    setDataList(newDataList)
    setCheckedList(resultList)
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title={
        props.type === 'team'
          ? '添加团队'
          : props.type === 'member'
          ? '添加成员'
          : '添加部门'
      }
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <ContentBox>
        <ContentLeft>
          <div style={{ paddingRight: 20 }}>
            <Input
              value={searchValue}
              allowClear
              onChange={e => setSearchValue(e.target.value)}
              placeholder={`搜索${
                props.type === 'team'
                  ? '团队'
                  : props.type === 'member'
                  ? '联系人'
                  : '部门'
              }`}
            />
          </div>
          <CheckBoxWrap>
            <Checkbox
              checked={dataList.length === checkedList.length}
              onChange={(e: any) => checkAllChange(e)}
            >
              全选
            </Checkbox>
          </CheckBoxWrap>
          <LeftItems>
            {dataList
              .filter((k: Model.Calendar.MemberItem) =>
                k.name.includes(searchValue),
              )
              .map((i: Model.Calendar.MemberItem) => (
                <LeftItem key={i.id}>
                  <Checkbox
                    checked={i.is_checked === 1}
                    onChange={e => onChangeChecked(i, e.target.checked)}
                  />
                  <div
                    onClick={() =>
                      onChangeChecked(i, i.is_checked === 1 ? false : true)
                    }
                  >
                    {i.name}
                  </div>
                </LeftItem>
              ))}
          </LeftItems>
        </ContentLeft>
        <ContentRight>
          <Header>
            <span>已选/{checkedList.length}</span>
            <span onClick={onClearAll}>清空</span>
          </Header>
          <ListWraps>
            {checkedList.length > 0 &&
              checkedList.map((i: Model.Calendar.MemberItem) => (
                <ListItem key={i.id}>
                  {props.type === 'member' && (
                    <>
                      <CommonUserAvatar avatar={i.avatar} fontSize={14} />
                      <div className="name">{i.name}</div>
                    </>
                  )}
                  <div className="otherType">
                    {props.type !== 'member' && (
                      <IconWrap
                        className={
                          props.type === 'team' ? 'teamIcon' : 'departmentIcon '
                        }
                      >
                        <IconFont
                          type={props.type === 'team' ? 'team-2' : 'branch'}
                        />
                      </IconWrap>
                    )}
                    <span className="name">{i.name}</span>
                  </div>
                  <IconFont
                    onClick={() => onDeleteItem(i)}
                    className="closeIcon"
                    type="close"
                    style={{ fontSize: 16, color: 'var(--neutral-n3)' }}
                  />
                </ListItem>
              ))}
            {checkedList.length <= 0 && <NoData size="small" />}
          </ListWraps>
        </ContentRight>
      </ContentBox>
    </CommonModal>
  )
}

export default AddDepartmentModal
