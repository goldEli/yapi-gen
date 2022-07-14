/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-literals */
import React, { useMemo, useState } from 'react'
import IconFont from './IconFont'
import { Checkbox, Divider, Dropdown, Menu, Modal, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import styled from '@emotion/styled'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'

const ModalContent = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const ModalFooter = styled(Space)({
  display: 'flex',
  justifyContent: 'flex-end',
})

const ContentLeft = styled.div({
  height: 400,
  overflow: 'auto',
  padding: '0 16px',
  width: '69%',
})

const ContentRight = styled.div({
  height: 400,
  width: '30%',
})

const TitleWrap = styled.div({
  fontSize: 12,
  color: '#969799',
  marginBottom: 8,
})

const CheckboxGroup = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
})

const CheckedItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 40,
  borderRadius: 6,
  padding: '0 8px',
  '&: hover': {
    background: '#F0F4FA',
    '.iconBox': {
      display: 'block',
    },
  },
})

const plainOptions = [
  { label: 'id', value: 'name' },
  { label: 'id1', value: 'tag' },
  { label: 'id2', value: 'status' },
  { label: 'id3', value: 'address1' },
  { label: 'id4', value: 'address2' },
]
const plainOptions2 = [
  { label: '飞机', value: 'feiji' },
  { label: '大炮', value: 'dapao' },
  { label: '坦克', value: 'tanke' },
  { label: '直升机', value: 'zhishengji' },
  { label: '战舰', value: 'zhanjian' },
  { label: '时间', value: 'time' },
]

interface ItemType {
  value: string
  label: string
}

export default () => {
  const [basicList, setBasicList] = useState<CheckboxValueType[]>([
    'ID',
    'tag',
    'status',
  ])
  const [otherList, setOtherList] = useState<CheckboxValueType[]>(['time'])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div onClick={() => setIsModalVisible(true)}>设置显示字段</div>
          ),
        },
      ]}
    />
  )

  const delChecked = (value: string) => {
    if (basicList.includes(value)) {
      const arr = basicList.filter(value1 => value1 !== value)
      setBasicList([...arr])
    } else {
      const arr2 = otherList.filter(value1 => value1 !== value)
      setOtherList([...arr2])
    }
  }

  const checkedList = useMemo(() => {
    const arr = [...basicList, ...otherList]
    const arr2 = [...plainOptions, ...plainOptions2]
    const all = arr2.reduce((res: ItemType[], item: ItemType) => {
      if (arr.includes(item.value)) {
        res.push(item)
      }
      return res
    }, [])

    return all.map((item: ItemType) => (
      <CheckedItem key={item.value}>
        <div>
          <IconFont
            style={{ fontSize: 16, color: '#969799', marginRight: 8 }}
            type="move"
          />
          <span>{item.label}</span>
        </div>
        <IconFont
          className="iconBox"
          style={{ fontSize: 16, color: '#969799', display: 'none' }}
          type="close"
          onClick={() => delChecked(item.value)}
        />
      </CheckedItem>
    ))
  }, [basicList, otherList])

  const onBasicChange = (list: CheckboxValueType[]) => {
    setBasicList(list)
  }
  const onOtherChange = (list: CheckboxValueType[]) => {
    setOtherList(list)
  }

  return (
    <div>
      <Dropdown overlay={menu}>
        <IconFont
          type="settings"
          style={{ fontSize: 20, color: '#969799', cursor: 'pointer' }}
        />
      </Dropdown>
      <Modal
        title="显示字段配置"
        width={700}
        onCancel={() => setIsModalVisible(false)}
        footer={false}
        bodyStyle={{ padding: 16 }}
        visible={isModalVisible}
      >
        <div>
          <ModalContent>
            <ContentLeft>
              <TitleWrap>基本字段</TitleWrap>
              <CheckboxGroup>
                <Checkbox.Group
                  value={basicList}
                  options={plainOptions}
                  onChange={onBasicChange}
                />
              </CheckboxGroup>
              <TitleWrap style={{ marginTop: 24 }}>人员与时间字段</TitleWrap>
              <CheckboxGroup>
                <Checkbox.Group
                  value={otherList}
                  options={plainOptions2}
                  onChange={onOtherChange}
                />
              </CheckboxGroup>
            </ContentLeft>
            <Divider
              style={{ height: 400, margin: '0 24px' }}
              type="vertical"
            />
            <ContentRight>
              <TitleWrap>当前选择字段</TitleWrap>
              {checkedList}
            </ContentRight>
          </ModalContent>
          <ModalFooter size={16}>
            <Button onClick={() => setIsModalVisible(false)}>取消</Button>
            <Button type="primary">保存</Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  )
}
