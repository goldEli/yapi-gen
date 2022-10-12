/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable multiline-ternary */
import { useEffect, useMemo, useState } from 'react'
import {
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SetButton,
  tabCss,
  TabsHehavior,
  TabsItem,
  LabNumber,
  StaffTableWrap2,
  ShowWrap,
  TableWrap,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Dropdown, Menu, message, Pagination, Spin, Tooltip } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useModel } from '@/models'
import TableFilter from '@/components/TableFilter'
import EditDemand from '@/views/Project/Detail/Demand/components/EditDemand'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import NoData from '@/components/NoData'
import { useDynamicColumns } from '@/components/CreateProjectTableColumInfo'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

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
    [ShowWrap.toString()]: {
      visibility: 'visible',
    },
  },
})

const LoadingSpin = styled(Spin)({
  minHeight: 300,
  '.ant-spin-nested-loading, .ant-spin-container': {
    height: 'initial!important',
  },
})

const TableTitle = styled.div({
  color: '#323233',
  fontSize: '16px',
  height: '53px',
  display: 'flex',
  alignItems: 'center',
  marginLeft: '16px',
  fontWeight: '500',
  span: {
    borderLeft: '3px solid #2877ff',
    paddingLeft: 6,
    lineHeight: '20px',
  },
})

const SearchWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

interface MoreWrapProps {
  record: any
  onShowEdit(): void
  onShowDel(): void
}

