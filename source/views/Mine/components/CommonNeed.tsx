// 我的模块-所有页面公用列表及查询

/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import {
  PaginationWrap,
  StaffTableWrap,
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
import { useDynamicColumns } from '@/components/CreateProjectTableColumInfo'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useModel } from '@/models'
import TableFilter from '@/components/TableFilter'
import EditDemand from '@/components/EditDemand'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import NoData from '@/components/NoData'
import CommonInput from '@/components/CommonInput'
import MoreDropdown from '@/components/MoreDropdown'

const TableBox = styled(TableWrap)({
  '.ant-table-content': {
    minHeight: '460px',
  },
  '.ant-table-row:hover': {
    [ShowWrap.toString()]: {
      visibility: 'visible',
    },
    '.dropdownIcon': {
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
  const onClickMenu = (type?: any) => {
    setIsMoreVisible(false)
    if (type === 'edit') {
      props.onShowEdit()
    } else {
      props.onShowDel()
    }
  }
  const menu = (
    <Menu
      style={{ minWidth: 56 }}
      items={[
        {
          key: '1',
          label: (
            <div onClick={() => onClickMenu('edit')}>{t('common.edit')}</div>
          ),
        },
        {
          key: '2',
          label: (
            <div onClick={() => onClickMenu('del')}>{t('common.del')}</div>
          ),
        },
      ]}
    />
  )
  return (
    <ShowWrap>
      {(props?.record?.project?.isEdit || props?.record?.project?.isDelete) && (
        <MoreDropdown
          isMoreVisible={isMoreVisible}
          onChangeVisible={setIsMoreVisible}
          menu={menu}
        />
      )}
    </ShowWrap>
  )
}

const CommonNeed = (props: any) => {
  const [t] = useTranslation()
  const { deleteDemand } = useModel('demand')
  const { getIterateSelectList } = useModel('iterate')
  const {
    getField,
    getSearchField,
    updateDemandStatus,
    updatePriorityStatus,
    getMineNoFinishList,
    getMineCreacteList,
    getMineFinishList,
    getMineNeedList,
    isUpdateCreate,
    setIsUpdateCreate,
  } = useModel('mine')
  const { isRefresh, setIsRefresh } = useModel('user')
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMany, setIsMany] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const [projectId, setProjectId] = useState<any>()
  const [listData, setListData] = useState<any>({
    list: undefined,
  })
  const [manyListData, setManyListData] = useState<any>({
    list: undefined,
  })
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(20)
  const [total, setTotal] = useState<number>()
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const [keyword, setKeyword] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
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
      class_ids: e.class,
      category_id: e.category,
      schedule_start: e.schedule?.start,
      schedule_end: e.schedule?.end,
      custom_field: customField,
    })
  }
  const updateOrderkey = (key: any, orderVal: any) => {
    setOrderKey(key)
    setOrder(orderVal)
  }
  const init = async (updateState?: boolean, pageNumber?: any) => {
    if (!updateState) {
      setIsSpin(true)
    }
    setListData({ list: undefined })
    setManyListData({ list: undefined })

    if (isMany) {
      const params = {
        projectId: props.id,
        all: isMany ? 1 : '',
        panelDate: isMany ? 1 : '',
      }
      const res = await getMineNoFinishList(params)
      setManyListData({ list: res })
      setIsSpin(false)
      setIsUpdateCreate(false)
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
      }

      const res =
        props?.type === 'abeyance'
          ? await getMineNoFinishList(params)
          : props?.type === 'create'
          ? await getMineCreacteList(params)
          : props?.type === 'finish'
          ? await getMineFinishList(params)
          : await getMineNeedList(params)

      setListData(res)
      setTotal(res?.pager?.total)
      setIsSpin(false)
      setIsUpdateCreate(false)
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
    setOperationItem(record)
    await getIterateSelectList({ projectId: record.project_id, all: true })
    setIsVisible(true)
  }
  const showDel = (record: any) => {
    setProjectId(record.project_id)
    setOperationItem(record)
    setIsDelVisible(true)
  }
  const columns = useDynamicColumns({
    orderKey,
    order,
    updateOrderkey,
    updateStatus,
    updatePriority,
    init,
    plainOptions3,
  })

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
        render: (text: any, record: any) => {
          return (
            <MoreWrap
              record={record}
              onShowEdit={() => showEdit(record)}
              onShowDel={() => showDel(record)}
            />
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
    setAllTitleList([...res2.titleList, ...res2.titleList2, ...res2.titleList3])
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
  const onPressEnter = (value: any) => {
    setKeyword(value)
  }

  useEffect(() => {
    init()
  }, [page, pagesize])

  useEffect(() => {
    setPage(1)
    init(false, 1)
  }, [keyword, orderKey, order, props.id, searchGroups, isMany])

  useEffect(() => {
    getSearchKey()
    getShowkey()
  }, [props.id])

  useEffect(() => {
    if (isRefresh || isUpdateCreate) {
      init()
      getShowkey()
      if (props?.id) {
        getSearchKey()
      }
    }
  }, [isRefresh, isUpdateCreate])

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
    all: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
    setTitleList3(list3)
    setAllTitleList(all)
  }

  const onChangeVisible = () => {
    setIsVisible(false)
  }

  const onUpdate = () => {
    init()
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: operationItem?.id })
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
            <CommonInput
              placeholder={t('common.pleaseSearchDemand')}
              onChangeSearch={onPressEnter}
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
                  <Tooltip
                    title={t('common.list')}
                    getPopupContainer={node => node}
                  >
                    <IconFont
                      type="unorderedlist"
                      style={{ fontSize: 20, color: isMany ? '' : '#4388ff' }}
                    />
                  </Tooltip>
                </SetButton>
                {props?.type === 'abeyance' && (
                  <SetButton
                    onClick={() => {
                      onChangeMany(true)
                    }}
                  >
                    <Tooltip
                      title={t('common.timeList')}
                      getPopupContainer={node => node}
                    >
                      <IconFont
                        type="database"
                        style={{
                          fontSize: 20,
                          color: isMany ? '#4388ff' : '',
                        }}
                      />
                    </Tooltip>
                  </SetButton>
                )}
              </>
            )}

            {props.id !== 0 && (
              <SetButton onClick={() => setIsShowSearch(!isShowSearch)}>
                <Tooltip
                  title={t('common.search')}
                  getPopupContainer={node => node}
                >
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

            <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
              <SetButton>
                <Tooltip
                  title={t('common.tableFieldSet')}
                  getPopupContainer={node => node}
                >
                  <IconFont type="settings" style={{ fontSize: 20 }} />
                </Tooltip>
              </SetButton>
            </Dropdown>
          </div>
        </SearchWrap>
      </TabsHehavior>
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
              {listData?.list ? (
                listData?.list?.length > 0 ? (
                  <TableBox
                    scroll={{
                      x: 'max-content',
                    }}
                    tableLayout="auto"
                    rowKey="id"
                    columns={selectColum}
                    dataSource={listData?.list}
                    pagination={false}
                  />
                ) : (
                  <NoData />
                )
              ) : null}
            </StaffTableWrap>
          </LoadingSpin>
        </div>
      )}

      {isMany ? (
        <div>
          <LoadingSpin spinning={isSpin}>
            {manyListData.list ? (
              manyListData.list?.length > 0 ? (
                <StaffTableWrap2>
                  {manyListData.list?.map((item: any, index: any) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div
                      hidden={!item.list.length}
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

                      {item.list ? (
                        item?.list?.length > 0 ? (
                          <TableBox
                            rowKey="id"
                            columns={selectColum}
                            dataSource={item.list}
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                          />
                        ) : (
                          <NoData />
                        )
                      ) : null}
                    </div>
                  ))}
                </StaffTableWrap2>
              ) : (
                <div style={{ padding: 16 }}>
                  <NoData />
                </div>
              )
            ) : null}
          </LoadingSpin>
        </div>
      ) : null}

      {!isMany && listData?.list?.length > 0 && (
        <PaginationWrap style={{ paddingRight: 24 }}>
          <Pagination
            defaultCurrent={1}
            current={page}
            pageSize={pagesize}
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
          allTitleList={allTitleList}
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
          demandId={operationItem?.id}
          projectId={projectId}
          onUpdate={onUpdate}
          notGetPath
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
