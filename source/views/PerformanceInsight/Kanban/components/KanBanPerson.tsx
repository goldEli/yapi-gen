import MoreSelect from '@/components/MoreSelect'
import {
  KanBanPersonHeader,
  KanBanPersonWrap,
  CheckboxAll,
  CheckBoxWrap,
  CollapseHeaderWrap,
} from '../style'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { useEffect, useState } from 'react'
import { Collapse, type CollapseProps, Select, Checkbox } from 'antd'
import IconFont from '@/components/IconFont'

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
          { id: 30, name: '赵飒' },
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
          id: `${item.id}_${i.id}`,
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

  useEffect(() => {
    getPersonList()
  }, [])

  // 折叠图标
  const expandIcon = (e: any) => {
    return (
      <CommonIconFont
        type={e.isActive ? 'down-icon' : 'right-icon'}
        size={12}
        color="var(--neutral-n3)"
      />
    )
  }

  // 折叠头部
  const CollapseHeader = (props: { item: any }) => {
    const { item } = props
    return (
      <CollapseHeaderWrap>
        <div className="left">
          <Checkbox />
          <span className="name">{item.name}</span>
        </div>
        <CloseWrap width={32} height={32}>
          <CommonIconFont type="filter" size={20} color="var(--neutral-n3)" />
        </CloseWrap>
      </CollapseHeaderWrap>
    )
  }

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
        <Collapse expandIcon={e => expandIcon(e)}>
          {dataList?.map((i: any) => (
            <Collapse.Panel header={<CollapseHeader item={i} />} key={i.key}>
              <div>12</div>
            </Collapse.Panel>
          ))}
        </Collapse>
      </CheckBoxWrap>
    </KanBanPersonWrap>
  )
}

export default KanBanPerson
