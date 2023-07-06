// 项目列表表格模式

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Menu, Progress } from 'antd'

import { useNavigate } from 'react-router-dom'
import { useCallback, useMemo, useState } from 'react'
import Sort from '@/components/Sort'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'
import { OmitText } from '@star-yun/ui'
import MoreDropdown from '@/components/MoreDropdown'
import { useSelector } from '@store/index'
import PaginationBox from '../TablePagination'
import ResizeTable from '../ResizeTable'
import { editProject } from '@store/create-propject'
import { useDispatch } from 'react-redux'
import CommonButton from '../CommonButton'
import { HiddenText } from '../StyleCommon'

interface Props {
  onChangeOperation?(type: string, item: any, e: any): void
  projectList: any
  onChangePageNavigation(item: any): void
  onUpdateOrderKey(item: any): void
  order?: any
  onAddClick?(): void
  // 是否有筛选条件
  hasFilter?: boolean
  sendKey(item: any): void
  less?: boolean
}

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  div: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 8,
  },
  span: {
    color: 'var(--neutral-n1-d1)',
    fontSize: 14,
    fontWeight: 400,
  },
})
const Dd = styled.div`
  .ant-table-body {
    height: calc(100% - 50px) !important;
  }
`
const ImgWrap = styled.div<{ url?: string }>(
  {
    width: 32,
    height: 32,
    marginRight: '8px',
    borderRadius: 4,
    boxSizing: 'border-box',
    border: '1px solid white',
    cursor: 'pointer',
    backgroundSize: '100%',
    backgroundPosition: 'center',
    '&: hover': {
      border: '1px solid var(--primary-d2)',
    },
  },
  ({ url }) => ({
    backgroundImage: `url(${url})`,
  }),
)
const ClickWrap = styled.div<{ isClose?: boolean; isName?: boolean }>(
  ({ isClose, isName }) => ({
    color: isClose ? 'var(--neutral-n3)' : '',
    textDecoration: isName && isClose ? 'line-through' : '',
  }),
)
const MoreContent = (props: any) => {
  const [t] = useTranslation()

  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const { userInfo } = useSelector(store => store.user)
  const hasEdit = getIsPermission(
    userInfo?.company_permissions,
    'b/project/update',
  )
  const hasDelete = getIsPermission(
    userInfo?.company_permissions,
    'b/project/delete',
  )
  const hasStop = getIsPermission(
    userInfo?.company_permissions,
    'b/project/stop',
  )
  const hasStart = getIsPermission(
    userInfo?.company_permissions,
    'b/project/start',
  )

  const onClickMore = (type: any, item: any, e: any) => {
    if (e) {
      e.stopPropagation()
    }
    if (type === 'edit') {
      dispatch(editProject({ visible: true, id: item.id }))
    } else {
      props?.onChange(type, item, e)
    }

    setIsVisible(false)

    //
  }

  const menu = (record: any) => {
    const isDel = (
      userInfo.company_permissions?.map((i: any) => i.identity) || []
    ).includes('b/project/delete')
    const isEdit = (
      userInfo.company_permissions?.map((i: any) => i.identity) || []
    ).includes('b/project/update')
    let menuItems = [
      {
        isHave: isEdit,
        key: '1',
        label: (
          <div onClick={e => onClickMore?.('edit', record, e)}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        isHave: isEdit,
        key: '2',
        label: (
          <div onClick={e => onClickMore?.('end', record, e)}>
            {record.status === 1 ? t('common.stop') : t('common.open')}
          </div>
        ),
      },
      {
        isHave: isDel,
        key: '3',
        label: (
          <div onClick={e => onClickMore?.('delete', record, e)}>
            {t('common.del')}
          </div>
        ),
      },
    ]

    return <Menu items={menuItems.filter((i: any) => i.isHave)} />
  }

  return (
    <>
      <MoreDropdown
        isMoreVisible={isVisible}
        menu={menu(props?.record)}
        onChangeVisible={setIsVisible}
      />

      {!(!hasDelete && !hasEdit && !hasStart && !hasStop) && (
        <div style={{ width: 16 }} />
      )}
    </>
  )
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

const MainTable = (props: Props) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { userInfo } = useSelector(store => store.user)
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
  const hasStop = getIsPermission(
    userInfo?.company_permissions,
    'b/project/stop',
  )
  const hasStart = getIsPermission(
    userInfo?.company_permissions,
    'b/project/start',
  )

  const onUpdateOrderKey = (key: any, val: any) => {
    props.onUpdateOrderKey({ value: val === 2 ? 'desc' : 'asc', key })
  }
  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys)
    props.sendKey(newSelectedRowKeys)
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
      width: 200,
      render: (text: string, record: any) => {
        return (
          <HiddenText>
            <ImgWrap url={record.cover} />
            <ClickWrap isName isClose={record.status === 2}>
              <OmitText
                width={160}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text}
              </OmitText>
            </ClickWrap>
          </HiddenText>
        )
      },
    },
    {
      title: t('keyboard'),
      dataIndex: 'prefix',
      width: 160,
    },
    {
      title: (
        <NewSort
          fixedKey="member_count"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.projectCount')}
        </NewSort>
      ),
      dataIndex: 'memberCount',
      width: 160,
    },
    {
      title: (
        <NewSort
          fixedKey="story_count"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.demandCount')}
        </NewSort>
      ),
      dataIndex: 'storyCount',
      width: 160,
    },
    {
      title: (
        <NewSort
          fixedKey="iterate_count"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.iterateCount')}
        </NewSort>
      ),
      dataIndex: 'iterateCount',
      width: 160,
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
      width: 160,
      render: (text: string) => {
        return (
          <Progress
            strokeColor="var(--function-success)"
            style={{ color: 'var(--function-success)' }}
            width={38}
            type="line"
            percent={Math.trunc(Number(text) * 100)}
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
          fixedKey="leader_name"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project_leader')}
        </NewSort>
      ),
      dataIndex: 'leader_name',
      width: 160,
    },
    {
      title: (
        <NewSort
          fixedKey="user_name"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.createName')}
        </NewSort>
      ),
      dataIndex: 'createName',
      width: 160,
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
      width: 160,
      render: (text: number) => {
        return (
          <StatusWrap>
            <div
              style={{
                background:
                  text === 1 ? 'var(--function-success)' : 'var(--neutral-n4)',
              }}
            />
            <span>
              {text === 1 ? t('common.opening1') : t('common.Closed')}
            </span>
          </StatusWrap>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="team_id"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project_type')}
        </NewSort>
      ),
      dataIndex: 'team_id',
      width: 160,
      render: (text: number) => {
        return (
          <span>{text === 0 ? t('enterprise_project') : t('teamwork')}</span>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.createTime')}
        </NewSort>
      ),
      dataIndex: 'createdTime',
      width: 180,
    },
    {
      title: (
        <NewSort
          fixedKey="stop_at"
          nowKey={props.order.key}
          order={props.order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.endTime')}
        </NewSort>
      ),
      dataIndex: 'endTime',
      width: 180,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]

  const selectColum: any = useMemo(() => {
    const arr = columns

    const arrList = [
      {
        render: (text: any, record: any) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {hasEdit && hasDelete && hasStop && hasStart ? null : (
                <MoreContent
                  onChange={props?.onChangeOperation}
                  text={text}
                  record={record}
                />
              )}
            </div>
          )
        },
      },
    ]
    return [...arr]
  }, [columns])

  const onChangePage = (page: number, size: number) => {
    props.onChangePageNavigation({ page, size })
  }

  const onTableRow = useCallback((row: any) => {
    return {
      onClick: () => {
        const params = encryptPhp(JSON.stringify({ id: row.id }))
        navigate(`/ProjectManagement/Demand?data=${params}`)
      },
    }
  }, [])
  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onChange: onSelectChange,
  }
  return (
    <Dd
      style={{
        padding: '24px 24px 0px 24px',
      }}
    >
      <ResizeTable
        rowSelection={rowSelection}
        isSpinning={false}
        dataWrapNormalHeight={
          props.less ? 'calc(100vh - 500px)' : 'calc(100vh - 300px)'
        }
        col={selectColum}
        dataSource={props.projectList?.list}
        // onRow={onTableRow as any}
        noData={<NoData haveFilter={props?.hasFilter}></NoData>}
      />
      <PaginationBox
        isP
        total={props.projectList?.total}
        currentPage={props.projectList?.currentPage}
        pageSize={props.projectList?.pageSize}
        onChange={onChangePage}
      />
    </Dd>
  )
}

export default MainTable
