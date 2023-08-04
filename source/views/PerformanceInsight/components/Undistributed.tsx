/* eslint-disable no-constant-binary-expression */
import { copyLink } from '@/tools'
import { useSelector } from '@store/index'
import MoreDropdown from '@/components/MoreDropdown'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { Menu, Tooltip, Progress } from 'antd'
import { useTranslation } from 'react-i18next'
import { createRef, useEffect, useMemo, useState } from 'react'
import TableColorText from '@/components/TableColorText'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import ChangeSeverityPopover from '@/components/ChangeSeverityPopover'
import ResizeTable from '@/components/ResizeTable'
import CommonButton from '@/components/CommonButton'
import NoData from '@/components/NoData'
import PaginationBox from '@/components/TablePagination'
import {
  HiddenText,
  ListNameWrap,
  PriorityWrapTable,
} from '@/components/StyleCommon'
import { updateFlawTableParams } from '@/services/flaw'
import DemandProgress from '@/components/DemandProgress'
import MultipleAvatar from '@/components/MultipleAvatar'
import { OmitText } from '@star-yun/ui'
import TableQuickEdit from '@/components/TableQuickEdit'
import ChildDemandTable from '@/components/ChildDemandTable'
import { getMessage } from '@/components/Message'
import IconFont from '@/components/IconFont'
import StateTag from '@/components/StateTag'
import Sort from '@/components/Sort'

const MenuWrap = styled(Menu)`
  border-radius: 6px;
  padding: 4px 0;
  li {
    height: 32px !important;
    line-height: 32px !important;
    margin: 0 !important;
    color: var(--neutral-n2) !important;
    background: var(---neutral-white-d3) !important;
  }
  li:hover {
    color: var(--neutral-n1-d1) !important;
    background: var(--hover-d3) !important;
  }
`
const DropdownMenu = (props: any) => {
  const [t] = useTranslation()
  // 复制需求id
  const onCopyId = () => {
    copyLink(
      `${props?.record.storyPrefixKey}`,
      t('copysuccess'),
      t('copyfailed'),
    )
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: props.record.project_id,
        detailId: props.record.id,
        specialType: 1,
        isOpenScreenDetail: true,
      }),
    )
    const url = `/SprintProjectManagement/Affair?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${props?.record.storyPrefixKey}】${text}`,
      t('common.copySuccess'),
      t('common.copyFail'),
    )
  }
  let menuItems = [
    {
      key: '5',
      label: <div onClick={onCopyId}>{t('copy_requirement_number')}</div>,
    },
    {
      key: '6',
      label: <div onClick={onCopyLink}>{t('copy_title_link')}</div>,
    },
  ]
  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}