const MoreWrap = (props: MoreWrapProps) => {
  const [t] = useTranslation()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const menu = () => {
    let menuItems = [
      {
        key: '1',
        label: <span onClick={props.onShowEdit}>{t('common.edit')}</span>,
      },
      {
        key: '2',
        label: <span onClick={props.onShowDel}>{t('common.del')}</span>,
      },
    ]

    if (!props?.record?.project?.isEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (!props?.record?.project?.isDelete) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu style={{ minWidth: 56 }} items={menuItems} />
  }
  return (
    <ShowWrap>
      <Dropdown
        key={isMoreVisible.toString()}
        visible={isMoreVisible}
        onVisibleChange={visible => setIsMoreVisible(visible)}
        trigger={['hover']}
        overlay={menu}
        placement="bottomLeft"
        getPopupContainer={node => node}
      >
        <RowIconFont type="more" />
      </Dropdown>
    </ShowWrap>
  )
}

// eslint-disable-next-line complexity
const CommonNeed = (props: any) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { isMember, userId } = paramsData
  const { deleteDemand } = useModel('demand')
  const { getIterateSelectList } = useModel('iterate')
  const { getField, getSearchField, updateDemandStatus, updatePriorityStatus }
    = useModel('mine')
  const {
    getUserInfoAbeyanceStory,
    getUserInfoCreateStory,
    getUserInfoFinishStory,
    getMemberInfoAbeyanceStory,
    getMemberInfoCreateStory,
    getMemberInfoFinishStory,
  } = useModel('member')
  const { isRefresh, setIsRefresh } = useModel('user')
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMany, setIsMany] = useState(
    !!props?.isMember && props?.type === 'abeyance',
  )
  const [operationItem, setOperationItem] = useState<any>()
  const [projectId, setProjectId] = useState<any>()
  const [listData, setListData] = useState<any>({
    list: undefined,
  })
  const [manyListData, setManyListData] = useState<any>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(10)
  const [total, setTotal] = useState<number>()
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const [keyword, setKeyword] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  const [filterCustomList, setFilterCustomList] = useState<any[]>([])
  const [isSpin, setIsSpin] = useState<boolean>(false)
  const [searchGroups, setSearchGroups] = useState<any>({
    statusId: [],
    priorityId: [],
    iterateId: [],
    tagId: [],
    userId: [],
    usersnameId: [],
    usersCopysendNameId: [],
    createdAtId: [],
    expectedStartAtId: [],
    expectedendat: [],
    updatedat: [],
    finishAt: [],
  })
  const onSearch = (e: any, customField: any) => {
    setSearchGroups({
      statusId: e.status,
      priorityId: e.priority,
      iterateId: e.iterate_name,
      tagId: e.tag,
      userId: e.user_name,
      usersnameId: e.users_name,
      usersCopysendNameId: e.users_copysend_name,
      createdAtId: e.created_at,
      expectedStartAtId: e.expected_start_at,
      expectedendat: e.expected_end_at,
      updatedat: e.updated_at,
      finishAt: e.finish_at,
      class_ids: e.category,
      category_id: e.class,
      schedule_start: e.schedule?.start,
      schedule_end: e.schedule?.end,
      custom_field: customField,
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const updateOrderkey = (key: any, order: any) => {
    setOrderKey(key)
    setOrder(order)
  }
  const init = async (pageNumber?: any, updateState?: boolean) => {
    if (!updateState) {
      setIsSpin(true)
    }

    if (isMany) {
      const params = {
        projectId: props.id,
        all: isMany ? 1 : '',
        panelDate: isMany ? 1 : '',
        targetId: userId,
      }
      const res = isMember
        ? await getMemberInfoAbeyanceStory(params)
        : await getUserInfoAbeyanceStory(params)
      setManyListData(res)
      setIsSpin(false)
    }

    if (!isMany) {
      const params = {
        projectId: props.id,
        keyword,
        searchGroups,
        order,
        orderkey: orderKey,
        page: pageNumber ? pageNumber : page,
        pagesize,
        targetId: userId,
      }

      let res: any

      if (isMember) {
        res
          = props?.type === 'abeyance'
            ? await getMemberInfoAbeyanceStory(params)
            : props?.type === 'create'
              ? await getMemberInfoCreateStory(params)
              : await getMemberInfoFinishStory(params)
      } else {
        res
          = props?.type === 'abeyance'
            ? await getUserInfoAbeyanceStory(params)
            : props?.type === 'create'
              ? await getUserInfoCreateStory(params)
              : await getUserInfoFinishStory(params)
      }

      setListData(res)
      setTotal(res?.pager?.total)
      setIsSpin(false)
    }
  }

  const updateStatus = async (res1: any) => {
    const res = await updateDemandStatus(res1)

    if (res.code === 0) {
      message.success(t('common.circulationSuccess'))
      init()
    }
  }
  const updatePriority = async (res1: any) => {
    const res = await updatePriorityStatus(res1)
    if (res.code === 0) {
      message.success(t('common.prioritySuccess'))
    }

    init()
  }
  const showEdit = async (record: any) => {
    setProjectId(record.project_id)
    setOperationItem(record.id)
    await getIterateSelectList({ projectId: record.project_id, all: true })
    setIsVisible(true)
  }
  const showDel = (record: any) => {
    setProjectId(record.project_id)
    setOperationItem(record.id)
    setIsDelVisible(true)
  }
  const columns = useDynamicColumns({
    orderKey,
    order,
    updateOrderkey,
    updateStatus,
    updatePriority,
    init,
    showOpen: true,
  })

  const selectColum: any = useMemo(() => {
    const arr = [...titleList, ...titleList2, ...titleList3]
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
            <>
              {!props?.record?.project?.isEdit
              && !props?.record?.project?.isDelete ? (
                    <MoreWrap
                      record={record}
                      onShowEdit={() => showEdit(record)}
                      onShowDel={() => showDel(record)}
                    />
                  ) : null}
            </>
          )
        },
      },
    ]
    return [...arrList, ...newList]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleList, columns])

  const getShowkey = async () => {
    const res2 = await getField(props.id)
    setPlainOptions(res2.plainOptions)
    setPlainOptions2(res2.plainOptions2)
    setPlainOptions3(res2.plainOptions3)
    setTitleList(res2.titleList)
    setTitleList2(res2.titleList2)
    setTitleList3(res2.titleList3)
    setIsRefresh(false)
  }

  const getSearchKey = async (key?: any, type?: number) => {
    if (key && type === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      return
    }
    if (key && type === 1) {
      const res = await getSearchField(props.id)
      const addList = res.filterAllList.filter(
        (item: any) => item.content === key,
      )

      setSearchList([...searchList, ...addList])

      return
    }

    const res = await getSearchField(props.id)
    const arr = res?.filterAllList?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
    setFilterBasicsList(res?.filterBasicsList)
    setFilterSpecialList(res?.filterSpecialList)
    setFilterCustomList(res?.filterCustomList)
    setIsRefresh(false)
  }

  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }
  const onPressEnter = (e: any) => {
    setKeyword(e.target.value)
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pagesize])

  useEffect(() => {
    setPage(1)
    init(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, orderKey, order, props.id, searchGroups, isMany])

  useEffect(() => {
    getSearchKey()
  }, [props.id])

  useEffect(() => {
    getShowkey()
  }, [])

  useEffect(() => {
    if (isRefresh) {
      init()
      getShowkey()
      if (props?.id) {
        getSearchKey()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefresh])

  const showModal = () => {
    setIsModalVisible(true)
  }
  const close2 = () => {
    setIsModalVisible(false)
  }

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
    list3: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
    setTitleList3(list3)
  }

  const onChangeVisible = () => {
    setIsVisible(false)
  }

  const onUpdate = () => {
    init()
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: operationItem })
      message.success(t('common.deleteSuccess'))
      setIsDelVisible(false)
      init()
    } catch (error) {

      //
    }
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

  const onChangeMany = (state: boolean) => {
    setIsMany(state)
  }

  return (
    <>
      <div style={{ borderLeft: '1px solid #EBEDF0' }}>
        <TabsHehavior
          style={{ padding: '0 24px', justifyContent: 'space-between' }}
        >
          <div className={tabCss}>
            <TabsItem isActive>
              <div>{props?.subTitle}</div>
            </TabsItem>
            <LabNumber isActive>{total ?? 0}</LabNumber>
          </div>
          <SearchWrap>
            <div style={{ marginRight: 16 }}>
              <MyInput
                suffix={
                  <IconFont
                    type="search"
                    style={{ color: '#BBBDBF', fontSize: 20 }}
                  />
                }
                onPressEnter={onPressEnter}
                onBlur={onPressEnter}
                placeholder={t('common.pleaseSearchDemand')}
                allowClear
              />
            </div>
            <div style={{ display: 'flex' }}>
              {props?.isMember ? null : (
                <>
                  <SetButton
                    onClick={() => {
                      onChangeMany(false)
                    }}
                  >
                    <Tooltip title={t('common.list')}>
                      <IconFont
                        type="unorderedlist"
                        style={{ fontSize: 20, color: isMany ? '' : '#4388ff' }}
                      />
                    </Tooltip>
                  </SetButton>
                  <SetButton
                    onClick={() => {
                      onChangeMany(true)
                    }}
                  >
                    <Tooltip title={t('common.timeList')}>
                      <IconFont
                        type="database"
                        style={{ fontSize: 20, color: isMany ? '#4388ff' : '' }}
                      />
                    </Tooltip>
                  </SetButton>
                </>
              )}

              {props.id !== 0 && (
                <SetButton onClick={() => setIsShowSearch(!isShowSearch)}>
                  <Tooltip title={t('common.search')}>
                    <IconFont
                      type="filter"
                      style={{
                        fontSize: 20,
                        color: isShowSearch ? '#2877ff' : '',
                      }}
                    />
                  </Tooltip>
                </SetButton>
              )}

              <Dropdown
                overlay={menu}
                placement="bottomLeft"
                trigger={['click']}
              >
                <SetButton>
                  <Tooltip title={t('common.tableFieldSet')}>
                    <IconFont type="settings" style={{ fontSize: 20 }} />
                  </Tooltip>
                </SetButton>
              </Dropdown>
            </div>
          </SearchWrap>
        </TabsHehavior>
      </div>

      {isShowSearch && props.id !== 0 ? (
        <div style={{ borderLeft: '1px solid #EBEDF0' }}>
          <TableFilter
            onFilter={getSearchKey}
            onSearch={onSearch}
            list={searchList}
            basicsList={filterBasicsList}
            specialList={filterSpecialList}
            customList={filterCustomList}
          />
        </div>
      ) : null}
      {!isMany && (
        <div>
          <LoadingSpin spinning={isSpin}>
            <StaffTableWrap>
              {listData?.list
                ? listData?.list?.length ? (
                  <TableBox
                    rowKey="id"
                    columns={selectColum}
                    dataSource={listData?.list}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                  />
                )
                  : <NoData />

                : null}
            </StaffTableWrap>
          </LoadingSpin>
        </div>
      )}

      {isMany ? (
        <div>
          <LoadingSpin spinning={isSpin}>
            <StaffTableWrap2>
              {manyListData?.map((item: any, index: any) => (
                // eslint-disable-next-line react/no-array-index-key
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: 6,
                    marginTop: 16,
                  }}
                >
                  <TableTitle>
                    <span>
                      {item.status_name}（{item.list.length}）
                    </span>
                  </TableTitle>

                  {item.list
                    ? item?.list?.length ? (
                      <TableBox
                        rowKey="id"
                        columns={selectColum}
                        dataSource={item.list}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                      />
                    )
                      : <NoData />

                    : null}
                </div>
              ))}
            </StaffTableWrap2>
          </LoadingSpin>
        </div>
      ) : null}

      {!isMany && (
        <PaginationWrap style={{ paddingRight: 24 }}>
          <Pagination
            defaultCurrent={1}
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
      )}
      {isModalVisible ? (
        <OptionalFeld
          plainOptions={plainOptions}
          plainOptions2={plainOptions2}
          plainOptions3={plainOptions3}
          checkList={titleList}
          checkList2={titleList2}
          checkList3={titleList3}
          isVisible={isModalVisible}
          onClose={close2}
          getCheckList={getCheckList}
        />
      ) : null}
      {isVisible ? (
        <EditDemand
          visible={isVisible}
          onChangeVisible={onChangeVisible}
          id={operationItem}
          preId={projectId}
          onUpdate={onUpdate}
        />
      ) : null}
      <DeleteConfirm
        text={t('common.confirmDelDemand')}
        isVisible={isDelVisible}
        onChangeVisible={() => setIsDelVisible(!isDelVisible)}
        onConfirm={onDeleteConfirm}
      />
    </>
  )
}

export default CommonNeed
