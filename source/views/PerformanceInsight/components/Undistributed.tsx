/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-negated-condition */
/* eslint-disable no-empty */
import { copyLink, getIsPermission } from '@/tools'
import { useSelector } from '@store/index'
import MoreDropdown from '@/components/MoreDropdown'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { Menu, Tooltip } from 'antd'
import CommonIconFont from '@/components/CommonIconFont'
import { useTranslation } from 'react-i18next'
import FloatBatch from '@/components/BatchOperation/FloatBatch'
import { createRef, useEffect, useState } from 'react'
import TableColorText from '@/components/TableColorText'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import ResizeTable from '@/components/ResizeTable'
import CommonButton from '@/components/CommonButton'
import NoData from '@/components/NoData'
import PaginationBox from '@/components/TablePagination'
import HeaderAll from './HeaderAll'
import { getDays, getMonthBefor } from './Date'
import {
  HiddenText,
  ClickWrap,
  ListNameWrap,
  PriorityWrapTable,
} from '@/components/StyleCommon'
import { updateDemandStatus, updatePriority } from '@/services/demand'
import { updateFlawPriority, updateFlawStatus } from '@/services/flaw'
import { unassignedList } from '@/services/efficiency'
import { updateAffairsPriority, updateAffairsStatus } from '@/services/affairs'
import MultipleAvatar from '@/components/MultipleAvatar'
import { OmitText } from '@star-yun/ui'
import TableQuickEdit from '@/components/TableQuickEdit'
import ChildDemandTable from '@/components/ChildDemandTable'
import { getMessage } from '@/components/Message'
import IconFont from '@/components/IconFont'
import StateTag from '@/components/StateTag'

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
    let params: any = {
      id: props.record.project_id,
      detailId: props.record?.id,
      isOpenScreenDetail: true,
      iterateId: props.record.id,
    }
    let url = ''
    if (props.record.project_type === 2) {
      params.specialType = 1
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `SprintProjectManagement/Affair?data=${resultParams}`
    } else if (props.record.project_type === 1 && props.record.is_bug === 1) {
      params.specialType = 2
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectManagement/Defect?data=${resultParams}`
    } else if (props.record.project_type === 1 && props.record.is_bug !== 1) {
      params.specialType = 3
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectManagement/Demand?data=${resultParams}`
    }
    const newUrl = `${window.origin}${import.meta.env.__URL_HASH__}${url}`
    copyLink(
      `【${props?.record.storyPrefixKey}】${newUrl}`,
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

const Undistributed = (props: any) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const { filterParams, filterKeys } = useSelector(store => store.project)
  // project_type === 1 迭代  project_type === 2 cc  project_type === 1 && isBug=== 1 就是缺陷
  // permissions
  // 编辑权限 project_type === 1 && isBug=== 1 && key_value  b/flaw/update
  // 编辑权限 project_type === 2 && key_value  b/transaction/update
  // 编辑权限 project_type === 1 && isBug!== 1 && 需求：b/story/update
  const [t] = useTranslation()
  const [isShowMore, setIsShowMore] = useState(false)
  const [page, setPage] = useState(1)
  const batchDom: any = createRef()
  const [pageSize, setPageSize] = useState(50)
  // const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [data, setData] = useState<any>()
  useEffect(() => {
    onUpdate()
  }, [])
  const getTimeStr = (time: { type: number; time: any }) => {
    switch (time.type) {
      case 1:
        return 'one_month'
      case 3:
        return 'three_month'
      case 6:
        return 'six_month'
      case 14:
        return 'two_week'
      case 28:
        return 'four_week'
      default:
        return ''
    }
  }
  // 获取时间
  const getTime = (time: { type: number; time: any }) => {
    switch (time.type) {
      case 1:
        return getMonthBefor(1)
      case 3:
        return getMonthBefor(3)
      case 6:
        return getMonthBefor(6)
      case 14:
        return getDays(14)
      case 28:
        return getDays(28)
      default:
        return {
          startTime: time?.time?.[0],
          endTime: time?.time?.[1],
        }
    }
  }
  const onUpdate = async (pageVal?: any, sizeVal?: any) => {
    setIsSpinning(true)
    const time = props.headerParmas?.time && getTime(props.headerParmas?.time)
    const result = await unassignedList({
      project_ids: props.headerParmas?.projectIds?.length
        ? props.headerParmas?.projectIds?.join?.(',')
        : props.projectId + '',
      iterate_ids: props.headerParmas.iterate_ids?.length
        ? props.headerParmas.iterate_ids?.join(',')
        : '',
      user_ids: props.headerParmas.users?.length
        ? props.headerParmas.users?.join(',')
        : '',
      period_time: getTimeStr(props.headerParmas?.time),
      start_time: getTimeStr(props.headerParmas?.time) ? '' : time.startTime,
      end_time: getTimeStr(props.headerParmas?.time) ? '' : time.endTime,
      page: pageVal || page,
      pagesize: sizeVal || pageSize,
      type: props.type.includes('Defect') ? 2 : 1,
    })
    setData({
      list: result.list,
      pager: result.pager,
    })
    setIsSpinning(false)
  }
  // 修改优先级
  const onChangePriority = async (item: any, record: any) => {
    // 修改缺陷优先级
    try {
      if (record.project_type === 1 && record.isBug === 1) {
        await updateFlawPriority({
          id: item.id,
          priorityId: item.priorityId,
          projectId: item.projectId,
        })
      } else if (record.project_type === 2) {
        // 修改事务优先级
        await updateAffairsPriority({
          id: item.id,
          priorityId: item.priorityId,
          projectId: item.projectId,
        })
      } else {
        // 需求
        await updatePriority({
          id: item.id,
          priorityId: item.priorityId,
          projectId: item.projectId,
        })
      }
      getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
      onUpdate()
    } catch (error) {
      //
    }
  }
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
  ]
  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }
  const arr2 = [
    {
      title: (
        <div>
          {props.homeType === 'sprint'
            ? t('subtransaction')
            : t('common.childDemand')}
        </div>
      ),
      dataIndex: 'demand',
      key: 'child_story_count',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <>
            {/* {record.showChildCOntent && !record.isTree && (
              <ChildDemandTable value={text} row={record} />
            )}
            {(!record.showChildCOntent || record.isTree) && ( */}
            <span>{text || 0}</span>
            {/* )} */}
          </>
        )
      },
    },
    {
      title: (
        <div>
          {props.homeType === 'sprint' ? t('sprint2') : t('common.iterate')}
        </div>
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
                isCanEdit={record.isCanEdit}
                xnProjectId={record.projectId}
                onUpdate={() => onUpdate()}
                isBug={record.project_type === 2}
                projectId={0}
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
  ]
  // 修改状态
  const onChangeStatusApi = async (value: any, record: any) => {
    try {
      if (record.project_type === 2) {
        // 事务
        await updateAffairsStatus(value)
      } else if (record.project_type === 1 && record.isBug === 1) {
        // 缺陷
        await updateFlawStatus(value)
      } else {
        // 需求
        await updateDemandStatus(value)
      }
    } catch (err) {}
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    onUpdate()
  }
  // 复制编号
  const onCopy = (record: any) => {
    let params: any = {
      id: record.project_id,
      detailId: record?.id,
      isOpenScreenDetail: true,
      iterateId: record.id,
    }
    let url = ''
    if (record.project_type === 2) {
      params.specialType = 1
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `SprintProjectManagement/Affair?data=${resultParams}`
    } else if (record.project_type === 1 && record.is_bug === 1) {
      params.specialType = 2
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectManagement/Defect?data=${resultParams}`
    } else if (record.project_type === 1 && record.is_bug !== 1) {
      params.specialType = 3
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectManagement/Demand?data=${resultParams}`
    }
    const newUrl = `${window.origin}${import.meta.env.__URL_HASH__}${url}`
    copyLink(
      `【${record.storyPrefixKey}】${newUrl}`,
      t('common.copySuccess'),
      t('common.copyFail'),
    )
  }
  const colum = [
    ...arr,
    {
      width: 140,
      title: <div>{t('serialNumber')}</div>,
      dataIndex: 'storyPrefixKey',
      key: 'prefix_key',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClickWrap
              className="canClickDetail"
              isClose={record.category_status?.is_end === 1}
              style={{ marginRight: 16 }}
            >
              <div className="text">{record.storyPrefixKey}</div>
              <div className="icon">
                <CommonIconFont
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
      title: <div>{t('common.title')}</div>,
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
              onUpdate={() => onUpdate()}
              isDemandName
              isCanEdit={record.isCanEdit}
              xnProjectId={record.projectId}
              isBug={record.isBug === 1}
              projectId={0}
            >
              <Tooltip title={text} getPopupContainer={node => node}>
                <ListNameWrap
                  className="canClickDetail"
                  isName
                  isClose={record.category_status?.is_end === 1}
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
      title: <div>{t('common.status')}</div>,
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (text: any, record: any) => {
        return (
          <ChangeStatusPopover
            isCanOperation={record.isCanEdit && !record.isExamine}
            projectId={record.project_id || record.projectId}
            record={record}
            onChangeStatus={val => onChangeStatusApi(val, record)}
            type={record.project_type === 1 ? (record.is_bug === 1 ? 3 : 1) : 2}
          >
            <StateTag
              onClick={record.isExamine ? onExamine : void 0}
              isShow={record.isCanEdit || record.isExamine}
              name={record.category_status?.status?.content}
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
          </ChangeStatusPopover>
        )
      },
    },
    {
      title: <div>{t('common.priority')}</div>,
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <ChangePriorityPopover
            isCanOperation={
              record.isCanEdit &&
              (record.categoryConfigList
                ? Object.keys(record.categoryConfigList).includes('priority')
                : false)
            }
            onChangePriority={(val: any) => onChangePriority(val, record)}
            projectId={0}
            record={{ project_id: record.project_id, id: record.id }}
          >
            <PriorityWrapTable isShow={record.isCanEdit}>
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
    ...(props.homeType !== 'all' ? arr2 : []),
    {
      title: <div>{t('common.createName')}</div>,
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
                id: record.userId,
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
            isCanEdit={record.isCanEdit}
            xnProjectId={record.projectId}
            onUpdate={() => onUpdate()}
            isBug={record.is_bug === 1}
            projectId={0}
          >
            {record?.usersInfo?.length > 0 && (
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
      title: <div>{t('common.createTime')}</div>,
      dataIndex: 'time',
      key: 'created_at',
      width: 200,
      render: (text: string, row: any) => {
        return <span>{row.created_at || '--'}</span>
      },
    },
    {
      title: <div>{t('common.expectedStart')}</div>,
      dataIndex: 'expected_start_at',
      key: 'expected_start_at',
      width: 170,
      render: (text: string, row: any) => {
        return (
          <TableQuickEdit
            type="date"
            defaultText={row?.expected_start_at}
            keyText="expected_start_at"
            item={row}
            isCanEdit={row.isCanEdit}
            xnProjectId={row.projectId}
            onUpdate={() => onUpdate()}
            value={['datetime']}
            isBug={row.is_bug === 1}
            projectId={0}
          >
            <span>{row?.expected_start_at || '--'}</span>
          </TableQuickEdit>
        )
      },
    },
    {
      title: <div>{t('common.expectedEnd')}</div>,
      dataIndex: 'expected_end_at',
      key: 'expected_end_at',
      width: 170,
      render: (text: string, record: any) => {
        return (
          <TableQuickEdit
            type="date"
            defaultText={record.expected_end_at}
            keyText="expected_end_at"
            item={record}
            isCanEdit={record.isCanEdit}
            xnProjectId={record.projectId}
            onUpdate={() => onUpdate()}
            value={['datetime']}
            isBug={record.is_bug === 1}
            projectId={0}
          >
            <span>{text || '--'}</span>
          </TableQuickEdit>
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
    setPage(page)
    setPageSize(size)
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
    onUpdate(page, size)
  }
  // const hasBatch = getIsPermission(
  //   projectInfo?.projectPermissions,
  //   'b/story/batch',
  // )
  const hasBatch = true
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <HeaderAll
        state={'hidden'}
        homeType={props.homeType}
        projectId={props.projectId}
        type={props.type}
        viewType={props.viewType}
        headerParmas={props.headerParmas}
      />
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 100px)',
          padding: '24px 48px 0 48px',
        }}
      >
        <ResizeTable
          isSpinning={isSpinning}
          dataWrapNormalHeight="calc(100% - 48px)"
          col={colum}
          dataSource={data?.list}
          // rowSelection={
          //   {
          //     selectedRowKeys: selectedRowKeys?.map((i: any) => i.id),
          //     onSelect: (record: any, selected: any) =>
          //       onSelectChange(record, selected),
          //     onSelectAll,
          //   } as any
          // }
          noData={
            <NoData subText={t('noUN')} haveFilter={filterKeys?.length > 0}>
              {/* <CommonButton
                type="light"
                onClick={() => 123}
                style={{ marginTop: 24 }}
              >
                {t('createTransaction')}
              </CommonButton> */}
            </NoData>
          }
        />
        {/* {hasBatch && (
          <FloatBatch
            isVisible={selectedRowKeys.length > 0}
            onClose={() => onSelectAll(false)}
            selectRows={selectedRowKeys}
            onUpdate={onUpdate}
            onRef={batchDom}
            type={1}
          />
        )} */}
        <PaginationBox
          currentPage={data?.pager?.page}
          pageSize={data?.pager?.pagesize}
          total={data?.pager?.total}
          onChange={onChangePage}
          hasPadding
        />
      </div>
    </div>
  )
}
export default Undistributed
