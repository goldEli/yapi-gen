/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undefined */
/* eslint-disable complexity */
/* eslint-disable multiline-ternary */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Dropdown, Menu, message, Pagination, Spin, Tooltip, Table } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './components/StaffTable'
import { OptionalFeld } from '@/components/OptionalFeld'
import { StaffPersonal } from './components/StaffPower'
import { useModel } from '@/models'
import {
  StaffHeader,
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SetButton,
  TableWrap,
} from '@/components/StyleCommon'
import SearchList from './components/SearchList'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission, openDetail } from '@/tools/index'
import NoData from '@/components/NoData'
import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { debounce } from 'lodash'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'

const tableWrapP = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`
const Reset = styled.div`
  height: 32px;
  background: white;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 16px 5px 16px;
  margin-right: 16px;
  border: 1px solid #d5d6d9ff;
  color: #646566ff;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(40, 119, 255, 1);
    color: rgba(40, 119, 255, 1);
  }
`

const DataWrap = styled.div({
  background: 'white',
  overflowX: 'auto',
  height: '100%',
  overflow: 'hidden',
})

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
  '.ant-table table': {
    paddingBottom: 0,
  },
})

const Staff = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const { getStaffList, refreshStaff, updateStaff } = useModel('staff')
  const { userInfo, isRefresh, setIsRefresh } = useModel('user')
  const [filterHeight, setFilterHeight] = useState<any>(116)
  const [isShow, setIsShow] = useState<boolean>(false)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(20)
  const [total, setTotal] = useState<number>()
  const [keyword, setKeyword] = useState<string>('')
  const [searchGroups, setSearchGroups] = useState<any>({
    jobId: [],
    departmentId: [],
    userGroupId: [],
  })
  const dataWrapRef = useRef<HTMLDivElement>(null)
  const [listData, setListData] = useState<any>(undefined)
  const [editData, setEditData] = useState<any>({})
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isStaffPersonalVisible, setIsStaffPersonalVisible] =
    useState<boolean>(false)
  const [titleList, setTitleList] = useState<CheckboxValueType[]>([
    'nickname',
    'name',
    'gender',
    'email',
    'phone',
    'department_name',
    'position_name',
    'project_num',
    'role_name',
    'status',
  ])
  const [titleList2, setTitleList2] = useState<CheckboxValueType[]>([
    'created_at',
  ])

  const hasCheck = getIsPermission(userInfo?.company_permissions, 'b/user/info')

  const getStaffListData = async () => {
    setIsSpinning(true)
    const res = await getStaffList({
      jobId: searchGroups.jobId,
      departmentId: searchGroups.departmentId,
      userGroupId: searchGroups.userGroupId,
      keyword,
      order,
      orderkey: orderKey,
      page,
      pagesize,
    })
    setListData(res.list)
    setIsSpinning(false)
    setTotal(res.pager.total)
    setPlainOptions(res.plainOptions)
    await setPlainOptions2(res.plainOptions2)
    setLoadingState(true)
    setIsRefresh(false)
  }

  const init = () => {
    getStaffListData()
  }

  useEffect(() => {
    if (isRefresh) {
      init()
    }
  }, [isRefresh])

  const controlStaffPersonalVisible = (e: any) => {
    setEditData(e)
    setIsStaffPersonalVisible(true)
  }
  const closeStaffPersonal = async (e: any) => {
    const res = await updateStaff(e)

    if (res.code === 0) {
      message.success(res.message)
      getStaffListData()
      setIsStaffPersonalVisible(false)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const updateOrderkey = (key: any, order: any) => {
    setOrderKey(key)
    setOrder(order)
  }

  const columns = useDynamicColumns({
    controlStaffPersonalVisible,
    orderKey,
    order,
    updateOrderkey,
  })

  const menuTable = (record: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <span onClick={() => controlStaffPersonalVisible(record)}>
              {t('staff.setPermission')}
            </span>
          ),
        },
      ]}
    />
  )

  const onToDetail = (row: any) => {
    if (row.id === userInfo.id) {
      openDetail('/mine')
    } else {
      const params = encryptPhp(
        JSON.stringify({ id: '', isMember: false, userId: row.id }),
      )
      openDetail(`/MemberInfo/profile?data=${params}`)
    }
  }

  const selectColum: any = useMemo(() => {
    const arr = [...titleList, ...titleList2]
    const newList = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (arr[i] === columns[j].key) {
          newList.push(columns[j])
        }
      }
    }
    const arrList = [
      {
        width: 40,
        render: (text: any, record: any) => {
          return (
            <div
              hidden={getIsPermission(
                userInfo?.company_permissions,
                'b/user/update',
              )}
            >
              <Dropdown overlay={menuTable(record)} placement="bottomLeft">
                <RowIconFont type="more" />
              </Dropdown>
            </div>
          )
        },
      },
    ]
    const lastList = [
      {
        title: t('newlyAdd.operation'),
        dataIndex: 'action',
        width: 120,
        fixed: 'right',
        render: (text: string, record: any) => {
          return (
            <>
              {hasCheck ? (
                '--'
              ) : (
                <span
                  onClick={() => onToDetail(record)}
                  style={{ fontSize: 14, color: '#2877ff', cursor: 'pointer' }}
                >
                  {t('project.checkInfo')}
                </span>
              )}
            </>
          )
        },
      },
    ]
    return [...arrList, ...newList, ...lastList]
  }, [titleList, titleList2, columns])

  const showModal = () => {
    setIsModalVisible(true)
  }
  const close2 = () => {
    setIsModalVisible(false)
  }

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
  }
  const onSearch = async (e: any) => {
    setSearchGroups({
      jobId: e.position,
      departmentId: e.department,
      userGroupId: e.userGroup,
    })
  }
  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }
  const onPressEnter = (e: any) => {
    setPage(1)
    setKeyword(e.target.value)
  }
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pagesize])

  useEffect(() => {
    setPage(1)
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, searchGroups, orderKey, order])

  const rest = debounce(
    async () => {
      const res = await refreshStaff()
      if (res.code === 0) {
        message.success(t('staff.refreshSuccess'))
        init()
      }
    },
    1000,
    {
      leading: true,
      trailing: true,
    },
  )

  const onChangeFilter = () => {
    setIsShow(!isShow)
    setTimeout(() => {
      setFilterHeight(isShow ? 116 : 180)
    }, 100)
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <span onClick={showModal}>{t('common.setField')}</span>,
        },
      ]}
    />
  )

  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)

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
  }, [listData])

  const tableY =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0

  if (!loadingState) {
    return <Loading />
  }
  return (
    <PermissionWrap
      auth="b/user/list"
      permission={userInfo?.company_permissions}
    >
      <StaffHeader>{t('staff.companyStaff')}</StaffHeader>
      <Hehavior>
        <div style={{ display: 'flex' }}>
          <MyInput
            style={{ width: 292 }}
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 20 }}
              />
            }
            onPressEnter={onPressEnter}
            onBlur={onPressEnter}
            placeholder={t('staff.pleaseKey')}
            allowClear
          />
        </div>
        <div
          style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}
        >
          <Reset onClick={rest}>{t('staff.refresh')}</Reset>
          <SetButton onClick={onChangeFilter}>
            <Tooltip title={t('common.search')}>
              <IconFont
                type="filter"
                style={{
                  fontSize: 20,
                  color: isShow ? 'rgba(40, 119, 255, 1)' : '',
                }}
              />
            </Tooltip>
          </SetButton>
          <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
            <SetButton>
              <Tooltip title={t('common.tableFieldSet')}>
                <IconFont type="settings" style={{ fontSize: 20 }} />
              </Tooltip>
            </SetButton>
          </Dropdown>
        </div>
      </Hehavior>
      {isShow ? <SearchList onSearch={onSearch} /> : null}

      <div
        className={tableWrapP}
        style={{ height: `calc(100% - ${filterHeight}px)` }}
      >
        <StaffTableWrap
          style={{
            height: 'calc(100% - 50px)',
            overflow: 'hidden',
            padding: '16px 24px 0',
          }}
        >
          <DataWrap ref={dataWrapRef}>
            <Spin spinning={isSpinning}>
              {!!listData &&
                (listData?.length > 0 ? (
                  <TableBox
                    rowKey="id"
                    columns={selectColum}
                    dataSource={listData}
                    pagination={false}
                    scroll={{
                      x: selectColum.reduce(
                        (totalWidth: number, item: any) =>
                          totalWidth + item.width,
                        0,
                      ),
                      y: tableY,
                    }}
                    sticky
                  />
                ) : (
                  <NoData />
                ))}
            </Spin>
          </DataWrap>
        </StaffTableWrap>

        <PaginationWrap>
          <Pagination
            pageSize={pagesize}
            current={page}
            showSizeChanger
            showQuickJumper
            total={total}
            showTotal={newTotal => t('common.tableTotal', { count: newTotal })}
            pageSizeOptions={['10', '20', '50']}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
          />
        </PaginationWrap>
      </div>

      <OptionalFeld
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        checkList={titleList}
        checkList2={titleList2}
        isVisible={isModalVisible}
        onClose={close2}
        getCheckList={getCheckList}
      />
      {isStaffPersonalVisible ? (
        <StaffPersonal
          data={editData}
          isVisible={isStaffPersonalVisible}
          onClose={() => {
            setIsStaffPersonalVisible(false)
          }}
          onConfirm={closeStaffPersonal}
        />
      ) : null}
    </PermissionWrap>
  )
}

export default Staff