const Undistributed = () => {
  const { userInfo } = useSelector(store => store.user)
  const [isSpinning, setIsSpinning] = useState(false)
  const { projectInfo, filterKeys, filterParams } = useSelector(
    store => store.project,
  )
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) =>
        i.name === (projectInfo.projectType === 1 ? '编辑需求' : '编辑事务'),
    )?.length > 0
  const [t] = useTranslation()
  const [isShowMore, setIsShowMore] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })

  const [data, setData] = useState({
    list: [],
    currentPage: 10,
    pageSize: 1,
    total: 1,
  })
  const onUpdateOrderKey = () => {}
  const onUpdate = (record?: any, type?: boolean) => {}
  // 修改优先级
  const onChangeState = async (item: any) => {
    try {
      // await updateFlawPriority({
      // id: props.detail.id,
      // priorityId: item.priorityId,
      // projectId: props.detail.projectId,
      // })
      getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
      onUpdate()
    } catch (error) {
      //
    }
  }

  // 修改严重程度
  const onChangeSeverity = async (item: any, type?: any) => {
    await updateFlawTableParams({
      // id: item.id,
      // projectId: props.detail.projectId,
      // otherParams: {
      //   severity: item.severity,
      // },
    })
    getMessage({ msg: t('successfullyModified'), type: 'success' })
    onUpdate()
  }
  // 冲刺的
  const a = [
    'prefix_key',
    'name',
    'status',
    'priority',
    'child_story_count',
    'iterate_name',
    'category',
    'user_name',
    'users_name',
    'created_at',
    'expected_start_at',
    'expected_end_at',
  ]
  const arr = [
    {
      width: 48,
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MoreDropdown
              isMoreVisible={isShowMore}
              menu={<DropdownMenu record={record} />}
              onChangeVisible={setIsShowMore}
            />
          </div>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="child_story_count">
          999
          {/* {projectInfo.projectType === 2
                ? t('subtransaction')
                : state?.type === 2
                ? t('other.children')
                : t('common.childDemand')} */}
        </NewSort>
      ),
      dataIndex: 'demand',
      key: 'child_story_count',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <>
            {/* {state.showChildCOntent && !state.isTree && ( */}
            <ChildDemandTable value={text} row={record} />
            {/* )} */}
            {/* {(!state.showChildCOntent || state.isTree) && ( */}
            <span>{text || 0}</span>
            {/* )} */}
          </>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="iterate_name">
          888
          {/* {projectInfo.projectType === 2 ? t('sprint2') : t('common.iterate')} */}
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
                // isBug={state.type === 2}
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
            // isBug={state.type === 2}
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
            // isBug={state.type === 2}
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
            defaultText={record?.usersNameIds || []}
            keyText="users"
            item={record}
            onUpdate={() => onUpdate(record)}
            // isBug={state.type === 2}
          >
            {record?.usersInfo.length > 0 && (
              <MultipleAvatar
                max={3}
                list={record?.usersInfo?.map((i: any) => ({
                  id: i.id,
                  name: i.name,
                  avatar: i.avatar,
                }))}
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
      render: (text: string, record: any, index: any) => {
        return (
          <div>
            {isCanEdit &&
              record?.usersNameIds?.includes(userInfo?.id) &&
              record.status.is_start !== 1 &&
              record.status.is_end !== 1 && (
                <div style={{ cursor: 'pointer' }}>
                  <DemandProgress
                    value={record.schedule}
                    row={record}
                    onUpdate={() => onUpdate(record)}
                    index={index}
                  />
                </div>
              )}
            {!(
              isCanEdit &&
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
            // isBug={state.type === 2}
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
            // isBug={state.type === 2}
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
            // isBug={state.type === 2}
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
            // projectId={state.projectId}
            // isBug={state.type === 2}
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
            onChangeSeverity={item => onChangeSeverity(item, record)}
            record={record}
            // projectId={state.projectId}
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
        // projectType === 2 在isBug
        return (
          <TableQuickEdit
            type="fixed_radio"
            defaultText={text}
            keyText="discovery_version"
            item={record}
            onUpdate={() => onUpdate(record)}
            // isBug={state.type === 2}
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
  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }
  const colum = [
    ...arr,
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.demandName')}
        </NewSort>
      ),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Tooltip title={record.categoryRemark}>
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

            <Tooltip title={text}>
              <ListNameWrap
                className="canClickDetail"
                isName
                isClose={record.status?.is_end === 1}
              >
                <TableColorText text={text} />
              </ListNameWrap>
            </Tooltip>
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
            isCanOperation={true && !record.isExamine}
            projectId={1}
            record={record}
            onChangeStatus={item => 123}
            type={record.project_type === 1 ? (record.is_bug === 1 ? 3 : 1) : 2}
          >
            <StateTag
              onClick={record.isExamine ? onExamine : void 0}
              isShow={true || record.isExamine}
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
      width: 100,
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <ChangePriorityPopover
            isCanOperation={
              true &&
              Object.keys(record.categoryConfigList).includes('priority')
            }
            onChangePriority={item => 123}
            record={{ project_id: record.projectId, id: record.id }}
          >
            <PriorityWrapTable isShow={true}>
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
                <IconFont className="icon" type="down-icon" />
              </span>
            </PriorityWrapTable>
          </ChangePriorityPopover>
        )
      },
    },
  ]
  // 勾选的id集合
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 需求勾选
  const onSelectChange = (record: any, selected: any) => {
    const resultKeys = selected
      ? [...selectedRowKeys, ...[record], ...(record.allChildrenIds || [])]
      : selectedRowKeys?.filter((i: any) => i.id !== record.id)
    setSelectedRowKeys([...new Set(resultKeys)])
    onOperationCheckbox('add', [...new Set(resultKeys)])
  }
  // 勾选或者取消勾选，显示数量 keys: 所有选择的数量，type： 添加还是移除
  const onOperationCheckbox = (type: any, keys?: any) => {
    const redClassElements = document.getElementsByClassName(
      'ant-checkbox-wrapper',
    )
    for (const i of redClassElements) {
      if (i.getElementsByClassName('tagLength')[0]) {
        i.removeChild(i.getElementsByClassName('tagLength')[0])
      }
      if (type === 'add' && keys?.length > 0) {
        const div2 = document.createElement('div')
        div2.innerText = String(keys.length)
        div2.className = 'tagLength'
        i.appendChild(div2)
      }
    }
  }
  // 全选
  const onSelectAll = (selected: any) => {
    if (selected) {
      let childKeys: any = []
      data?.list?.forEach((element: any) => {
        childKeys = [...childKeys, ...[element]]
      })
      setSelectedRowKeys([...new Set(childKeys)])
      onOperationCheckbox('add', [...new Set(childKeys)])
    } else {
      setSelectedRowKeys([])
      onOperationCheckbox('remove')
    }
  }
  const onChangePage = (page: number, size: number) => {
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
  }
  return (
    <>
      <ResizeTable
        isSpinning={isSpinning}
        dataWrapNormalHeight="calc(100% - 48px)"
        col={colum}
        dataSource={data.list}
        rowSelection={
          {
            selectedRowKeys: selectedRowKeys?.map((i: any) => i.id),
            onSelect: (record: any, selected: any) =>
              onSelectChange(record, selected),
            onSelectAll,
          } as any
        }
        noData={
          <NoData
            subText={t('theCurrentProjectHasNotCreatedATransactionCreate')}
            haveFilter={filterKeys?.length > 0}
          >
            {/* {!hasCreate && ( */}
            <CommonButton
              type="light"
              onClick={() => 123}
              style={{ marginTop: 24 }}
            >
              {t('createTransaction')}
            </CommonButton>
          </NoData>
        }
      />
      <PaginationBox
        currentPage={data?.currentPage}
        pageSize={data?.pageSize}
        total={data?.total}
        onChange={onChangePage}
        hasPadding
      />
    </>
  )
}
export default Undistributed
