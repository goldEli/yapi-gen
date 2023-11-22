// 项目列表表格模式

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Progress, Tooltip } from 'antd'
import {
  ListNameWrap,
  TableActionWrap,
  TableActionItem,
} from '@/components/StyleCommon'
import { useNavigate } from 'react-router-dom'
import { useLayoutEffect, useRef, useState } from 'react'
import Sort from '@/components/Sort'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import PaginationBox from '../TablePagination'
import { editProject } from '@store/create-propject'
import { useDispatch } from 'react-redux'
import CommonButton from '../CommonButton'
import { Tags } from '../ProjectCard/style'
import DragTable from '../DragTable'
import MultipleAvatar from '../MultipleAvatar'

interface Props {
  onChangeOperation(type: string, item: any, e?: any): void
  projectList: any
  onChangePageNavigation(item: any): void
  onUpdateOrderKey(item: any): void
  order: any
  onAddClick(): void
  // 是否有筛选条件
  hasFilter?: boolean
  onChangeProjectList(value: any, idx?: number): void
  filterParams?: any
}

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: 'max-content',
  padding: '0 8px',
  height: 22,
  borderRadius: 2,
  div: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    marginRight: 8,
  },
  span: {
    color: 'var(--neutral-n1-d1)',
    fontSize: 14,
    fontWeight: 400,
  },
})

const ImgWrap = styled.div<{ url?: string }>(
  {
    width: 32,
    height: 32,
    marginRight: '8px',
    borderRadius: 4,
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundSize: '100%',
  },
  ({ url }) => ({
    backgroundImage: `url(${url})`,
  }),
)

const DataWrap = styled.div<{ height?: any; srcollState: boolean }>`
  height: ${props => props.height};
  overflow-x: ${props => (props.srcollState ? 'hidden' : 'auto')};
  overflow: ${props => (props.srcollState ? 'hidden' : 'auto')};
`

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

