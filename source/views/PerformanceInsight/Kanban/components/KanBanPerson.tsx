/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-curly-brace-presence */
import MoreSelect from '@/components/MoreSelect'
import {
  KanBanPersonHeader,
  KanBanPersonWrap,
  CheckboxAll,
  CheckBoxWrap,
  CollapseHeaderWrap,
  FilterWrap,
  FilterContent,
  FilterItem,
  MemberItem,
} from '../style'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { useEffect, useState } from 'react'
import { Collapse, Select, Checkbox, Popover } from 'antd'
import CommonUserAvatar from '@/components/CommonUserAvatar'

interface CollapseHeaderProps {
  item: any
  onChangeKeys(state: boolean, key: number): void
  // 当前面板展开的数组
  activeKey: number[]
  // 筛选条件
  filterParams: any
  // 选中的人员数组
  selectKeys: any
  onChangeSelectKeys(value: any): void
}

// 折叠头部
const CollapseHeader = (props: CollapseHeaderProps) => {
  const { item, onChangeKeys, activeKey, onChangeSelectKeys, selectKeys } =
    props
  const [isVisible, setIsVisible] = useState(false)
  // 默认选择全部 - 迭代
  const [normal, setNormal] = useState<number[]>([0])
  // 全选状态
  const [checkAll, setCheckAll] = useState(false)
  // 半选状态
  const [indeterminate, setIndeterminate] = useState(false)

  // 项目权限-勾选
  const onChangeCheckbox = (e: any) => {
    const { checked } = e.target
    // 全选的key
    const resultKeysCheckEd = [
      ...new Set([
        ...selectKeys,
        ...props.item?.member_list?.map((k: any) => k.id),
      ]),
    ]
    // 取消全选的key
    const resultKeysNotCheckEd = props.selectKeys.filter(
      (object: any) =>
        !props.item?.member_list.some(
          (otherObject: any) => otherObject.id === object,
        ),
    )
    onChangeSelectKeys(checked ? resultKeysCheckEd : resultKeysNotCheckEd)
  }

  // 点击名称折叠展开
  const onClickName = () => {
    onChangeKeys(activeKey?.includes(item.id), item.id)
  }

  // 修改选中迭代
  const onChangeIteration = (id: number) => {
    if (id === 0) {
      setNormal([0])
    } else {
      const result = [...new Set([...normal, ...[id]])]
      setNormal(result?.filter((i: any) => i !== 0))
    }
    // 向上返回筛选条件
  }

  useEffect(() => {
    setNormal(props.filterParams?.iteration ?? [0])
  }, [props.filterParams])

  useEffect(() => {
    const resultList = props.selectKeys.filter((object: any) =>
      props.item?.member_list.some(
        (otherObject: any) => otherObject.id === object,
      ),
    )
    setIndeterminate(
      resultList?.length !== props.item?.member_list?.length &&
        resultList?.length !== 0,
    )
    setCheckAll(resultList?.length === props.item?.member_list?.length)
  }, [props.selectKeys])

  return (
    <CollapseHeaderWrap>
      <div className="left">
        <Checkbox
          onChange={onChangeCheckbox}
          checked={checkAll}
          indeterminate={indeterminate}
        />
        <span className="name" onClick={onClickName}>
          {item.name}
        </span>
      </div>
      <Popover
        placement="bottomRight"
        open={isVisible}
        onOpenChange={setIsVisible}
        trigger={['click']}
        content={
          <FilterContent>
            <FilterItem onClick={() => onChangeIteration(0)}>
              <div className="name">全部</div>
              {normal.includes(0) && (
                <CommonIconFont type="check" color={'var(--primary-d2)'} />
              )}
            </FilterItem>
            <>
              {item?.iterate_list?.map((i: any) => (
                <FilterItem key={i.id} onClick={() => onChangeIteration(i.id)}>
                  <div className="name">{i.name}</div>
                  {normal.includes(i.id) && (
                    <CommonIconFont type="check" color={'var(--primary-d2)'} />
                  )}
                </FilterItem>
              ))}
            </>
          </FilterContent>
        }
      >
        <FilterWrap state={isVisible}>
          <CommonIconFont type="filter" size={20} color="var(--neutral-n3)" />
        </FilterWrap>
      </Popover>
    </CollapseHeaderWrap>
  )
}

interface KanBanPersonProps {
  onClose(): void
  // 筛选条件
  filterParams: any
  // 更新筛选条件
  onChangeFilter(value: any): void
}

