/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import styled from '@emotion/styled'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useState } from 'react'
import { IconFont } from '@staryuntech/ant-pro'
import { Popover, Space, Modal } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useModel } from '@/models'

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

  // position: 'sticky',
  // top: 64,
  // zIndex: 2,
})

const IterationInfo = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const StatusTag = styled.div({
  height: 22,
  borderRadius: 6,
  textAlign: 'center',
  lineHeight: '22px',
  padding: '0 8px',
  color: '#43BA9A',
  fontSize: 12,
  background: '#EDF7F4',
  cursor: 'pointer',
})

interface Props {
  isGrid: boolean
  onChangeGrid(val: boolean): void
  onChangeVisible?(): void
  onChangeIsShowLeft?(): void
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
  const [visible, setVisible] = useState(false)
  const { iterateInfo } = useModel('iterate')

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

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
  }

  const changeStatus = (
    <Space
      size={8}
      style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}
    >
      <StatusTag>开启中</StatusTag>
      <StatusTag style={{ color: '#969799', background: '#F2F2F4' }}>
        已结束
      </StatusTag>
    </Space>
  )

  return (
    <StickyWrap>
      <Modal
        width={548}
        visible={visible}
        onCancel={() => setVisible(false)}
        title="迭代目标"
        footer={false}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: iterateInfo?.info,
          }}
        />
      </Modal>
      <OperationWrap>
        <IterationInfo>
          <IconFont
            onClick={props.onChangeIsShowLeft}
            type="indent"
            style={{
              fontSize: 16,
              color: 'black',
              cursor: 'pointer',
              marginRight: 8,
            }}
          />
          <span style={{ fontSize: 14, color: 'black', marginRight: 8 }}>
            {iterateInfo?.name}
          </span>
          <span style={{ fontSize: 12, color: '#BBBDBF', marginRight: 8 }}>
            {iterateInfo?.startTime}-{iterateInfo?.endTime}
          </span>
          <Popover
            placement="bottom"
            content={changeStatus}
            getPopupContainer={node => node}
          >
            <StatusTag>
              {iterateInfo?.status === 1 ? '开启中' : '已结束'}
              <IconFont
                type="down-icon"
                style={{ fontSize: 12, marginLeft: 4 }}
              />
            </StatusTag>
          </Popover>
          <IconFont
            onClick={() => setVisible(true)}
            type="detail"
            style={{
              fontSize: 16,
              color: '#969799',
              cursor: 'pointer',
              marginLeft: 8,
            }}
          />
        </IterationInfo>
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
