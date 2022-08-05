import { useEffect, useMemo, useState } from 'react'
import {
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SetButton,
  StyledTable,
  tabCss,
  TabsHehavior,
  TabsItem,
  LabNumber,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, message, Pagination } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './CreatePrejectTableColum'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useModel } from '@/models'
import TableFilter from '@/components/TableFilter'
import EditDemand from '@/views/Project/Detail/Demand/components/EditDemand'
import DeleteConfirm from '@/components/DeleteConfirm'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line complexity
const Need = (props: any) => {
  const [t] = useTranslation()
  const { deleteDemand } = useModel('demand')
  const {
    getMineCreacteList,
    getField,
    getSearchField,
    updateDemandStatus,
    updatePriorityStatus,
  } = useModel('mine')
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [operationItem, setOperationItem] = useState<any>()
  const [projectId, setProjectId] = useState<any>()
  const [listData, setListData] = useState<any>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
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
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
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
  const onSearch = (e: any) => {
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
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const updateOrderkey = (key: any, order: any) => {
    setOrderKey(key)
    setOrder(order)
  }
  const init = async () => {
    const res = await getMineCreacteList({
      projectId: props.id,
      keyword,
      searchGroups,
      order,
      orderkey: orderKey,
      page,
      pagesize,
    })

    setListData(res.list)
    setTotal(res.pager.total)
  }

  const updateStatus = async (res1: any) => {
    const res = await updateDemandStatus(res1)

    if (res.code === 0) {
      message.success(t('common.circulationSuccess'))
      init()
    }
  }
  const updatePriority = async (res1: any) => {
    await updatePriorityStatus(res1)

    init()
  }
  const showEdit = (e: any) => {
    setProjectId(e.record.project_id)
    setOperationItem(e.record.id)
    setIsVisible(true)
  }
  const showDel = (e: any) => {
    setProjectId(e.record.project_id)
    setOperationItem(e.record.id)
    setIsDelVisible(true)
  }
  const columns = useDynamicColumns({
    orderKey,
    order,
    updateOrderkey,
    updateStatus,
    updatePriority,
    showEdit,
    showDel,
  })

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
    return newList
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleList, columns])
  const getShowkey = async () => {
    const res2 = await getField(props.id)

    setPlainOptions(res2.plainOptions)
    setPlainOptions2(res2.plainOptions2)
    setTitleList(res2.titleList)
    setTitleList2(res2.titleList2)
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
  }, [page, pagesize, keyword, orderKey, order, props.id, searchGroups])
  useEffect(() => {
    getSearchKey()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id])

  useEffect(() => {
    getShowkey()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  return (
    <>
      <TabsHehavior>
        <div className={tabCss}>
          <TabsItem isActive>
            <div>{t('common.createDemand')}</div>
          </TabsItem>
          <LabNumber isActive>{total ?? 0}</LabNumber>
        </div>
      </TabsHehavior>
      <Hehavior>
        <div>
          <MyInput
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 20 }}
              />
            }
            onPressEnter={onPressEnter}
            placeholder={t('common.pleaseSearchDemand')}
            allowClear
          />
        </div>
        <div style={{ marginRight: '40px', display: 'flex' }}>
          {props.id !== 0 && (
            <SetButton onClick={() => setIsShowSearch(!isShowSearch)}>
              <IconFont
                type="filter"
                style={{ fontSize: 20, color: isShowSearch ? '#2877ff' : '' }}
              />
            </SetButton>
          )}

          <Dropdown trigger={['hover']} overlay={menu} placement="bottomLeft">
            <SetButton>
              <IconFont
                type="set-default
              "
                style={{ fontSize: 20 }}
              />
            </SetButton>
          </Dropdown>
        </div>
      </Hehavior>

      {isShowSearch && props.id !== 0
        ? (
            <TableFilter
              onFilter={getSearchKey}
              onSearch={onSearch}
              list={searchList}
              basicsList={filterBasicsList}
              specialList={filterSpecialList}
            />
          )
        : null}

      <StaffTableWrap>
        <StyledTable
          rowKey="id"
          columns={selectColum}
          dataSource={listData}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </StaffTableWrap>

      <PaginationWrap>
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
      {isModalVisible
        ? (
            <OptionalFeld
              plainOptions={plainOptions}
              plainOptions2={plainOptions2}
              checkList={titleList}
              checkList2={titleList2}
              isVisible={isModalVisible}
              onClose={close2}
              getCheckList={getCheckList}
            />
          )
        : null}
      {isVisible
        ? (
            <EditDemand
              visible={isVisible}
              onChangeVisible={onChangeVisible}
              id={operationItem}
              preId={projectId}
              onUpdate={onUpdate}
            />
          )
        : null}
      <DeleteConfirm
        text={t('common.confirmDelChildDemand')}
        isVisible={isDelVisible}
        onChangeVisible={() => setIsDelVisible(!isDelVisible)}
        onConfirm={onDeleteConfirm}
      />
    </>
  )
}

export default Need
