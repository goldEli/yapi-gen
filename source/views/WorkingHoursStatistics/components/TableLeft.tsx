import ResizeTable from '@/components/ResizeTable'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
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
const TableLeft = (props: { data: any; updateOverdue: (val: any) => void }) => {
  const [state, setState] = useState(false)
  const [value, setValue] = useState('')
  const [openDemandDetail] = useOpenDemandDetail()
  const [row, setRow] = useState<any>({})
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
            type={'right-md'}
          />
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
      dataIndex: 'user',
      width: 250,
      render: (text: any, record: any) => {
        return (
          <CommonUserAvatar
            size="large"
            avatar={record.user.avatar}
            name={record.user.name}
            positionName={record.user.position.name}
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
          <CanOperation
            onClick={() => {
              // type 不传是需求，1是事务，2是缺陷
              openDemandDetail({ ...record }, record.projectId, record.id, 1)
            }}
          >
            <img
              src={record.story.category_attachment}
              style={{ marginRight: 4, width: 20, height: 20 }}
            />
            <span className="text">{record.story.name || '--'}</span>
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
            {record.category_status?.status?.content}
          </>
        )
      },
    },
    {
      title: '是否逾期',
      dataIndex: 'status',
      width: 250,
      render: (text: any, record: any) => {
        return (
          <StateWrap>
            <State
              state={record.exceed_day_num > 0}
              onClick={() => {
                if (record.exceed_day_num > 0) {
                  setState(true)
                  setRow(record)
                  setValue('')
                }
              }}
            >
              {record.exceed_day_num > 0
                ? `逾期${record.exceed_day_num}天`
                : record.is_normal === 1
                ? '正常 (调整)'
                : '正常'}
            </State>
            {record.exceed_day_num === 0 && record.is_normal === 1 ? (
              <Popover
                placement="bottomRight"
                getPopupContainer={node => node}
                content={content}
                trigger="click"
              >
                <IconFont
                  className="icon"
                  style={{
                    fontSize: 14,
                    marginLeft: 8,
                    color: 'var(--neutral-n4)',
                  }}
                  type={'down-icon'}
                />
              </Popover>
            ) : null}
          </StateWrap>
        )
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_at',
      width: 120,
      render: (text: any) => {
        return <>{text}</>
      },
    },
    {
      title: '结束时间',
      dataIndex: 'end_at',
      width: 120,
      render: (text: any) => {
        return <>{text}</>
      },
    },
  ]

  const onConfirm = () => {
    if (value) {
      console.log(row)
      setState(false)
      props.updateOverdue({
        story_id: row.story?.id,
        user_id: row.user.id,
        normal_reason: value,
      })
    }
  }
  return (
    <>
      <ResizeTable
        styleSate={true}
        isSpinning={false}
        dataWrapNormalHeight="calc(100% - 48px)"
        col={colum}
        dataSource={props.data}
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
