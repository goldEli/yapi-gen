/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-negated-condition */
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
import { getDemandList, updatePriority } from '@/services/demand'
import HeaderAll from './HeaderAll'
import {
  HiddenText,
  ClickWrap,
  ListNameWrap,
  PriorityWrapTable,
} from '@/components/StyleCommon'
import { updateFlawTableParams, updateFlawPriority } from '@/services/flaw'
import { updateAffairsPriority } from '@/services/affairs'
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
const Undistributed = (props: any) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const { projectInfo, filterKeys, filterParams } = useSelector(
    store => store.project,
  )
  // project_type === 1 迭代  project_type === 2 cc  project_type === 1 && isBug=== 1 就是缺陷
  // permissions
  // 编辑权限 project_type === 1 && isBug=== 1 && key_value  b/flaw/update
  // 编辑权限 project_type === 2 && key_value  b/transaction/update
  // 编辑权限 project_type === 1 && isBug!== 1 && 需求：b/story/update
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) =>
        i.name === (projectInfo.projectType === 1 ? '编辑需求' : '编辑事务'),
    )?.length > 0
  const [t] = useTranslation()
  const [isShowMore, setIsShowMore] = useState(false)
  const [data, setData] = useState({
    list: [
      {
        name: '123',
      },
    ],
    currentPage: 10,
    pageSize: 1,
    total: 1,
  })
  useEffect(() => {
    onUpdate()
  }, [])
  const onUpdateOrderKey = () => {}
  const onUpdate = async (record?: any, type?: boolean) => {
    // 需求列表
    const result = await getDemandList({
      category_id: '',
      class_id: '',
      class_ids: '',
      copySendId: '',
      custom_field: '',
      endTime: '',
      expectedEnd: '',
      expectedStart: '',
      iterateIds: '',
      order: '',
      orderKey: '',
      page: 1,
      pageSize: 20,
      priorityIds: '',
      projectId: 314,
      schedule_end: '',
      schedule_start: '',
      searchValue: '',
      startTime: '',
      statusIds: '',
      tagIds: '',
      updatedTime: '',
      userId: '',
      usersNameId: '',
    })
    setData(result)
  }
  // 修改优先级
  const onChangeState = async (type: any, item: any) => {
    // 修改缺陷优先级
    try {
      await updateFlawPriority({
        id: item.id,
        priorityId: item.priorityId,
        projectId: item.projectId,
      })
      // 修改事务优先级
      await updateAffairsPriority({
        id: item.id,
        priorityId: item.priorityId,
        projectId: item.projectId,
      })
      // 需求
      await updatePriority({
        id: item.id,
        priorityId: item.priorityId,
        projectId: item.projectId,
      })
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
  ]
  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }
  const arr2 = [
    {
      title: (
        <NewSort fixedKey="child_story_count">
          {t('subtransaction')}
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
            <ChildDemandTable value={text} row={record} />
          </>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="iterate_name">
          {t('sprint2')} + {t('common.iterate')}
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
  ]
  const colum = [
    ...arr,
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
              // onClick={() => state.onClickItem(record)}
              isClose={record.status?.is_end === 1}
              style={{ marginRight: 16 }}
            >
              {record.storyPrefixKey}
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
            {/* {state.isTree && state.onChangeTree(record)} */}
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
              projectId={314}
              item={record}
              onUpdate={() => onUpdate(record)}
              isDemandName
              isBug={true}
            >
              <Tooltip title={text} getPopupContainer={node => node}>
                <ListNameWrap
                  className="canClickDetail"
                  isName
                  isClose={record.status?.is_end === 1}
                  // onClick={() => state.onClickItem(record)}
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
            projectId={record.project_id}
            record={record}
            onChangeStatus={() => 123}
            // onChangeStatus={item => state.onChangeStatus(item, record)}
            type={record.project_type === 1 ? (record.is_bug === 1 ? 3 : 1) : 2}
          >
            <StateTag
              onClick={record.isExamine ? onExamine : void 0}
              isShow={isCanEdit || record.isExamine}
              name={record.status?.status?.content}
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
              isCanEdit &&
              (record.categoryConfigList
                ? Object.keys(record.categoryConfigList).includes('priority')
                : false)
            }
            onChangePriority={item => onChangeState(item, record)}
            record={{ project_id: record.project_id, id: record.id }}
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
                <IconFont className="icon" type="down-icon" />
              </span>
            </PriorityWrapTable>
          </ChangePriorityPopover>
        )
      },
    },
    ...(props.homeType !== 'all' ? arr2 : []),
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
            isBug={record.is_bug === 1}
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
            isBug={record.is_bug === 1}
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
            isBug={record.is_bug === 1}
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
            isBug={record.is_bug === 1}
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
    setSelectedRowKeys([])
    onOperationCheckbox('remove')
  }
  const batchDom: any = createRef()
  const hasBatch = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/batch',
  )

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
        {/* !hasBatch */}
        {hasBatch && (
          <FloatBatch
            isVisible={selectedRowKeys.length > 0}
            onClose={() => onSelectAll(false)}
            selectRows={selectedRowKeys}
            onUpdate={onUpdate}
            onRef={batchDom}
            type={1}
          />
        )}
        <PaginationBox
          currentPage={data?.currentPage}
          pageSize={data?.pageSize}
          total={data?.total}
          onChange={onChangePage}
          hasPadding
        />
      </div>
    </div>
  )
}
export default Undistributed
