import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useState } from 'react'
import { OptionalFeld } from '@/components/OptionalFeld'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'

const OperationWrap = styled.div({
  minHeight: 52,
  lineHeight: '52px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const StickyWrap = styled.div({
  padding: '0 24px',
  background: 'white',
  position: 'sticky',
  top: 64,
  zIndex: 9,
})

interface Props {
  isGrid: boolean
  onChangeGrid(val: boolean): void
  onChangeVisible?(e?: any): void
}

export const plainOptions = [
  { label: 'id', value: 'name' },
  { label: 'id1', value: 'age' },
  { label: 'id2', value: 'address' },
  { label: 'id3', value: 'address1' },
  { label: 'id4', value: 'address2' },
]

export const plainOptions2 = [
  { label: '飞机', value: 'feiji' },
  { label: '大炮', value: 'dapao' },
  { label: '坦克', value: 'tanke' },
  { label: '直升机', value: 'zhishengji' },
  { label: '战舰', value: 'zhanjian' },
]

const Operation = (props: Props) => {
  const [filterState, setFilterState] = useState(true)
  const [settingState, setSettingState] = useState(false)

  const [titleList, setTitleList] = useState<CheckboxValueType[]>([
    'name',
    'age',
    'address',
  ])
  const [titleList2, setTitleList2] = useState<CheckboxValueType[]>([
    'feiji',
    'dapao',
    'tanke',
  ])

  const onChangeSearch = () => {

    //
  }

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
  }
  return (
    <StickyWrap>
      <OperationWrap>
        <SearchComponent
          onChangeVisible={(e: any) => props.onChangeVisible?.(e)}
          onChangeSearch={onChangeSearch}
          placeholder="搜索项目或任务"
          text="创建需求"
        />
        <OperationGroup
          onChangeFilter={() => setFilterState(!filterState)}
          onChangeGrid={props.onChangeGrid}
          isGrid={props.isGrid}
          filterState={filterState}
          settingState={settingState}
          onChangeSetting={() => setSettingState(!settingState)}
        />
      </OperationWrap>
      <TableFilter showForm={filterState} list={[]} />
      <OptionalFeld
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        checkList={titleList}
        checkList2={titleList2}
        isVisible={settingState}
        onClose={() => setSettingState(false)}
        getCheckList={getCheckList}
      />
    </StickyWrap>
  )
}

export default Operation
