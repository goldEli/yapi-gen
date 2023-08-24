import ResizeTable from '@/components/ResizeTable'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import NoData from '@/components/NoData'
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
import { useTranslation } from 'react-i18next'
import { useSelector } from '@store/index'
import { getMessage } from '@/components/Message'
const TableLeft = (props: { data: any; updateOverdue: (val: any) => void }) => {
  const [state, setState] = useState(false)
  const [value, setValue] = useState('')
  const [openDemandDetail] = useOpenDemandDetail()
  const [row, setRow] = useState<any>({})
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const content = (row: any) => {
    return (
      <PopoverWrap>
        <div style={{ marginBottom: 12 }}>
          {t('overdue')}
          {row.exceed_day_num}
          {t('sky')}
          <IconFont
            style={{
              fontSize: 14,
              margin: '0 4px',
            }}
            type={'right-md'}
          />
          {t('normal')}
        </div>
        <div>{t('reasonForAdjustment')}</div>
        <Text state={1}>{row.normal_reason.reason}</Text>
        <Text state={2}>
          {row.normal_reason.operator_name} {t('at')}
          {''} {row.normal_reason.operator_time}{' '}
        </Text>
      </PopoverWrap>
    )
  }
  const colum = [
    {
      title: t('name'),
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
      title: t('missionName'),
      dataIndex: 'name',
      width: 180,
      render: (text: any, record: any) => {
        return (
          <CanOperation
            onClick={() => {
              // type 不传是需求，1是事务，2是缺陷
              // project_type === 1 迭代  project_type === 2 cc  project_type === 1 && isBug=== 1 就是缺陷
              record.story.project_type === 1 &&
              record.story.project_category.isBug === 1
                ? openDemandDetail(
                    { ...record },
                    record.project_id,
                    record.story_id,
                    2,
                  )
                : record.story.project_type === 2
                ? openDemandDetail(
                    { ...record },
                    record.project_id,
                    record.story_id,
                    1,
                  )
                : openDemandDetail(
                    { ...record },
                    record.project_id,
                    record.story_id,
                  )
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
      title: t('state'),
      dataIndex: 'state',
      width: 150,
      render: (text: any, record: any) => {
        return (
          <>
            <StatusWrap
              state={
                record.story.category_status?.is_start === 1 &&
                record.story.category_status?.is_end === 2
                  ? 1
                  : record.story.category_status?.is_end === 1 &&
                    record.story.category_status?.is_start === 2
                  ? 2
                  : record.story.category_status?.is_start === 2 &&
                    record.story.category_status?.is_end === 2
                  ? 3
                  : 0
              }
            />
            {record.story.category_status?.status?.content}
          </>
        )
      },
    },
    {
      title: t('isItOverdue'),
      dataIndex: 'status',
      width: 250,
      render: (text: any, record: any) => {
        return (
          <StateWrap>
            <State
              state={
                record.is_normal === 1
                  ? false
                  : record.is_normal === 2 && record.exceed_day_num > 0
                  ? true
                  : false
              }
              onClick={() => {
                if (
                  !projectInfo.projectPermissions
                    ?.map((item: { identity: any }) => item.identity)
                    ?.includes('b/story/work_time')
                ) {
                  getMessage({ type: 'error', msg: '你暂无编辑权限' })
                  return
                }
                if (record.is_normal === 2 && record.exceed_day_num > 0) {
                  setState(true)
                  setRow(record)
                  setValue('')
                }
              }}
            >
              {record.is_normal === 1
                ? t('normal') + '(' + t('adjustment') + ')'
                : record.is_normal === 2 && record.exceed_day_num > 0
                ? `${t('overdue')}${record.exceed_day_num}${t('sky')}`
                : t('normal')}
            </State>
            {record.is_normal === 1 ? (
              <Popover
                placement="bottomRight"
                getPopupContainer={node => node}
                content={() => content(record)}
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
      title: t('startingTime'),
      dataIndex: 'start_at',
      width: 120,
      render: (text: any) => {
        return <>{text || '--'}</>
      },
    },
    {
      title: t('endTime'),
      dataIndex: 'end_at',
      width: 120,
      render: (text: any) => {
        return <>{text || '--'}</>
      },
    },
  ]

  const onConfirm = () => {
    if (value) {
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
        dataWrapNormalHeight="calc(100% - 0px)"
        col={colum}
        noData={<NoData />}
        dataSource={props.data}
      />
      <CommonModal
        isVisible={state}
        title={t('adjustOverdue')}
        confirmText={t('changeToNormal')}
        onClose={() => setState(false)}
        onConfirm={() => onConfirm()}
      >
        <Text state={3}>{t('reasonForAdjustment')}</Text>
        <InputStyle
          value={value}
          rows={6}
          placeholder={t('pleaseEnterTheReasonForTheAdjustment')}
          onChange={(e: any) => setValue(e.target.value)}
        />
      </CommonModal>
    </>
  )
}
export default TableLeft
