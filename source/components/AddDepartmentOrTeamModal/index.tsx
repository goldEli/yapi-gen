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

const AddDepartmentModal = (props: AddDepartmentModalProps) => {
  const [checkedList, setCheckedList] = useState<Model.Calendar.MemberItem[]>(
    [],
  )
  const [dataList, setDataList] = useState<Model.Calendar.MemberItem[]>([])
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
        is_checked: e.target.checked ? 1 : 2,
      }),
    )
    setDataList(result)
    if (e.target.checked) {
      // setCheckedList([])
    } else {
      setCheckedList([])
    }
  }

  // 清空
  const onClearAll = () => {
    const result: Model.Calendar.MemberItem[] = dataList.map(
      (i: Model.Calendar.MemberItem) => ({
        ...i,
        is_checked: 2,
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
        is_checked: i.id === item.id ? 2 : i.is_checked,
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
      is_checked: i.id === item.id ? 2 : i.is_checked,
    }))

    setDataList(newDataList)
    setCheckedList(resultList)
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title={
        props.type === 3
          ? '添加团队'
          : props.type === 2
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
                props.type === 3 ? '团队' : props.type === 2 ? '联系人' : '部门'
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
                  {props.type === 2 && (
                    <>
                      <CommonUserAvatar avatar={i.avatar} fontSize={14} />
                      <div className="name">{i.name}</div>
                    </>
                  )}
                  <div className="otherType">
                    {props.type !== 2 && (
                      <IconWrap
                        className={
                          props.type === 3 ? 'teamIcon' : 'departmentIcon '
                        }
                      >
                        <IconFont
                          type={props.type === 3 ? 'team-2' : 'branch'}
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
