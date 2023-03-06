// 公司成员主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undefined */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Menu, message, Pagination, Space, Spin } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './components/StaffTable'
import { OptionalFeld } from '@/components/OptionalFeld'
import { StaffPersonal } from './components/StaffPower'
import { TableStyleBox, HoverWrap, DividerWrap } from '@/components/StyleCommon'
import SearchList from './components/SearchList'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission } from '@/tools/index'
import NoData from '@/components/NoData'
import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { debounce } from 'lodash'
import { encryptPhp } from '@/tools/cryptoPhp'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import DropDownMenu from '@/components/DropDownMenu'
import { getStaffList, refreshStaff, updateStaff } from '@/services/staff'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import InputSearch from '@/components/InputSearch'
import PaginationBox from '@/components/TablePagination'
import SetShowField from '@/components/SetShowField/indedx'
import { useNavigate } from 'react-router-dom'

export const tableWrapP = css`
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
  &:focus {
    border: 1px solid #1763e5;
    color: #1763e5;
  }
`

export const DataWrap = styled.div({
  background: 'white',
  overflowX: 'auto',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '6px',
})

const StaffManagement = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.b5'))
  const dispatch = useDispatch()
  const { userInfo, isRefresh } = useSelector(store => store.user)
  const [isShow, setIsShow] = useState<boolean>(false)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(20)
  const [total, setTotal] = useState<number>(0)
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
  const [isVisibleFields, setIsVisibleFields] = useState(false)
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
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const hasCheck = getIsPermission(userInfo?.company_permissions, 'b/user/info')
  const navigate = useNavigate()

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
    dispatch(setIsRefresh(false))
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
  const updateOrderkey = (key: any, orderVal: any) => {
    setOrderKey(key)
    setOrder(orderVal)
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
            <div onClick={() => controlStaffPersonalVisible(record)}>
              {t('staff.setPermission')}
            </div>
          ),
        },
      ]}
    />
  )

  const onToDetail = (row: any) => {
    if (row.id === userInfo.id) {
      navigate('/ProjectManagement/Mine/Profile')
    } else {
      const params = encryptPhp(
        JSON.stringify({ id: '', isMember: false, userId: row.id }),
      )
      navigate(`/MemberInfo/Profile?data=${params}`)
    }
  }

  const selectColum: any = useMemo(() => {
    const arr = allTitleList
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
        render: (_text: any, record: any) => {
          return (
            <div
              hidden={getIsPermission(
                userInfo?.company_permissions,
                'b/user/update',
              )}
            >
              <MoreDropdown menu={menuTable(record)} />
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
        render: (_text: string, record: any) => {
          return (
            <>
              {hasCheck ? (
                '--'
              ) : (
                <span
                  onClick={() => onToDetail(record)}
                  style={{
                    fontSize: 14,
                    color: '#2877ff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
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
    setIsVisibleFields(false)
  }
  const close2 = () => {
    setIsModalVisible(false)
  }

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
    list3: CheckboxValueType[],
    all: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
    setAllTitleList(all)
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
  const onPressEnter = (value: any) => {
    setPage(1)
    setKeyword(value)
  }

  useEffect(() => {
    setAllTitleList([...titleList, ...titleList2])
    init()
  }, [keyword, searchGroups, orderKey, order, page, pagesize])

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
  }
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
    // <PermissionWrap
    //   auth="b/user/list"
    //   permission={userInfo?.company_permissions}
    // >
    <div>
      <div>{t('staff.companyStaff')}</div>
      <div style={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
        <div>
          <div style={{ display: 'flex', marginLeft: 24 }}>
            <InputSearch
              width={292}
              placeholder={t('staff.pleaseKey')}
              onChangeSearch={onPressEnter}
            />
          </div>
          <div
            style={{
              marginRight: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Reset onClick={rest}>{t('staff.refresh')}</Reset>
            <Space size={8}>
              <HoverWrap onClick={onChangeFilter} isActive={isShow}>
                <IconFont className="iconMain" type="filter" />
                <span className="label">{t('common.search')}</span>
              </HoverWrap>
              <DividerWrap type="vertical" />
              <DropDownMenu
                menu={<SetShowField notView onChangeFieldVisible={showModal} />}
                icon="settings"
                isVisible={isVisibleFields}
                onChangeVisible={setIsVisibleFields}
                isActive={isModalVisible}
              >
                <div>{t('common.tableFieldSet')}</div>
              </DropDownMenu>
            </Space>
          </div>
        </div>
        {isShow ? <SearchList onSearch={onSearch} /> : null}
        <div className={tableWrapP} style={{ height: `calc(100% - 52px)` }}>
          <div
            style={{
              height: 'calc(100% - 50px)',
              overflow: 'hidden',
            }}
          >
            <DataWrap ref={dataWrapRef}>
              <Spin spinning={isSpinning}>
                {!!listData &&
                  (listData?.length > 0 ? (
                    <TableStyleBox
                      isBottom
                      rowKey="id"
                      columns={selectColum}
                      dataSource={listData}
                      pagination={false}
                      scroll={{
                        x: 'max-content',
                        y: tableY,
                      }}
                      tableLayout="auto"
                    />
                  ) : (
                    <NoData />
                  ))}
              </Spin>
            </DataWrap>
          </div>

          <PaginationBox
            total={total}
            pageSize={pagesize}
            currentPage={page}
            onChange={onChangePage}
          />
        </div>

        <OptionalFeld
          allTitleList={allTitleList}
          plainOptions={plainOptions}
          plainOptions2={plainOptions2}
          checkList={titleList}
          checkList2={titleList2}
          isVisible={isModalVisible}
          onClose={close2}
          getCheckList={getCheckList}
        />
        <StaffPersonal
          data={editData}
          isVisible={isStaffPersonalVisible}
          onClose={() => {
            setIsStaffPersonalVisible(false)
          }}
          onConfirm={closeStaffPersonal}
        />
      </div>
      {/* </PermissionWrap> */}
    </div>
  )
}

export default StaffManagement
