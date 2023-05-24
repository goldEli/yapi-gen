/* eslint-disable react/jsx-handler-names */
// 公用我的/他的需求列表表格
import IconFont from '@/components/IconFont'
import {
  ClickWrap,
  HiddenText,
  ListNameWrap,
  SeverityWrap,
  ShowWrap,
} from '@/components/StyleCommon'
import Sort from '@/components/Sort'
import ChildDemandTable from '@/components/ChildDemandTable'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'
import { message, Progress, Tooltip } from 'antd'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { getMessage } from '../Message'
import TableQuickEdit from '../TableQuickEdit'
import ChangeStatusPopover from '../ChangeStatusPopover/index'
import StateTag from '../StateTag'
import ChangePriorityPopover from '../ChangePriorityPopover'
import DemandProgress from '../DemandProgress'
import { getCustomNormalValue } from '@/tools'
import ChangeSeverityPopover from '../ChangeSeverityPopover'

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
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
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
      width: 140,
      title: <NewSort fixedKey="story_prefix_key">{t('serialNumber')}</NewSort>,
      dataIndex: 'storyPrefixKey',
      key: 'prefix_key',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClickWrap
              className="canClickDetail"
              onClick={() => state.onClickItem(record)}
              isClose={record.status?.is_end === 1}
            >
              {record.storyPrefixKey}
            </ClickWrap>
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      width: 400,
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
              <ListNameWrap
                isName
                className="canClickDetail"
                isClose={record.status?.is_end === 1}
                onClick={() => state.onClickItem(record)}
              >
                <Tooltip title={text} getPopupContainer={node => node}>
                  <span className="controlMaxWidth">{text}</span>
                </Tooltip>
                {record.is_handover === 1 && (
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '20px',
                      textAlign: 'center',
                      color: 'var( --function-warning)',
                      width: '60px',
                      height: '20px',
                      background: 'rgba(250,151,70,0.1)',
                      borderRadius: '10px 6px 6px 10px',
                      marginLeft: '4px',
                    }}
                  >
                    {t('quitAndHandover')}
                  </div>
                )}

                {record.new === 1 && (
                  <IconFont
                    style={{
                      marginLeft: '4px',
                      fontSize: '30px',
                    }}
                    type="tag"
                  />
                )}
              </ListNameWrap>
            </TableQuickEdit>
          </div>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="child_story_count">
          {state.projectType === 2 ? '子事务' : t('common.childDemand')}
        </NewSort>
      ),
      dataIndex: 'demand',
      key: 'child_story_count',
      width: 120,
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
      width: 180,
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
                {text?.icon && (
                  <IconFont
                    className="priorityIcon"
                    type={text?.icon}
                    style={{
                      fontSize: 20,
                      color: text?.color,
                    }}
                  />
                )}
                {!text?.icon && <span style={{ marginLeft: '5px' }}>--</span>}
              </Wrap>
              {!(
                record.project?.isPublic !== 1 && !record.project?.isUserMember
              ) && (
                <ShowWrap>
                  <IconFont
                    style={{ color: 'var(--primary-d2)' }}
                    type="down-icon"
                  />
                </ShowWrap>
              )}
            </Wrap>
          </ChangePriorityPopover>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="iterate_name">
          {state.projectType === 2 ? '冲刺' : t('common.iterate')}
        </NewSort>
      ),
      dataIndex: 'iteration',
      key: 'iterate_name',
      width: 120,
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
      title: <NewSort fixedKey="class">分类</NewSort>,
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
      width: 120,
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
      width: 190,
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
            // record={record}
            // onChangeStatus={(value: any) => state.updateStatus(value, record)}
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
              name={record.status.status.content}
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
      width: 120,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
      key: 'users_name',
      width: 180,
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
      title: <NewSort fixedKey="schedule">进度</NewSort>,
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
                  <DemandProgress
                    value={record.schedule}
                    row={record}
                    onUpdate={onUpdate}
                    index={index}
                  />
                </div>
              )}
            {!(
              record?.usersNameIds?.includes(userInfo?.id) &&
              record.status.is_start !== 1 &&
              record.status.is_end !== 1
            ) && (
              <Progress
                strokeColor="var(--function-success)"
                style={{
                  color: 'var(--function-success)',
                  cursor: 'not-allowed',
                }}
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
      width: 200,
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
      width: 200,
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
      width: 200,
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
      width: 200,
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
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="finish_at">{t('common.finishTime')}</NewSort>,
      dataIndex: 'finishTime',
      key: 'finish_at',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="solution">解决方法</NewSort>,
      dataIndex: 'solution',
      key: 'solution',
      width: 200,
      render: (text: string | number, record: any) => {
        return (
          <TableQuickEdit
            type="text"
            defaultText={text}
            keyText="solution"
            item={record}
            onUpdate={onUpdate}
            projectId={state.projectId}
          >
            <Tooltip title={text} getPopupContainer={node => node}>
              <span className="controlMaxWidth">{text}</span>
            </Tooltip>
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="severity">严重程度</NewSort>,
      dataIndex: 'severity',
      key: 'severity',
      width: 200,
      render: (text: any, record: any) => {
        return (
          <ChangeSeverityPopover
            isCanOperation={
              !(
                record.project?.isPublic !== 1 && !record.project?.isUserMember
              ) && Object.keys(record.categoryConfigList).includes('priority')
            }
            onChangeSeverity={item => state.onChangeSeverity(item, record)}
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
                {text?.id && (
                  <SeverityWrap style={{ background: '#FA9746' }}>
                    严重
                  </SeverityWrap>
                )}
                {!text?.id && <span style={{ marginLeft: '5px' }}>--</span>}
              </Wrap>
              {!(
                record.project?.isPublic !== 1 && !record.project?.isUserMember
              ) && (
                <ShowWrap>
                  <IconFont
                    style={{ color: 'var(--primary-d2)' }}
                    type="down-icon"
                  />
                </ShowWrap>
              )}
            </Wrap>
          </ChangeSeverityPopover>
        )
      },
    },
    {
      title: <NewSort fixedKey="discovery_version">发现版本</NewSort>,
      dataIndex: 'discovery_version',
      key: 'discovery_version',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_radio"
            defaultText={text}
            keyText="discovery_version"
            item={record}
            onUpdate={onUpdate}
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