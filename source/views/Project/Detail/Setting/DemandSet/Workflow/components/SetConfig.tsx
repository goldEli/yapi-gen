/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import {
  Table,
  Select,
  Radio,
  Checkbox,
  Timeline,
  Divider,
  Switch,
  Button,
  Menu,
  Popover,
  Input,
} from 'antd'
import { useState } from 'react'
import { NameWrap } from '@/components/StyleCommon'

const LabelWrap = styled.div({
  color: '#323233',
  fontSize: 14,
  fontWeight: 400,
  width: 100,
})

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const StatusWrap = styled.div<{ color?: string }>(
  {
    borderRadius: 6,
    background: 'white',
    height: 28,
    lineHeight: '28px',
    padding: '0 12px',
    color: '#969799',
    border: '1px solid #EBEDF0',
  },
  ({ color }) => ({

    // color: color || '#969799',
    // border: `1px solid ${color || '#969799'}`,
  }),
)

const TextWrap = styled.div({
  fontSize: 12,
  color: '#969799',
  fontWeight: 400,
})

const PersonWrap = styled.div({
  maxHeight: 200,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
})

const AddWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  width: 32,
  boxSizing: 'border-box',
  cursor: 'pointer',
  borderRadius: 16,
})

interface Props {
  isVisible: boolean
}

const data = [
  { name: '处理人', key: 'name', type: 'select' },
  { name: '评论', key: 'remark', type: 'select' },
]

const personList = [
  { name: '张三', id: 1 },
  { name: '哈哈哈', id: 2 },
  { name: '问问', id: 3 },
  { name: '站和人', id: 4 },
  { name: '里斯', id: 5 },
]

const ChoosePerson = () => {
  const [value, setValue] = useState('')
  return (
    <>
      <Input
        placeholder="请输入关键字"
        onChange={e => setValue(e.target.value)}
      />
      <PersonWrap>
        {personList
          ?.filter(k => k.name.includes(value))
          ?.map(i => <div key={i.id}>{i.name}</div>)}
      </PersonWrap>
    </>
  )
}

