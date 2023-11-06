/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undefined */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-handler-names */

// 公用需求列表表格

import IconFont from '@/components/IconFont'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import {
  ClickWrap,
  HiddenText,
  ListNameWrap,
  PriorityWrapTable,
} from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import ChildDemandTable from '@/components/ChildDemandTable'
import { Progress, Tooltip } from 'antd'
import { useSelector } from '@store/index'
import { getMessage } from '../Message'
import TableQuickEdit from '../TableQuickEdit'
import TableColorText from '../TableColorText'
import ChangeStatusPopover from '../ChangeStatusPopover/index'
import StateTag from '../StateTag'
import ChangePriorityPopover from '../ChangePriorityPopover'
import DemandProgress from '../DemandProgress'
import { getCustomNormalValue, copyLink } from '@/tools'
import MultipleAvatar from '../MultipleAvatar'
import CommonIconFont from '../CommonIconFont'
import ChangeSeverityPopover from '../ChangeSeverityPopover'
import CommonProgress from '../CommonProgress'
import { encryptPhp } from '@/tools/cryptoPhp'
export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) =>
        i.name === (projectInfo.projectType === 1 ? '编辑需求' : '编辑事务'),
    )?.length > 0

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

  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  const onUpdate = (row: any, isClass?: any) => {
    state.onUpdate(true, row.topId, isClass)
  }
  //  点击复制链接
  const onCopy = (row: any) => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = `${window.origin}${import.meta.env.__URL_HASH__}`
    let params: any = {
      id: row.projectId || row.project_id,
      detailId: row.id,
      isOpenScreenDetail: true,
    }
    let url = ''
    if (state.type === 3) {
      params.specialType = 1
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectDetail/Affair?data=${resultParams}`
    } else if (state.type === 2) {
      params.specialType = 2
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectDetail/Defect?data=${resultParams}`
    } else if (state.type === 1) {
      params.specialType = 3
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectDetail/Demand?data=${resultParams}`
    }

    text += `【${row.storyPrefixKey}-${row.name}】 ${beforeUrl}${url} \n`
    copyLink(text, t('common.copySuccess'), t('common.copyFail'))
  }

  const arr = [
    {
      width: 140,
      title: <NewSort fixedKey="story_prefix_key">{t('serialNumber')}</NewSort>,
      dataIndex: 'storyPrefixKey',
      key: 'prefix_key',
      render: (text: string, record: any) => {
        return (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ClickWrap
              className="canClickDetail"
              isClose={record.status?.is_end === 1}
            >
              <div className="text" onClick={() => state.onClickItem(record)}>
                {record.storyPrefixKey}
              </div>
              <div className="icon">
                <CommonIconFont
                  color="var(--neutral-n4)"
                  type="share"
                  size={20}
                  onClick={() => onCopy(record)}
                />
              </div>
            </ClickWrap>
            {record.isExamine && <CommonIconFont type="review" size={40} />}
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
              position: 'relative',
              paddingLeft: record.level ? (Number(record.level) - 1) * 24 : 0,
            }}
          >
            {state.isTree && state.onChangeTree(record)}
            <Tooltip placement="top" title={record.category}>
              <img
                src={
                  record.category_attachment ? record.category_attachment : ' '
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
              onUpdate={() => onUpdate(record)}
              isDemandName
              isBug={state.type === 2}
            >
              <Tooltip title={text} getPopupContainer={node => node}>
                <ListNameWrap
                  className="canClickDetail"
                  isName
                  isClose={record.status?.is_end === 1}
                  onClick={() => state.onClickItem(record)}
                >
                  <TableColorText
                    text={text}
                    level={Number(record.level) - 1}
                  />
                </ListNameWrap>
              </Tooltip>
            </TableQuickEdit>
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (text: any, record: any) => {
        return (
          <ChangeStatusPopover
            isCanOperation={isCanEdit && !record.isExamine}
            projectId={state.projectId}
            record={record}
            onChangeStatus={item => state.onChangeStatus(item, record)}
            type={record.project_type === 1 ? (record.is_bug === 1 ? 3 : 1) : 2}
          >
            <StateTag
              onClick={record.isExamine ? onExamine : void 0}
              isShow={isCanEdit || record.isExamine}
              name={record.status.status.content}
              state={
                text?.is_start === 1 && text?.is_end === 2
                  ? 1
                  : text?.is_end === 1 && text?.is_start === 2
                  ? 2
                  : text?.is_start === 2 && text?.is_end === 2
                  ? 3
                  : 0
              }
            />
          </ChangeStatusPopover>
        )
      },
    },
    {
      title: <NewSort fixedKey="priority">{t('common.priority')}</NewSort>,
      dataIndex: 'priority',
      key: 'priority',
      width: 160,
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <ChangePriorityPopover
            isCanOperation={
              isCanEdit &&
              Object.keys(record.categoryConfigList).includes('priority')
            }
            onChangePriority={item => state.onChangeState(item, record)}
            record={{ project_id: state.projectId, id: record.id }}
          >
            <PriorityWrapTable isShow={isCanEdit}>
              {text?.icon && (
                <>
                  <IconFont
                    className="priorityIcon"
                    type={text?.icon}
                    style={{
                      fontSize: 20,
                      color: text?.color,
                    }}
                  />
                  <span>{text.content_txt}</span>
                </>
              )}
              <span style={{ marginLeft: '5px' }}>
                {!text?.icon && <span>--</span>}
                <IconFont
                  style={{ color: 'var(--neutral-n4)' }}
                  className="icon"
                  type="down-icon"
                />
              </span>
            </PriorityWrapTable>
          </ChangePriorityPopover>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="child_story_count">
          {projectInfo.projectType === 2
            ? t('subtransaction')
            : state?.type === 2
            ? t('other.children')
            : t('common.childDemand')}
        </NewSort>
      ),
      dataIndex: 'demand',
      key: 'child_story_count',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <>
            {state.showChildCOntent && !state.isTree && (
              <ChildDemandTable value={text} row={record} />
            )}
            {(!state.showChildCOntent || state.isTree) && (
              <span>{text || 0}</span>
            )}
          </>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="iterate_name">
          {projectInfo.projectType === 2 ? t('sprint2') : t('common.iterate')}
        </NewSort>
      ),
      dataIndex: 'iteration',
      key: 'iterate_name',
      width: 100,
      render: (text: string, record: any) => {
        return (
          <>
            {[3, 6].includes(record.work_type) ? (
              <>{text || '--'}</>
            ) : (
              <TableQuickEdit
                type="fixed_radio"
                defaultText={text}
                keyText="iterate_id"
                item={record}
                onUpdate={() => onUpdate(record)}
                isBug={state.type === 2}
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
            )}
          </>
        )
      },
    },
    {
      title: <NewSort fixedKey="class">{t('other.class')}</NewSort>,
      dataIndex: 'class',
      key: 'class',
      width: 120,
      render: (text: any, record: any) => {
        return (
          <TableQuickEdit
            type="treeSelect"
            defaultText={text}
            keyText="class_id"
            item={record}
            onUpdate={() => onUpdate(record, true)}
            isBug={state.type === 2}
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
            onUpdate={() => onUpdate(record)}
            isBug={state.type === 2}
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
      title: <NewSort fixedKey="user_name">{t('common.createName')}</NewSort>,
      dataIndex: 'userName',
      key: 'user_name',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <MultipleAvatar
            max={1}
            list={[
              {
                avatar: record.userAvatar,
                id: record.userIds,
                name: record.userName,
              },
            ]}
          />
        )
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
      key: 'users_name',
      width: 140,
      render: (text: any, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_select"
            defaultText={
              projectInfoValues
                ?.filter((i: any) => i.key === 'users_name')[0]
                ?.children?.filter((i: any) => i.id !== -1)
                .filter((k: any) => k.status === 1)
                .map((l: any) => l.id)
                .filter((l: any) => record?.usersNameIds.includes(l)) || []
            }
            keyText="users"
            item={record}
            onUpdate={() => onUpdate(record)}
            isBug={state.type === 2}
          >
            {record?.usersInfo.length > 0 && (
              <MultipleAvatar
                max={3}
                list={record?.usersInfo?.map((i: any) => {
                  return {
                    id: i.id,
                    name: i.name,
                    avatar: i.avatar,
                  }
                })}
              />
            )}
            {!record?.usersInfo?.length && '--'}
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="schedule">{t('situation.progress')}</NewSort>,
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <div>
            <CommonProgress
              isTable
              percent={Number(text)}
              id={record.id}
              project_id={record.project_id}
            />
          </div>
        )
      },
    },
    {
      title: t('common.copySend'),
      dataIndex: 'usersCopySendName',
      key: 'users_copysend_name',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_select"
            defaultText={record?.usersCopySendIds || []}
            keyText="copysend"
            item={record}
            onUpdate={() => onUpdate(record)}
            isBug={state.type === 2}
          >
            {record?.copy_send_users?.length > 0 && (
              <MultipleAvatar
                max={3}
                list={record?.copy_send_users?.map((i: any) => ({
                  id: i.id,
                  name: i.name,
                  avatar: i.avatar,
                }))}
              />
            )}
            {!record?.copy_send_users?.length && '--'}
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
      width: 170,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="date"
            defaultText={text}
            keyText="expected_start_at"
            item={record}
            onUpdate={() => onUpdate(record)}
            value={['datetime']}
            isBug={state.type === 2}
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
      width: 170,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="date"
            defaultText={text}
            keyText="expected_end_at"
            item={record}
            onUpdate={() => onUpdate(record)}
            value={['datetime']}
            isBug={state.type === 2}
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
      title: <NewSort fixedKey="solution">{t('other.resolvent')}</NewSort>,
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
            onUpdate={() => onUpdate(record)}
            projectId={state.projectId}
            isBug={state.type === 2}
          >
            <span className="controlMaxWidth">{text ? text : '--'}</span>
          </TableQuickEdit>
        )
      },
    },
    {
      title: <NewSort fixedKey="severity">{t('other.severity')}</NewSort>,
      dataIndex: 'severity',
      key: 'severity',
      width: 110,
      render: (text: any, record: any) => {
        return (
          <ChangeSeverityPopover
            isCanOperation={
              isCanEdit &&
              Object.keys(record.categoryConfigList).includes('severity')
            }
            onChangeSeverity={item => state.onChangeSeverity(item, record)}
            record={record}
            projectId={state.projectId}
          />
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="discovery_version">
          {t('other.discovery_version')}
        </NewSort>
      ),
      dataIndex: 'discovery_version',
      key: 'discovery_version',
      width: 160,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="fixed_radio"
            defaultText={text}
            keyText="discovery_version"
            item={record}
            onUpdate={() => onUpdate(record)}
            isBug={state.type === 2}
          >
            <HiddenText>
              <OmitText
                width={160}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {record.discovery_version || '--'}
              </OmitText>
            </HiddenText>
          </TableQuickEdit>
        )
      },
    },
  ]
  const getArr = () => {
    const result: any = []
    projectInfo?.plainOptions3?.forEach((element: any) => {
      const currentFields = projectInfo?.filterCustomList?.filter(
        (i: any) => i.content === element.value,
      )?.[0]
      result.push({
        width: 180,
        title: (
          <div>
            {!['user_select_checkbox', 'select_checkbox', 'checkbox'].includes(
              currentFields?.attr,
            ) && <NewSort fixedKey={element.value}>{element.label}</NewSort>}
            {['user_select_checkbox', 'select_checkbox', 'checkbox'].includes(
              currentFields?.attr,
            ) && element.label}
          </div>
        ),
        dataIndex: element.value,
        key: element.value,
        render: (text: any, record: any) => {
          return (
            <TableQuickEdit
              type={currentFields?.attr}
              defaultText={text?.value}
              keyText={element.value}
              item={{
                ...record,
                ...{ fieldContentValue: currentFields.values },
              }}
              onUpdate={() => onUpdate(record)}
              remarks={currentFields?.remarks}
              isCustom
              defaultTextValues={text?.true_value}
              isBug={state.type === 2}
            >
              <span>{getCustomNormalValue(currentFields?.attr, text)}</span>
            </TableQuickEdit>
          )
        },
      })
    })

    return arr.slice(0, -5).concat(result.concat(arr.slice(-5)))
  }

  const endResult = getArr()

  return endResult
}
