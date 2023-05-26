/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-negated-condition */
// 公司成员主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undefined */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Divider, Skeleton } from 'antd'

import { DividerWrap } from '@/components/StyleCommon'

import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import useSetTitle from '@/hooks/useSetTitle'
import { refreshStaff } from '@/services/staff'
import { useDispatch, useSelector } from '@store/index'
import InputSearch from '@/components/InputSearch'
import PermissionWrap from '@/components/PermissionWrap'
import ScreenMinHover from '@/components/ScreenMinHover'
import { getMessage } from '@/components/Message'
import SearchList2 from './components/SearchList2'
import CommonButton from '@/components/CommonButton'
import NoteCard from '@/views/NoteCard/NoteCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import CreateNoteModal from './components/CreateNoteModal/CreateNoteModal'
import NoteDetailDrawer from './components/NoteDetailDrawer/NoteDetailDrawer'
import MemberModal from './components/MemberModal/MemberModal'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import {
  delSysNotice,
  getMyAllSysNotice,
  recallSysNotice,
} from '@/services/sysNotice'
import NoData from '@/components/NoData'

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
  const [memberVisible, setMemberVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const { userInfo, isRefresh } = useSelector(store => store.user)
  const { menuPermission } = useSelector(store => store.user)
  const [isShow, setIsShow] = useState<boolean>(false)

  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>()
  const [searchGroups, setSearchGroups] = useState<any>({
    end_at: undefined,
    receive_user_ids: undefined,
    send_type: undefined,
    send_user_ids: undefined,
    start_at: undefined,
    type: undefined,
  })

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const [isVisibleFields, setIsVisibleFields] = useState(false)

  const [hasMore, setHasMore] = useState(true)
  const [visible, setVisible] = useState(false)

  const isHaveCheck = userInfo?.company_permissions?.filter(
    (i: any) => i.identity === 'b/companyuser/info',
  )?.length

  const [list, setList] = useState<any>([])
  function convertArrayAndEmptyString(obj: any) {
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        // 将数组转换为字符串
        obj[key] = obj[key].join(',')
      }
      if (obj[key] === '') {
        // 将空字符串转换为 undefined
        obj[key] = undefined
      }
    }
  }
  const getStaffListData = async () => {
    const searchGroups1 = JSON.parse(JSON.stringify(searchGroups))
    convertArrayAndEmptyString(searchGroups1)
    console.log(searchGroups1)

    const data = await getMyAllSysNotice({
      ...searchGroups1,
      keyword,
      page,
      pagesize,
    })
    if (page === 1) {
      setList(data.list)
      if (data.pager.total <= 10) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      return
    }

    if (list.length < data.pager.total) {
      setList((e: any) => e.concat(data.list))
    }
    if (list.length === data.pager.total) {
      setHasMore(false)
    }
    console.log(list.length, data.pager.total, '数量')
  }

  const init = () => {
    getStaffListData()
  }

  useEffect(() => {
    if (isRefresh) {
      init()
    }
  }, [isRefresh])

  const onSearch = async (e: any) => {
    console.log(e)
    setPage(1)
    setSearchGroups(e)
  }

  const onPressEnter = (value: any) => {
    setHasMore(true)
    setPage(1)
    setKeyword(value)
  }
  // useEffect(() => {
  //   message.success({
  //     icon: <span></span>,
  //     duration: 0,
  //     content: <TextChange />,
  //     className: 'custom-class',
  //   })
  // }, [])

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

  const fetchMoreData = () => {
    setPage(i => i + 1)
  }
  const onDel = (id: any) => {
    open({
      title: '删除确认',
      text: '确认删除该消息？',
      async onConfirm() {
        const res = await delSysNotice(id)
        console.log(res.code)

        if (res.code === 0) {
          setHasMore(true)
          setPage(1)
          getMessage({
            msg: t('common.editSuccess') as string,
            type: 'success',
          })
          return Promise.resolve()
        }
      },
    })
    console.log(id)
  }
  const onRevocation = (id: any) => {
    open({
      title: '撤回确认',
      text: '确认撤回该消息？',
      async onConfirm() {
        console.log('确认')
        const res = await recallSysNotice(id)
        console.log(res.code)
        if (res.code === 0) {
          setHasMore(true)
          setPage(1)
          getMessage({
            msg: t('common.editSuccess') as string,
            type: 'success',
          })
          return Promise.resolve()
        }
      },
    })
    console.log(id)
  }

  const onShowDetail = () => {
    setDetailVisible(true)
  }
  const onHandleOk = (datas: any) => {
    console.log(datas)
  }
  useEffect(() => {
    init()
  }, [keyword, searchGroups, page])
  console.log(list, '现在的列表')

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
        onHandleOk={onHandleOk}
        isVisible={visible}
      />

      <MemberModal isVisible={memberVisible} />
      <NoteDetailDrawer
        onCancel={() => setDetailVisible(false)}
        isVisible={detailVisible}
      />
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
          next={() => fetchMoreData()}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 320px)',
            padding: '0px 24px',

            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
          hasMore={hasMore}
          height={document.body.clientHeight - 220}
          loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          scrollableTarget="scrollableDiv"
          endMessage={
            list.length < 1 ? <NoData /> : <Divider plain>{t('nm')} </Divider>
          }
        >
          {list.map((i: any) => (
            <NoteCard
              values={i}
              onDel={onDel}
              onShowDetail={onShowDetail}
              onRevocation={onRevocation}
              key={i.id}
            />
          ))}
        </InfiniteScroll>
      </div>
    </PermissionWrap>
  )
}

export default StaffManagement