const SetConfig = (props: Props) => {
  const [isShowPermission, setIsShowPermission] = useState(true)
  const [isSwitch, setIsSwitch] = useState(false)
  const [isShowField, setIsShowField] = useState(true)
  const [radioValue, setRadioValue] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [isShowSelect, setIsShowSelect] = useState(false)

  const onClose = () => {

    //
  }

  const onConfirm = () => {

    //
  }

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      render: () => <IconFont type="move" />,
    },
    {
      title: '字段名称',
      width: 160,
      dataIndex: 'name',
      render: (text: any, record: any) => <Select style={{ width: 148 }} />,
    },
    {
      title: '默认值类型',
      width: 160,
      dataIndex: 'remark',
      render: (text: any) => <Select style={{ width: 148 }} />,
    },
    {
      title: '默认值/默认值字段',
      dataIndex: 'startStatus',
      width: 170,
      render: (text: any) => <Select style={{ width: 148 }} />,
    },
    {
      title: '是否必填',
      width: 100,
      dataIndex: 'endStatus',
      render: (text: any) => <Checkbox />,
    },
    {
      title: '操作',
      width: 60,
      dataIndex: 'action',
      render: (text: string, record: any) => <span style={{ color: '#2877ff', cursor: 'pointer' }}>删除</span>
      ,
    },
  ]

  const onRadioChange = (e: any) => {

    // console.log('radio checked', e.target.value)
    setRadioValue(e.target.value)
  }

  return (
    <CommonModal
      isVisible={props?.isVisible}
      title="配置流转附加字段及权限"
      onClose={onClose}
      onConfirm={onConfirm}
      width={784}
    >
      <div style={{ maxHeight: 584, overflowY: 'auto' }}>
        <ItemWrap style={{ marginTop: 8 }}>
          <LabelWrap>当前流转</LabelWrap>
          <ItemWrap>
            <StatusWrap>规划中</StatusWrap>
            <Divider
              type="vertical"
              style={{ width: 48, height: 1, border: '1px dashed #D5D6D9' }}
            />
            <StatusWrap>已完成</StatusWrap>
          </ItemWrap>
        </ItemWrap>
        <ItemWrap style={{ marginTop: 32 }}>
          <ItemWrap
            style={{ cursor: 'pointer' }}
            onClick={() => setIsShowPermission(false)}
          >
            <IconFont
              type="tableDown"
              style={{ fontSize: 12, color: '#646566', marginRight: 8 }}
            />
            <span style={{ color: '#323233', fontSize: 14, fontWeight: 500 }}>
              流转操作权限
            </span>
          </ItemWrap>
        </ItemWrap>
        {isShowPermission && (
          <div>
            <TextWrap>
              配置状态流转用户权限，只有有权限的用户才允许做此流转。如果为空则默认所有人有权限。
            </TextWrap>
            <ItemWrap style={{ marginTop: 16 }}>
              <LabelWrap>用户组</LabelWrap>
              <Select style={{ width: 186 }} />
            </ItemWrap>
            <ItemWrap style={{ marginTop: 24 }}>
              <LabelWrap>人员字段</LabelWrap>
              <Select style={{ width: 186 }} />
            </ItemWrap>
            <ItemWrap style={{ marginTop: 24 }}>
              <LabelWrap>其他用户</LabelWrap>
              <Select style={{ width: 186 }} />
            </ItemWrap>
            <ItemWrap style={{ marginTop: 24 }}>
              <LabelWrap>流转审核</LabelWrap>
              <Switch
                defaultChecked={isSwitch}
                onChange={checked => setIsSwitch(checked)}
              />
            </ItemWrap>
            <TextWrap>开启审核后，需审核人同意后才可流转到下一状态</TextWrap>
            {isSwitch && (
              <Wrap>
                <Radio.Group
                  onChange={onRadioChange}
                  value={radioValue}
                  style={{ marginTop: 8 }}
                >
                  <Radio value={1}>固定审核流程</Radio>
                  <Radio value={2}>用户指定审核人</Radio>
                </Radio.Group>
                <Timeline>
                  <Timeline.Item>
                    <ItemWrap>
                      <span>审核人</span>
                      <Popover
                        key={isShowSelect.toString()}
                        visible={isShowSelect}
                        placement="bottom"
                        trigger="hover"
                        onVisibleChange={visible => setIsShowSelect(visible)}
                        content={
                          <Menu>
                            <Menu.Item key={1}>依次审核</Menu.Item>
                            <Menu.Item key={2}>与逻辑审核</Menu.Item>
                            <Menu.Item key={3}>或逻辑审核</Menu.Item>
                          </Menu>
                        }
                        getPopupContainer={node => node}
                      >
                        依次审核
                      </Popover>
                    </ItemWrap>
                    <ItemWrap style={{ alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <NameWrap>张三</NameWrap>
                        <span>张三</span>
                      </div>
                      <Popover
                        key={isOpen.toString()}
                        visible={isOpen}
                        placement="bottom"
                        trigger="click"
                        onVisibleChange={visible => setIsOpen(visible)}
                        content={<ChoosePerson />}
                        getPopupContainer={node => node}
                      >
                        <AddWrap>
                          <IconFont
                            type="plus"
                            onClick={() => setIsOpen(true)}
                          />
                        </AddWrap>
                      </Popover>
                    </ItemWrap>
                  </Timeline.Item>
                  <Timeline.Item>
                    <div style={{ color: '#2877ff', cursor: 'pointer' }}>
                      添加审核
                    </div>
                  </Timeline.Item>
                </Timeline>
              </Wrap>
            )}
          </div>
        )}
        <ItemWrap style={{ marginTop: 32 }}>
          <ItemWrap
            style={{ cursor: 'pointer' }}
            onClick={() => setIsShowField(false)}
          >
            <IconFont
              type="tableDown"
              style={{ fontSize: 12, color: '#646566', marginRight: 8 }}
            />
            <span style={{ color: '#323233', fontSize: 14, fontWeight: 500 }}>
              流转填写字段
            </span>
          </ItemWrap>
        </ItemWrap>
        {isShowField && (
          <div>
            <TextWrap>
              配置状态流转过程中需要额外填写的字段，可以设置是否必填和默认值。
            </TextWrap>
            <Button
              style={{ background: '#F0F4FA', color: '#2877ff', marginTop: 16 }}
              icon={<IconFont type="plus" />}
            >
              添加字段
            </Button>
            <Table
              pagination={false}
              dataSource={data}
              columns={columns}
              rowKey="id"
              sticky
              style={{ marginTop: 16 }}
            />
            <TextWrap>
              注：拖动图标可以调整状态顺序哦。（状态的顺序会体现在流转时状态的展现和列表排序中。）
            </TextWrap>
          </div>
        )}
      </div>
    </CommonModal>
  )
}

export default SetConfig
