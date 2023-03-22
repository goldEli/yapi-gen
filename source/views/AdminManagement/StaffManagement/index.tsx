/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-negated-condition */
// 公司成员主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undefined */
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Menu, message } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './components/StaffTable'
import { OptionalFeld } from '@/components/OptionalFeld'
import { StaffPersonal } from './components/StaffPower'
import { HoverWrap, DividerWrap } from '@/components/StyleCommon'
import SearchList from './components/SearchList'
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
import { setCurrentMenu, setIsRefresh } from '@store/user'
import InputSearch from '@/components/InputSearch'
import PaginationBox from '@/components/TablePagination'
import SetShowField from '@/components/SetShowField/indedx'
import { useNavigate } from 'react-router-dom'
import HandOverModal from '@/components/HandOverModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import PermissionWrap from '@/components/PermissionWrap'
import { confirmHand, restHand } from '@/services/handover'
import ResizeTable from '@/components/ResizeTable'

export const tableWrapP = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`

const Reset = styled.div`
  height: 32px;
  background: var(--hover-d2);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 16px 5px 16px;
  margin-right: 16px;
  color: var(--neutral-n2);
  cursor: pointer;
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
  const { menuPermission } = useSelector(store => store.user)
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
  const [isVisibleFieldsA, setIsVisibleFieldsA] = useState(false)
  const [isVisibleFieldsB, setIsVisibleFieldsB] = useState(false)
  const [isVisibleFieldsC, setIsVisibleFieldsC] = useState(false)
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
    'handover_status',
  ])
  const [titleList2, setTitleList2] = useState<CheckboxValueType[]>([
    'created_at',
  ])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const hasCheck = getIsPermission(userInfo?.company_permissions, 'b/user/info')
  const navigate = useNavigate()
  const isHaveCheck = userInfo?.company_permissions?.filter(
    (i: any) => i.identity === 'b/companyuser/info',
  )?.length

  const getStaffListData = async () => {
    setIsSpinning(true)
    const res = await getStaffList({
      jobId: searchGroups.jobId,
      departmentId: searchGroups.departmentId,
      userGroupId: searchGroups.userGroupId,
      handover_status: searchGroups?.handover_status,
      status: searchGroups?.status,
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
  const controlStaffPersonalVisibleA = (e: any) => {
    setEditData(e)
    if (e.project_num === 0) {
      setIsVisibleFieldsB(true)
      return
    }

    setIsVisibleFieldsA(true)
  }
  const controlStaffPersonalVisibleC = (e: any) => {
    setEditData(e)
    setIsVisibleFieldsC(true)
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

  const menuTable = (record: any) => {
    const items = [
      {
        key: '1',
        label: (
          <div onClick={() => controlStaffPersonalVisible(record)}>
            {t('staff.setPermission')}
          </div>
        ),
      },
      {
        key: '12',
        label: (
          <div onClick={() => controlStaffPersonalVisibleA(record)}>
            {t('quitAndHandover')}
          </div>
        ),
      },
      {
        key: '123',
        label: (
          <div onClick={() => controlStaffPersonalVisibleC(record)}>
            {t('the_handover_state_is_restored')}
          </div>
        ),
      },
    ]
    let newArr: any = []
    if (record.handover_status === 1) {
      newArr = items.slice(0, 2)
    } else if (record.handover_status === 2) {
      newArr = items.slice(2, 3)
    }
    return <Menu items={newArr} />
  }

  const onToDetail = (row: any) => {
    if (row.id === userInfo.id) {
      navigate('/ProjectManagement/Mine/Profile')
    } else {
      const params = encryptPhp(
        JSON.stringify({ id: '', isMember: false, userId: row.id }),
      )
      navigate(`/AdminManagement/MemberInfo/Profile?data=${params}`)
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
          const isEdit = (
            userInfo.company_permissions?.map((i: any) => i.identity) || []
          ).includes('b/companyuser/update')
          return (
            isEdit && (
              <div>
                <MoreDropdown menu={menuTable(record)} />
              </div>
            )
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
              {!hasCheck ? (
                '--'
              ) : (
                <span
                  onClick={() => onToDetail(record)}
                  style={{
                    fontSize: 14,
                    color: 'var(--primary-d2)',
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
    const resultLast = isHaveCheck ? lastList : []
    return [...arrList, ...newList, ...resultLast]
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
      handover_status: e?.handover_status,
      status: e?.status,
    })
  }
  const onChangePage = (newPage: any, size: any) => {
    setPagesize(size)
    setPage(newPage)
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

  if (!loadingState) {
    return <Loading />
  }

  const onConfirm = async () => {
    const res1 = await confirmHand({ id: editData.id })

    if (res1.code === 0) {
      message.success(t('succeed'))

      setIsVisibleFieldsB(false)
      getStaffListData()
    }
  }
  const onConfirm2 = async () => {
    const res = await restHand(editData.id)
    if (res.code === 0) {
      message.success(t('succeed'))
      setIsVisibleFieldsC(false)
      getStaffListData()
    }
  }
  return (
    <PermissionWrap
      auth="/AdminManagement/StaffManagement"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '72px',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--neutral-n1-d1)',
          }}
        >
          {t('staff.companyStaff')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputSearch
            leftIcon={true}
            width={292}
            placeholder={t('staff.pleaseKey')}
            onChangeSearch={onPressEnter}
          />

          <Reset
            style={{ whiteSpace: 'nowrap', margin: '0 24px' }}
            onClick={rest}
          >
            {t('staff.refresh')}
          </Reset>

          <HoverWrap
            onClick={onChangeFilter}
            isActive={isShow}
            style={{ marginRight: '8px' }}
          >
            <IconFont className="iconMain" type="filter" />
            <span style={{ whiteSpace: 'nowrap' }} className="label">
              {t('common.search')}
            </span>
          </HoverWrap>
          <DividerWrap type="vertical" />
          <DropDownMenu
            menu={<SetShowField notView onChangeFieldVisible={showModal} />}
            icon="settings"
            isVisible={isVisibleFields}
            onChangeVisible={setIsVisibleFields}
            isActive={isModalVisible}
          >
            <div style={{ whiteSpace: 'nowrap' }}>
              {t('common.tableFieldSet')}
            </div>
          </DropDownMenu>
        </div>
      </div>
      {isShow ? <SearchList onSearch={onSearch} /> : null}
      <div
        style={{
          height: 'calc(100vh - 192px)',
          overflow: 'auto',
          padding: '0 24px',
        }}
      >
        <ResizeTable
          isSpinning={isSpinning}
          dataWrapNormalHeight="100%"
          col={selectColum}
          dataSource={listData}
          noData={<NoData />}
        />
      </div>
      <PaginationBox
        total={total}
        pageSize={pagesize}
        currentPage={page}
        onChange={onChangePage}
      />

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
      <HandOverModal
        id={editData}
        confirm={() => getStaffListData()}
        close={() => setIsVisibleFieldsA(false)}
        visible={isVisibleFieldsA}
      />
      <DeleteConfirm
        title={t('quitAndHandover')}
        text={`${editData.name}${t(
          'currently_not_involved_in_any_projects_confirm_will',
        )}【${editData.name}】${t('work_handover')}`}
        onConfirm={onConfirm}
        onChangeVisible={() => setIsVisibleFieldsB(false)}
        isVisible={isVisibleFieldsB}
      />
      <DeleteConfirm
        title={t('the_handover_state_is_restored')}
        text={`${t('confirmation_will')}【${editData.name}】${t(
          'the_handover_status_of_is_changed_to_the_normal_state',
        )}`}
        onConfirm={onConfirm2}
        onChangeVisible={() => setIsVisibleFieldsC(false)}
        isVisible={isVisibleFieldsC}
      />
      <StaffPersonal
        data={editData}
        isVisible={isStaffPersonalVisible}
        onClose={() => {
          setIsStaffPersonalVisible(false)
        }}
        onConfirm={closeStaffPersonal}
      />
    </PermissionWrap>
  )
}

export default StaffManagement
