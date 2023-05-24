/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-negated-condition */
// 公司成员主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undefined */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Menu, Skeleton, message } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'

import { DividerWrap } from '@/components/StyleCommon'

import { getIsPermission } from '@/tools/index'
import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { debounce } from 'lodash'
import { encryptPhp } from '@/tools/cryptoPhp'
import useSetTitle from '@/hooks/useSetTitle'
import {
  getStaffList,
  refreshStaff,
  updateStaff,
  batchUpdateStaff,
} from '@/services/staff'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import InputSearch from '@/components/InputSearch'
import { useNavigate } from 'react-router-dom'
import PermissionWrap from '@/components/PermissionWrap'
import { confirmHand, restHand } from '@/services/handover'
import ScreenMinHover from '@/components/ScreenMinHover'
import { getMessage } from '@/components/Message'
import SearchList from '../StaffManagement/components/SearchList'
import SearchList2 from './components/SearchList2'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { TextChange } from '@/components/TextChange/TextChange'
import NoteCard from '@/views/NoteCard/NoteCard'
import { scrollListWrap } from '@/views/SiteNotifications/AllNotes'
import InfiniteScroll from 'react-infinite-scroll-component'
import CreateNoteModal from './components/CreateNoteModal/CreateNoteModal'
import NoteDetailDrawer from './components/NoteDetailDrawer/NoteDetailDrawer'
import MemberModal from './components/MemberModal/MemberModal'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'

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

const inputSearch = css`
  margin-right: 24px;
`

const settingWrap = css`
  margin: 0 8px;
`

const StaffManagement = () => {
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
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
  const [batchEditVisible, setBatchEditVisible] = useState(false)
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
  const [hasMore, setHasMore] = useState(true)
  const [visible, setVisible] = useState(false)
  const hasCheck = getIsPermission(userInfo?.company_permissions, 'b/user/info')
  const navigate = useNavigate()
  const isHaveCheck = userInfo?.company_permissions?.filter(
    (i: any) => i.identity === 'b/companyuser/info',
  )?.length

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [roleOptions, setRoleOptions] = useState<number[]>([])
  const [list, setList] = useState(Array.from({ length: 20 }))
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
      getMessage({ msg: res.message, type: 'success' })
      getStaffListData()
      setIsStaffPersonalVisible(false)
    }
  }

  const onConfirmBatchEdit = async (roleId: any) => {
    try {
      await batchUpdateStaff({
        roleId,
        userIds: selectedRowKeys.map(i => Number(i)),
      })
      getMessage({ msg: t('report.list.success'), type: 'success' })
      setSelectedRowKeys([])
      getStaffListData()
      setBatchEditVisible(false)
    } catch (error) {
      //
    }
  }

  const updateOrderkey = (key: any, orderVal: any) => {
    setOrderKey(key)
    setOrder(orderVal)
  }

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
      navigate(`/MemberInfo/Profile?data=${params}`)
    }
  }
  const onOperationCheckbox = (keys: number[]) => {
    const redClassElements = document.getElementsByClassName(
      'ant-checkbox-wrapper',
    )
    for (const i of redClassElements) {
      if (i.getElementsByClassName('tagLength')[0]) {
        i.removeChild(i.getElementsByClassName('tagLength')[0])
      }
      if (keys?.length > 0) {
        const div2 = document.createElement('div')
        div2.innerText = String(keys.length)
        div2.className = 'tagLength'
        i.appendChild(div2)
      }
    }
  }
  const onSelectChange = (keys: number[]) => {
    setSelectedRowKeys(keys)
    onOperationCheckbox(keys)
  }

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
    message.success({
      icon: <span></span>,
      duration: 0,
      content: <TextChange />,
      className: 'custom-class',
    })
  }, [])
  useEffect(() => {
    setAllTitleList([...titleList, ...titleList2])
    init()
  }, [keyword, searchGroups, orderKey, order, page, pagesize])

  const refresh = debounce(
    async () => {
      const res = await refreshStaff()
      if (res.code === 0) {
        getMessage({ msg: t('staff.refreshSuccess'), type: 'success' })
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
      getMessage({ msg: t('succeed'), type: 'success' })
      setIsVisibleFieldsB(false)
      getStaffListData()
    }
  }
  const onConfirm2 = async () => {
    const res = await restHand(editData.id)
    if (res.code === 0) {
      getMessage({ msg: t('succeed'), type: 'success' })
      setIsVisibleFieldsC(false)
      getStaffListData()
    }
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const fetchMoreData = () => {
    if (list.length >= 500) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      setList(list.concat(Array.from({ length: 20 })))
    }, 3000)
  }
  const onDel = (id: any) => {
    open({
      title: '删除确认',
      text: '确认删除该消息？',
      onConfirm() {
        return Promise.resolve()
      },
    })
    console.log(id)
  }
  const onRevocation = (id: any) => {
    open({
      title: '撤回确认',
      text: '确认撤回该消息？',
      onConfirm() {
        console.log('确认')

        return Promise.resolve()
      },
    })
    console.log(id)
  }
  return (
    <PermissionWrap
      auth="/AdminManagement/StaffManagement"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
      <DeleteConfirmModal />
      <CreateNoteModal
        onClose={() => setVisible(false)}
        onHandleOk={() => setVisible(false)}
        isVisible={visible}
      />

      <MemberModal />
      <NoteDetailDrawer />
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
            fontFamily: 'SiYuanMedium',
            color: 'var(--neutral-n1-d1)',
          }}
        >
          通知管理
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={inputSearch}>
            <InputSearch
              leftIcon
              width={184}
              placeholder="输入通知内容"
              onChangeSearch={onPressEnter}
            />
          </div>

          <ScreenMinHover
            label={t('common.search')}
            icon="filter"
            onClick={onChangeFilter}
            isActive={isShow}
            style={{ margin: '0 8px' }}
          />

          <DividerWrap type="vertical" />

          <ScreenMinHover
            label={t('common.refresh')}
            icon="sync"
            onClick={refresh}
            style={{ marginRight: 8 }}
          />
        </div>
      </div>
      <div
        style={{
          padding: '0 24px',
        }}
      >
        {isShow ? <SearchList2 onSearch={onSearch} /> : null}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '24px',
        }}
      >
        <CommonButton onClick={() => setVisible(true)} type="primary">
          发送新通知
        </CommonButton>
        <CommonButton type="primaryText"> 定时发送的通知（3）</CommonButton>
      </div>
      <div>
        <InfiniteScroll
          dataLength={list.length}
          next={fetchMoreData}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 220px)',
            padding: '0px 24px',

            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
          hasMore={hasMore}
          height={document.body.clientHeight - 220}
          loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          scrollableTarget="scrollableDiv"
        >
          {list.map((i: any) => (
            <NoteCard onDel={onDel} onRevocation={onRevocation} key={i} />
          ))}
        </InfiniteScroll>
      </div>
    </PermissionWrap>
  )
}

export default StaffManagement