const MainTable = (props: Props) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userInfo } = useSelector(store => store.user)
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const dataWrapRef = useRef<HTMLDivElement>(null)

  const hasCreate = getIsPermission(
    userInfo?.company_permissions,
    'b/project/save',
  )

  const hasEdit = getIsPermission(
    userInfo?.company_permissions,
    'b/project/update',
  )

  const hasDelete = getIsPermission(
    userInfo?.company_permissions,
    'b/project/delete',
  )

  // 当前登录这是否是超级管理员
  const isSuperAdmin = userInfo?.is_company_super_admin === 1

  const onUpdateOrderKey = (key: any, val: any) => {
    props.onUpdateOrderKey({ value: val === 2 ? 'desc' : 'asc', key })
  }

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation({ page, size })
  }

  // 点击跳转项目详情
  const onClickItem = (row: any) => {
    const params = encryptPhp(
      JSON.stringify({
        id: row.id,
      }),
    )

    navigate(
      `${
        row.defaultHomeMenu
          ? row.defaultHomeMenu
          : `/ProjectDetail/${row.projectType === 2 ? 'Affair' : 'Demand'}`
      }?data=${params}`,
    )
  }

  const columns = [
    {
      dataIndex: 'name',
      title: (
        <NewSort
          fixedKey="name"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.projectName')}
        </NewSort>
      ),
      width: 480,
      render: (text: string, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ImgWrap url={record.cover} />
            {record.project_type === 1 ? (
              <Tags type={1}> {t('iteration')}</Tags>
            ) : (
              <Tags type={2}> {t('sprint2')}</Tags>
            )}
            <Tooltip title={`${text}-【${record.prefix}】`}>
              <ListNameWrap
                isName
                isClose={record.status === 2}
                onClick={() => onClickItem(record)}
              >
                <span className="controlMaxWidth">
                  {text}-【{record.prefix}】
                </span>
              </ListNameWrap>
            </Tooltip>
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="progress"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.projectProgress')}
        </NewSort>
      ),
      dataIndex: 'progress',
      width: 120,
      render: (text: string) => {
        return (
          <Progress
            strokeColor="var(--function-success)"
            style={{ color: 'var(--function-success)', width: '100px' }}
            type="line"
            percent={Number(text)}
            format={percent =>
              Number(percent) === 100 ? '100%' : `${percent}%`
            }
            strokeWidth={4}
          />
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="expected_start_at"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.expectedStart')}
        </NewSort>
      ),
      dataIndex: 'expected_start_at',
      width: 120,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="expected_end_at"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.expectedEnd')}
        </NewSort>
      ),
      dataIndex: 'expected_end_at',
      width: 120,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="leader_name"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project_leader')}
        </NewSort>
      ),
      dataIndex: 'leader_name',
      width: 110,
      render: (text: string, record: any) => {
        return (
          <MultipleAvatar
            max={1}
            list={[
              {
                avatar: record.leader?.avatar,
                id: record.leader?.id || 0,
                name: record.leader?.name,
              },
            ]}
          />
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="status"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.status')}
        </NewSort>
      ),
      dataIndex: 'status',
      width: 100,
      render: (text: number) => {
        const statusArr = [
          {
            id: 1,
            name: t('inProgress'),
            color: '#43BA9A',
            bg: 'rgba(67,186,154,0.1)',
          },
          {
            id: 2,
            name: t('completed'),
            color: '#A176FB',
            bg: 'rgba(161,118,251,0.1)',
          },
          {
            id: 3,
            name: t('paused'),
            color: '#FA9746',
            bg: 'rgba(250,151,70,0.1)',
          },
          {
            id: 4,
            name: t('hasNotStarted'),
            color: '#6688FF',
            bg: 'rgba(102,136,255,0.1)',
          },
        ]
        return (
          <StatusWrap
            style={{
              background: statusArr?.filter((i: any) => i.id === text)[0]?.bg,
            }}
          >
            <div
              style={{
                background: statusArr?.filter((i: any) => i.id === text)[0]
                  ?.color,
              }}
            />
            <span>{statusArr?.filter((i: any) => i.id === text)[0]?.name}</span>
          </StatusWrap>
        )
      },
    },
    {
      title: t('operate'),
      dataIndex: 'action',
      width: 200,
      render: (text: number, record: any) => {
        // 项目负责人或者是超管
        const isRolePermission =
          !isSuperAdmin && record.leader?.id !== userInfo?.id

        return (
          <TableActionWrap>
            <Tooltip
              title={
                isRolePermission
                  ? t('onlyTheProjectLeaderCanPausestartTheProject')
                  : null
              }
            >
              <TableActionItem
                isDisable={isRolePermission}
                onClick={() =>
                  isRolePermission
                    ? void 0
                    : props.onChangeOperation('', record)
                }
              >
                {record.status === 1 ? t('pause') : t('start')}
              </TableActionItem>
            </Tooltip>
            <Tooltip
              title={
                isRolePermission
                  ? t('onlyTheProjectLeaderCanCloseTheProject')
                  : [4, 2].includes(record.status)
                  ? t('theProjectCannotBeClosedInTheState')
                  : null
              }
            >
              <TableActionItem
                isDisable={isRolePermission || [4, 2].includes(record.status)}
                onClick={() =>
                  isRolePermission || [4, 2].includes(record.status)
                    ? void 0
                    : props.onChangeOperation('close', record)
                }
              >
                {t('closure')}
              </TableActionItem>
            </Tooltip>

            <TableActionItem
              isDisable={record.team_id === 0 ? hasEdit : record.isTeam}
              onClick={() =>
                (record.team_id === 0 ? hasEdit : record.isTeam)
                  ? void 0
                  : dispatch(editProject({ visible: true, id: record.id }))
              }
            >
              {t('edit')}
            </TableActionItem>
            <TableActionItem
              isDisable={hasDelete}
              onClick={() =>
                hasDelete ? void 0 : props.onChangeOperation('delete', record)
              }
            >
              {t('common.del')}
            </TableActionItem>
          </TableActionWrap>
        )
      },
    },
  ]

  useLayoutEffect(() => {
    if (dataWrapRef.current) {
      const currentHeight = dataWrapRef.current.clientHeight
      if (currentHeight !== dataWrapHeight) {
        setDataWrapHeight(currentHeight)
      }

      const tableBody = dataWrapRef.current.querySelector('.ant-table-tbody')
      if (tableBody && tableBody.clientHeight !== tableWrapHeight) {
        setTableWrapHeight(tableBody.clientHeight)
      }
    }
  }, [props.projectList?.list])

  const tableY =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0

  return (
    <div style={{ height: '100%' }}>
      {!!props.projectList?.list &&
        (props.projectList?.list?.length > 0 ? (
          <DataWrap
            srcollState={false}
            height="calc(100% - 56px)"
            ref={dataWrapRef}
          >
            <DragTable
              filterParams={props.filterParams}
              columns={columns}
              dataSource={{
                list: props.projectList?.list?.map((i: any) => ({
                  ...i,
                  index: i.id,
                })),
              }}
              onChangeData={(value: any, idx: number) => {
                props.onChangeProjectList(
                  {
                    ...props.projectList,
                    ...value,
                  },
                  idx,
                )
              }}
              tableY={tableY}
            />
          </DataWrap>
        ) : (
          <NoData
            subText={hasCreate ? '' : t('version2.noDataCreateProject')}
            haveFilter={props?.hasFilter}
          >
            {!hasCreate && (
              <CommonButton
                type="light"
                onClick={props.onAddClick}
                style={{ marginTop: 24 }}
              >
                {t('common.createProject')}
              </CommonButton>
            )}
          </NoData>
        ))}

      <PaginationBox
        total={props.projectList?.total}
        currentPage={props.projectList?.currentPage}
        pageSize={props.projectList?.pageSize}
        onChange={onChangePage}
      />
    </div>
  )
}

export default MainTable