const KanBanPerson = (props: KanBanPersonProps) => {
  const [t] = useTranslation()
  // 所有数据
  const [dataList, setDataList] = useState<any>([])
  // 下拉使用的数据
  const [selectList, setSelectList] = useState([])
  // 选中的key
  const [selectKeys, setSelectKeys] = useState<any>([])
  // 全选状态
  const [checkAll, setCheckAll] = useState(false)
  // 半选状态
  const [indeterminate, setIndeterminate] = useState(false)
  // 折叠展开key
  const [activeKey, setActiveKey] = useState<any>([])

  // 获取项目数据
  const getPersonList = async () => {
    const result = [
      {
        id: 1,
        name: 'iFUN-agile',
        member_list: [
          { id: 30, name: '赵飒' },
          { id: 31, name: '赵四' },
        ],
        iterate_list: [
          { id: 10, name: '第一个冲刺' },
          { id: 11, name: '第二个冲刺' },
        ],
      },
      {
        id: 2,
        name: 'iFUN-email',
        member_list: [
          { id: 33, name: '赵飒' },
          { id: 32, name: '李思思' },
        ],
        iterate_list: [
          { id: 12, name: '第三个冲刺' },
          { id: 13, name: '第四个冲刺' },
        ],
      },
    ]
    setDataList(result)
    // 拍平数组
    const allMember: any = result.reduce((accumulator: any, item: any) => {
      if (item.member_list) {
        const memberList: any = item.member_list?.map((i: any) => ({
          name: i.name,
          id: i.id,
          project_name: item.name,
        }))
        accumulator.push(...memberList)
      }
      return accumulator
    }, [])
    setSelectList(allMember)
  }

  // 选择人员
  const onSelectMember = (users: any) => {
    const resultUsers = users ?? []
    setSelectKeys(resultUsers)
    setIndeterminate(
      resultUsers?.length !== selectList?.length && resultUsers?.length !== 0,
    )
    setCheckAll(resultUsers?.length === selectList?.length)
    props.onChangeFilter({
      ...props?.filterParams,
      ...{
        user_ids: resultUsers,
      },
    })
  }

  // 点击全选
  const onAllChecked = (e: any) => {
    const { checked } = e.target
    setSelectKeys(checked ? selectList?.map((k: any) => k.id) : [])
    setIndeterminate(false)
    setCheckAll(checked)
    props.onChangeFilter({
      ...props?.filterParams,
      ...{
        user_ids: checked ? selectList?.map((k: any) => k.id) : [],
      },
    })
  }

  // 点击图标展开或折叠
  const onClickIcon = (e: any) => {
    const key = Number(e.panelKey)
    setActiveKey(
      e.isActive
        ? activeKey?.filter((i: any) => i !== key)
        : [...new Set([...activeKey, ...[key]])],
    )
  }

  // 项目下的勾选修改
  const onProjectCheck = (users: any) => {
    const resultUsers = users ?? []
    setSelectKeys(resultUsers)
    setIndeterminate(
      resultUsers?.length !== selectList?.length && resultUsers?.length !== 0,
    )
    setCheckAll(resultUsers?.length === selectList?.length)
    props.onChangeFilter({
      ...props?.filterParams,
      ...{
        user_ids: resultUsers,
      },
    })
  }

  // 单人勾选
  const onClickCheckboxItem = (id: number) => {
    console.log(111111)
    let resultKeys: any = []
    // 如果勾选中不存在，则添加
    if (selectKeys?.includes(id)) {
      resultKeys = selectKeys?.filter((i: number) => i !== id)
    } else {
      resultKeys = [...selectKeys, ...[id]]
    }
    onProjectCheck(resultKeys)
  }

  useEffect(() => {
    getPersonList()
  }, [])

  return (
    <KanBanPersonWrap>
      <KanBanPersonHeader>
        <div className="input">
          <MoreSelect
            placeholder={t('searchMembers')}
            onConfirm={() => null}
            onChange={onSelectMember}
            value={selectKeys}
            renderChildren
            options={selectList}
          >
            {selectList?.map((i: any) => (
              <Select.Option key={i.id} value={i.id} label={i.name}>
                {i.name}
                <span role="img" aria-label={i.id}>
                  （{i.project_name}）
                </span>
              </Select.Option>
            ))}
          </MoreSelect>
        </div>
        <CloseWrap width={32} height={32} onClick={props.onClose}>
          <CommonIconFont size={20} type="outdent" />
        </CloseWrap>
      </KanBanPersonHeader>
      <CheckboxAll
        checked={checkAll}
        indeterminate={indeterminate}
        onClick={onAllChecked}
      >
        {t('selectAll')}
      </CheckboxAll>
      <CheckBoxWrap>
        <Collapse
          expandIcon={e => (
            <CommonIconFont
              type={e.isActive ? 'down-icon' : 'right-icon'}
              size={12}
              color="var(--neutral-n3)"
              onClick={() => onClickIcon(e)}
            />
          )}
          activeKey={activeKey}
        >
          {dataList?.map((i: any) => (
            <Collapse.Panel
              header={
                <CollapseHeader
                  selectKeys={selectKeys}
                  onChangeSelectKeys={onProjectCheck}
                  filterParams={props.filterParams}
                  item={i}
                  onChangeKeys={(state: boolean, key: number) => {
                    setActiveKey(
                      state
                        ? activeKey?.filter((i: any) => i !== key)
                        : [...new Set([...activeKey, ...[key]])],
                    )
                  }}
                  activeKey={activeKey}
                />
              }
              key={i.id}
            >
              {i.member_list?.map((i: any) => (
                <MemberItem
                  key={i.id}
                  onClick={() => onClickCheckboxItem(i.id)}
                >
                  <Checkbox checked={selectKeys?.includes(i.id)} />
                  <div className="info">
                    <CommonUserAvatar size="small" />
                    <span className="name">
                      {i.name}（Agile组-前端开发1212112安居客啥款的话）
                    </span>
                  </div>
                </MemberItem>
              ))}
            </Collapse.Panel>
          ))}
        </Collapse>
      </CheckBoxWrap>
    </KanBanPersonWrap>
  )
}

export default KanBanPerson
