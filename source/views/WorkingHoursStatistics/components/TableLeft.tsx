import ResizeTable from '@/components/ResizeTable'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { Popover } from 'antd'
import {
  StatusWrap,
  CanOperation,
  State,
  StateWrap,
  PopoverWrap,
  Text,
  InputStyle,
} from '../style'
import IconFont from '@/components/IconFont'
import { useState } from 'react'
import CommonModal from '@/components/CommonModal'
const TableLeft = (props: any) => {
  const [state, setState] = useState(false)
  const [value, setValue] = useState('')
  const content = () => {
    return (
      <PopoverWrap>
        <div style={{ marginBottom: 12 }}>
          逾期3天{' '}
          <IconFont
            style={{
              fontSize: 14,
              margin: '0 4px',
            }}
            type={'down'}
          />{' '}
          正常
        </div>
        <div>调整原因</div>
        <Text state={1}>任务调整，暂缓3天，所以修改为正常</Text>
        <Text state={2}>李钟硕 于2023-08-14</Text>
      </PopoverWrap>
    )
  }
  const colum = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 250,
      render: (text: any, record: any) => {
        return (
          <CommonUserAvatar
            size="large"
            avatar={''}
            name={text}
            positionName={'前端开发工程师'}
          />
        )
      },
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      width: 180,
      render: (text: any, record: any) => {
        return (
          <CanOperation>
            <IconFont
              style={{
                fontSize: 20,
                //   color: props.detail?.priority?.color,
                marginRight: 4,
              }}
              type={''}
            />
            <span className="text">{text || '--'}</span>
          </CanOperation>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 150,
      render: (text: any, record: any) => {
        return (
          <>
            <StatusWrap
              state={
                record.category_status?.is_start === 1 &&
                record.category_status?.is_end === 2
                  ? 1
                  : record.category_status?.is_end === 1 &&
                    record.category_status?.is_start === 2
                  ? 2
                  : record.category_status?.is_start === 2 &&
                    record.category_status?.is_end === 2
                  ? 3
                  : 0
              }
            />
            {record.category_status?.status?.content || 999}
          </>
        )
      },
    },
    {
      title: '是否逾期',
      dataIndex: 'state',
      width: 250,
      render: (text: any, record: any) => {
        return (
          <StateWrap>
            <State state={text} onClick={() => text === 3 && setState(true)}>
              123
            </State>
            {text === 2 && (
              <Popover
                placement="bottomRight"
                getPopupContainer={node => node}
                content={content}
                trigger="click"
              >
                <IconFont
                  style={{
                    fontSize: 14,
                    marginLeft: 8,
                  }}
                  type={'down'}
                />
              </Popover>
            )}
          </StateWrap>
        )
      },
    },
  ]

  const onConfirm = () => {
    if (value) {
      setState(false)
    }
  }
  return (
    <>
      <ResizeTable
        isSpinning={false}
        dataWrapNormalHeight="calc(100% - 48px)"
        col={colum}
        dataSource={[
          {
            name: 'zcm12',
            state: 1,
            category_status: {
              is_start: 1,
              is_end: 2,
              status: {
                content: '1233',
              },
            },
          },
          {
            name: 'zcm22',
            state: 2,
            category_status: {
              is_start: 2,
              is_end: 1,
              status: {
                content: '1233',
              },
            },
          },
          {
            name: 'zcm32',
            state: 3,
            category_status: {
              is_start: 2,
              is_end: 2,
              status: {
                content: '1233',
              },
            },
          },
        ]}
      />
      <CommonModal
        isVisible={state}
        title={'调整逾期'}
        confirmText={'改为正常'}
        onClose={() => setState(false)}
        onConfirm={() => onConfirm()}
      >
        <Text state={3}>调整原因</Text>
        <InputStyle
          value={value}
          rows={6}
          placeholder="请输入调整原因"
          onChange={(e: any) => setValue(e.target.value)}
        />
      </CommonModal>
    </>
  )
}
export default TableLeft
