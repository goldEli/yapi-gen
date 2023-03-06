/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
// 公用我的/他的需求列表表格

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-handler-names */
import IconFont from '@/components/IconFont'
import {
  ClickWrap,
  StyledShape,
  CategoryWrap,
  HiddenText,
  ListNameWrap,
  ShowWrap,
} from '@/components/StyleCommon'
import Sort from '@/components/Sort'
import ChildDemandTable from '@/components/ChildDemandTable'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'
import { getCustomNormalValue } from '@/tools'
import { message, Progress, Tooltip } from 'antd'

// import DemandProgress from '@/components/DemandProgress'
import TableQuickEdit from './TableQuickEdit'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import ChangeStatusPopover from './ChangeStatusPopover'
import ChangePriorityPopover from './ChangePriorityPopover'
import useOpenDemandDetail from '@/hooks/useOpenDemandDeatil'
import StateTag from './StateTag'

const Wrap = styled.div<{ isEdit?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
  },
  ({ isEdit }) => ({
    cursor: isEdit ? 'inherit' : 'pointer',
  }),
)

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
  const { userInfo } = useSelector(store => store.user)

  const onExamine = () => {
    message.warning(t('newlyAdd.underReview'))
  }

  const NewSort = (props: any) => {
    return (
      <Sort
        fixedKey={props.fixedKey}
        onChangeKey={state.updateOrderkey}
        nowKey={state.orderKey}
        order={state.order}
      >
        {props.children}
      </Sort>
    )
  }

  const onUpdate = () => {
    state.init(true)
  }

  const arr = [
    {
      width: 100,
      title: <NewSort fixedKey="id">ID</NewSort>,
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClickWrap
              onClick={() => state.onClickItem(record)}
              isClose={record.status?.is_end === 1}
            >
              {text}
            </ClickWrap>
            {record.isExamine && (
              <IconFont
                type="review"
                style={{
                  fontSize: 46,
                }}
              />
            )}
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Tooltip placement="top" title={record.category}>
              <img
                src={
                  record.category_attachment
                    ? record.category_attachment
                    : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
                }
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '8px',
                }}
                alt=""
              />
            </Tooltip>
            <TableQuickEdit
              type="text"
              defaultText={text}
              keyText="name"
              item={record}
              onUpdate={onUpdate}
              isMineOrHis
              projectId={state.projectId}
              isDemandName
            >
              <Tooltip title={text} getPopupContainer={node => node}>
                <ListNameWrap
                  isName
                  isClose={record.status?.is_end === 1}
                  onClick={() => state.onClickItem(record)}
                >
                  {text}
                  {record.new === 2 && (
                    <IconFont
                      style={{
                        marginLeft: '4px',
                        fontSize: '30px',
                      }}
                      type="tag"
                    />
                  )}
                </ListNameWrap>
              </Tooltip>
            </TableQuickEdit>
          </div>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="child_story_count">
          {t('common.childDemand')}
        </NewSort>
      ),
      dataIndex: 'demand',
      key: 'child_story_count',
      render: (text: string, record: any) => {
        return (
          <ChildDemandTable
            id={record.project_id}
            value={text}
            row={record}
            isMineOrHis
          />
        )
      },
    },
    {
      title: <NewSort fixedKey="priority">{t('common.priority')}</NewSort>,
      dataIndex: 'priority',
      key: 'priority',
      render: (text: any, record: any) => {
        return (
          <ChangePriorityPopover
            isCanOperation={
              !(
                record.project?.isPublic !== 1 && !record.project?.isUserMember
              ) && Object.keys(record.categoryConfigList).includes('priority')
            }
            onChangePriority={item => state.updatePriority(item, record)}
            record={record}
            projectId={state.projectId}
          >
            <Wrap
              isEdit={
                record.project?.isPublic !== 1 && !record.project?.isUserMember
              }
            >
              <Wrap
                isEdit={
                  record.project?.isPublic !== 1 &&
                  !record.project?.isUserMember
                }
              >
                <IconFont
                  type={text?.icon}
                  style={{
                    fontSize: 20,
                    marginRight: '8px',
                    color: text?.color,
                  }}
                />
                <span style={{ marginRight: '5px' }}>
                  {text?.content_txt || '--'}
                </span>
              </Wrap>
              {!(
                record.project?.isPublic !== 1 && !record.project?.isUserMember
              ) && (
                <ShowWrap>
                  <IconFont style={{ color: '#2877ff' }} type="down-icon" />
                </ShowWrap>
              )}
            </Wrap>
          </ChangePriorityPopover>
        )
      },
    },
    {
      title: <NewSort fixedKey="iterate_name">{t('common.iterate')}</NewSort>,
      dataIndex: 'iteration',
      key: 'iterate_name',
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_radio"
            defaultText={text}
            keyText="iterate_id"
            item={record}
            onUpdate={onUpdate}
            isMineOrHis
            projectId={state.projectId}
          >
            {text || '--'}
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="class">{t('newlyAdd.demandClass')}</NewSort>,
      dataIndex: 'class',
      key: 'class',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="treeSelect"
            defaultText={text}
            keyText="class_id"
            item={record}
            onUpdate={onUpdate}
            isMineOrHis
            projectId={state.projectId}
          >
            <HiddenText>
              <OmitText
                width={120}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text || t('newlyAdd.unclassified')}
              </OmitText>
            </HiddenText>
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="tag">{t('common.tag')}</NewSort>,
      dataIndex: 'tag',
      key: 'tag',
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            keyText="tag"
            type="fixed_select"
            defaultText={text?.split(';') || []}
            item={record}
            onUpdate={onUpdate}
            isMineOrHis
            projectId={state.projectId}
          >
            <HiddenText>
              <OmitText
                width={120}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text || '--'}
              </OmitText>
            </HiddenText>
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      // eslint-disable-next-line complexity
      render: (text: any, record: any) => {
        return (
          <ChangeStatusPopover
            isCanOperation={
              !(
                record.isExamine ||
                (record.project?.isPublic !== 1 &&
                  !record.project?.isUserMember)
              )
            }
            projectId={record.project_id}
            record={record}
            onChangeStatus={(value: any) => state.updateStatus(value, record)}
          >
            <StateTag
              style={{
                width: 'fit-content',
                cursor:
                  record.project?.isPublic !== 1 &&
                  !record.project?.isUserMember
                    ? 'inherit'
                    : 'pointer',
              }}
              onClick={record.isExamine ? onExamine : void 0}
              state={
                record.status?.is_start === 1 && record.status?.is_end === 2
                  ? 1
                  : record.status?.is_end === 1 && record.status?.is_start === 2
                  ? 2
                  : record.status?.is_start === 2 && record.status?.is_end === 2
                  ? 3
                  : 0
              }
            />
          </ChangeStatusPopover>
        )
      },
    },
    {
      title: <NewSort fixedKey="user_name">{t('common.createName')}</NewSort>,
      dataIndex: 'userName',
      key: 'user_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
      key: 'users_name',
      render: (text: any, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_select"
            defaultText={record?.usersNameIds || []}
            keyText="users"
            item={record}
            onUpdate={onUpdate}
            isMineOrHis
            projectId={state.projectId}
          >
            <span>{text || '--'}</span>
          </TableQuickEdit>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="schedule">{t('newlyAdd.demandProgress')}</NewSort>
      ),
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any, index: any) => {
        return (
          <>
            {record?.usersNameIds?.includes(userInfo?.id) &&
              record.status.is_start !== 1 &&
              record.status.is_end !== 1 && (
                <div style={{ cursor: 'pointer' }}>
                  12
                  {/* <DemandProgress
                    value={record.schedule}
                    row={record}
                    onUpdate={onUpdate}
                    index={index}
                  /> */}
                </div>
              )}
            {!(
              record?.usersNameIds?.includes(userInfo?.id) &&
              record.status.is_start !== 1 &&
              record.status.is_end !== 1
            ) && (
              <Progress
                strokeColor="#43BA9A"
                style={{ color: '#43BA9A', cursor: 'not-allowed' }}
                width={38}
                type="line"
                percent={record.schedule}
                format={percent => (percent === 100 ? '100%' : `${percent}%`)}
                strokeWidth={4}
              />
            )}
          </>
        )
      },
    },
    {
      title: t('common.copySend'),
      dataIndex: 'usersCopySendName',
      key: 'users_copysend_name',
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_select"
            defaultText={record?.usersCopySendIds || []}
            keyText="copysend"
            item={record}
            onUpdate={onUpdate}
            isMineOrHis
            projectId={state.projectId}
          >
            <span>{text || '--'}</span>
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="created_at">{t('common.createTime')}</NewSort>,
      dataIndex: 'time',
      key: 'created_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="expected_start_at">
          {t('common.expectedStart')}
        </NewSort>
      ),
      dataIndex: 'expectedStart',
      key: 'expected_start_at',
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="date"
            defaultText={text}
            keyText="expected_start_at"
            item={record}
            onUpdate={onUpdate}
            value={['datetime']}
            isMineOrHis
            projectId={state.projectId}
          >
            <span>{text || '--'}</span>
          </TableQuickEdit>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="expected_end_at">{t('common.expectedEnd')}</NewSort>
      ),
      dataIndex: 'expectedEnd',
      key: 'expected_end_at',
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="date"
            defaultText={text}
            keyText="expected_end_at"
            item={record}
            onUpdate={onUpdate}
            value={['datetime']}
            isMineOrHis
            projectId={state.projectId}
          >
            <span>{text || '--'}</span>
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="updated_at">{t('common.lastTime')}</NewSort>,
      dataIndex: 'updatedTime',
      key: 'updated_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="finish_at">{t('common.finishTime')}</NewSort>,
      dataIndex: 'finishTime',
      key: 'finish_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]

  const getArr = () => {
    const result: any = []
    state.plainOptions3?.forEach((element: any) => {
      result.unshift({
        width: 200,
        title: (
          <div>
            {!['user_select_checkbox', 'select_checkbox', 'checkbox'].includes(
              element?.attr,
            ) && <NewSort fixedKey={element.value}>{element.label}</NewSort>}
            {['user_select_checkbox', 'select_checkbox', 'checkbox'].includes(
              element?.attr,
            ) && element.label}
          </div>
        ),
        dataIndex: element.value,
        key: element.value,
        render: (text: any, record: any) => {
          return (
            <TableQuickEdit
              defaultText={text?.value}
              keyText={element.value}
              item={record}
              onUpdate={onUpdate}
              isCustom
              isMineOrHis
              type={record[element.value]?.attr}
              projectId={state.projectId}
            >
              <span>
                {getCustomNormalValue(record[element.value]?.attr, text)}
              </span>
            </TableQuickEdit>
          )
        },
      })
    })

    return arr.slice(0, -5).concat(result.concat(arr.slice(-5)))
  }

  return getArr()
}
