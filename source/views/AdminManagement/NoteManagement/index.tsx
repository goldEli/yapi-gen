/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-negated-condition */
// 公司成员主页

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undefined */
import { useEffect, useRef, useState } from 'react'
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
import { AnyIfEmpty } from 'react-redux'

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
  margin-right: 1px;
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
  const [detailInner, setDetailInner] = useState<any>()
  const [memberVisible, setMemberVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const { userInfo, isRefresh } = useSelector(store => store.user)
  const { menuPermission } = useSelector(store => store.user)
  const [isShow, setIsShow] = useState<boolean>(false)
  const heightV = useRef<HTMLDivElement>(null)
  const [maxPage, setMaxPage] = useState<number>(1)
  const [page, setPage] = useState<number>(1)
  const [showId, setShowId] = useState('')
  const [lheight, setLheight] = useState<any>()
  const [pagesize, setPagesize] = useState<number>(10)
  const [editId, setEditId] = useState<any>()
  const [keyword, setKeyword] = useState<string>()
  const [searchGroups, setSearchGroups] = useState<any>({
    end_at: undefined,
    receive_user_ids: undefined,
    send_type: undefined,
    send_user_ids: undefined,
    start_at: undefined,
    type: undefined,
  })

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

    const data = await getMyAllSysNotice({
      ...searchGroups1,
      keyword: keyword ? keyword : undefined,
      page,
      pagesize,
    })
    setMaxPage(data.timing_count)
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
    setPage(1)
    setSearchGroups(e)
  }

  const onPressEnter = (value: any) => {
    setHasMore(true)
    setPage(1)
    setKeyword(value)
  }

  const refresh = debounce(
    async () => {
      setPage(1)
      getStaffListData()
      getMessage({ msg: t('staff.refreshSuccess'), type: 'success' })
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
      title: t('confirmationOfDeletion'),
      text: t('confirm_to_delete_the_message'),
      async onConfirm() {
        const res = await delSysNotice(id)

        if (res.code === 0) {
          setHasMore(true)
          setPage(1)
          getMessage({
            msg: t('common.deleteSuccess') as string,
            type: 'success',
          })
          getStaffListData()
          return Promise.resolve()
        }
      },
    })
  }
  const onRevocation = (id: any) => {
    open({
      title: t('retract_confirmation'),
      text: t('confirm_to_withdraw_the_message'),
      async onConfirm() {
        const res = await recallSysNotice(id)

        if (res.code === 0) {
          setHasMore(true)
          setPage(1)

          getMessage({
            msg: t('succeed') as string,
            type: 'success',
          })
          getStaffListData()
          return Promise.resolve()
        }
      },
    })
  }

  const onShowDetail = (values: any) => {
    setDetailInner(values)
    setDetailVisible(true)
  }
  const onHandleOk = () => {
    init()
  }
  useEffect(() => {
    init()
  }, [keyword, searchGroups, page])

  const showNumber = (id: any) => {
    setShowId(id)
    setMemberVisible(true)
  }
  const onEditDetail = (datas: any) => {
    setVisible(true)
    setEditId(datas.id)
  }
  useEffect(() => {
    setLheight(heightV?.current?.offsetHeight)
    console.log(heightV?.current?.offsetHeight)
  }, [isShow])

  return (
    <PermissionWrap
      auth="/AdminManagement/StaffManagement"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
      <DeleteConfirmModal />
      <CreateNoteModal
        editId={editId}
        onClose={() => setVisible(false)}
        onHandleOk={onHandleOk}
        isVisible={visible}
      />

      <MemberModal
        onCloseMember={() => setMemberVisible(false)}
        showId={showId}
        isVisible={memberVisible}
      />
      <NoteDetailDrawer
        detailInner={detailInner}
        onCancel={() => setDetailVisible(false)}
        isVisible={detailVisible}
        reportIds={list?.map((i: any) => i.id)}
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
          {t('notification_management')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={inputSearch}>
            <InputSearch
              leftIcon
              width={184}
              placeholder={t('enter_notification_content')}
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
        ref={heightV}
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
          padding: '0 24px 24px 24px',
          alignItems: 'center',
        }}
      >
        <CommonButton
          onClick={() => {
            setEditId(null)
            setVisible(true)
          }}
          type="primary"
        >
          {t('send_new_notification')}
        </CommonButton>
        <span
          style={{
            color: 'var(--neutral-n3)',
            marginLeft: 8,
          }}
        >
          {t('scheduled_notification')}（{maxPage}）
        </span>
      </div>
      <div>
        <InfiniteScroll
          dataLength={list.length}
          next={() => fetchMoreData()}
          style={{
            overflow: 'auto',
            height: `calc(100vh - 220px - ${lheight}px)`,
            padding: '0px 24px',

            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
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
              onShowNumber={showNumber}
              values={i}
              onDel={onDel}
              onEditDetail={onEditDetail}
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
