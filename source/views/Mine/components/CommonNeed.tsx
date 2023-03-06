// 我的模块-所有页面公用列表及查询

/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import {
  TabsItem,
  LabNumber,
  ShowWrap,
  HoverWrap,
  DividerWrap,
  HasIconMenu,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Menu, message, Pagination, Space, Spin, Table } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from '@/components/CreateProjectTableColumInfo'
import { OptionalFeld } from '@/components/OptionalFeld'
import TableFilter from '@/components/TableFilter'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import NoData from '@/components/NoData'
import MoreDropdown from '@/components/MoreDropdown'
import DropDownMenu from '@/components/DropDownMenu'
import InputSearch from '@/components/InputSearch'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import { setIsUpdateCreate } from '@store/mine'
import {
  getMineCreacteList,
  getMineFinishList,
  getMineNeedList,
  getMineNoFinishList,
  updateDemandStatus,
  updatePriorityStatus,
} from '@/services/mine'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { deleteDemand } from '@/services/demand'
import PaginationBox from '@/components/TablePagination'
import { DemandOperationDropdownMenu } from '@/components/DemandComponent/DemandOperationDropdownMenu'
import { setCreateDemandProps, setIsCreateDemandVisible } from '@store/demand'
import SetShowField from '@/components/SetShowField/indedx'

const TableBox = styled(Table)({
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
  const dispatch = useDispatch()

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsMoreVisible(false)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({ demandId: item.id, projectId: item.project_id }),
    )
  }

  // 点击删除
  const onDeleteChange = (item: any) => {
    setIsMoreVisible(false)
    props.onShowDel()
  }

  // 点击创建子需求
  const onCreateChild = (item: any) => {
    setIsMoreVisible(false)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        projectId: item.project_id,
        isChild: true,
        parentId: item.id,
      }),
    )
  }

  return (
    <>
      {(props?.record?.project?.isEdit || props?.record?.project?.isDelete) && (
        <MoreDropdown
          isMoreVisible={isMoreVisible}
          onChangeVisible={setIsMoreVisible}
          menu={
            <DemandOperationDropdownMenu
              onEditChange={onEditChange}
              onDeleteChange={onDeleteChange}
              onCreateChild={onCreateChild}
              record={props?.record}
            />
          }
        />
      )}
    </>
  )
}

const CommonNeed = (props: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { isUpdateCreate } = useSelector(store => store.mine)
  const { projectInfo } = useSelector(store => store.project)
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
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [total, setTotal] = useState<number>(0)
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
  const [isVisibleFields, setIsVisibleFields] = useState(false)
  const [isVisibleFormat, setIsVisibleFormat] = useState(false)
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
    setPageObj({ page: 1, size: pageObj.size })
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
    setPageObj({ page: 1, size: pageObj.size })
  }
  const init = async (updateState?: boolean) => {
    if (!updateState) {
      setIsSpin(true)
    }
    setListData({ list: undefined })
    setManyListData({ list: undefined })
    setTotal(0)

    if (isMany) {
      const params = {
        projectId: props.id,
        all: isMany ? 1 : '',
        panelDate: isMany ? 1 : '',
        keyword,
        searchGroups,
      }
      const res = await getMineNoFinishList(params)
      setManyListData({ list: res.list })
      setIsSpin(false)
      dispatch(setIsUpdateCreate(false))
      setTotal(res?.total)
    }

    if (!isMany) {
      const params = {
        projectId: props.id,
        keyword,
        searchGroups,
        order,
        orderkey: orderKey,
        page: pageObj.page,
        pagesize: pageObj.size,
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
      dispatch(setIsUpdateCreate(false))
    }
  }

  const updateStatus = async (res1: any) => {
    try {
      await updateDemandStatus(res1)
      message.success(t('common.circulationSuccess'))
      init()
    } catch (error) {
      //
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
    projectId: props.id,
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
  }, [titleList, columns])

  const getSearchKey = async (key?: any, type?: number) => {
    const filterFelid = projectInfo?.filterFelid
    if (key && type === 0) {
      setSearchList(searchList.filter((item: any) => item.content !== key))
      return
    }
    if (key && type === 1) {
      const addList = filterFelid.filter((item: any) => item.content === key)

      setSearchList([...searchList, ...addList])

      return
    }
    const arr = filterFelid?.filter((item: any) => item.isDefault === 1)

    setSearchList(arr)
    setFilterBasicsList(projectInfo?.filterBasicsList)
    setFilterSpecialList(projectInfo?.filterSpecialList)
    setFilterCustomList(projectInfo?.filterCustomList)
    dispatch(setIsRefresh(false))
  }

  const getShowkey = async () => {
    if (props.id) {
      const result = await getProjectInfoValues({ projectId: props.id })
      dispatch(setProjectInfoValues(result))
    }
    const res2 = await getProjectInfo({ projectId: props.id })
    setPlainOptions(res2.plainOptions)
    setPlainOptions2(res2.plainOptions2)
    setPlainOptions3(res2.plainOptions3)
    setTitleList(res2.titleList)
    setTitleList2(res2.titleList2)
    setTitleList3(res2.titleList3)
    setAllTitleList([...res2.titleList, ...res2.titleList2, ...res2.titleList3])
    dispatch(setIsRefresh(false))
    dispatch(setProjectInfo(res2))
  }

  const onChangePage = (page: any, size: number) => {
    setPageObj({ page, size })
  }
  const onPressEnter = (value: any) => {
    setPageObj({ page: 1, size: pageObj.size })
    setKeyword(value)
  }

  useEffect(() => {
    init(false)
  }, [keyword, orderKey, order, searchGroups, isMany, pageObj])

  // 监听项目id变化，更新项目信息
  useEffect(() => {
    // 如果分页为1则调用接口
    if (pageObj.page === 1) {
      init(false)
    } else {
      // 如果分页改变则，重置分页
      setPageObj({ page: 1, size: pageObj.size })
    }
    getShowkey()
  }, [props.id])

  useEffect(() => {
    if (projectInfo?.id) {
      getSearchKey()
    }
  }, [projectInfo])

  // 监听语言变化及是否需要更新创建
  useEffect(() => {
    if (isRefresh || isUpdateCreate) {
      init()
      getShowkey()
    }
  }, [isRefresh, isUpdateCreate])

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

  const onChangeMany = (state: boolean) => {
    message.success(t('version2.reviewModeChangeSuccess'))
    setIsMany(state)
    setIsVisibleFormat(false)
    setPageObj({ page: 1, size: pageObj.size })
  }

  const menuType = (
    <Menu
      items={[
        {
          key: 'list',
          label: (
            <HasIconMenu onClick={() => onChangeMany(true)} isCheck={isMany}>
              <div className="left">
                <IconFont className="icon" type="database" />
                <span className="label">{t('common.timeList')}</span>
              </div>
              <IconFont className="checked" type={isMany ? 'check' : ''} />
            </HasIconMenu>
          ),
        },
        {
          key: 'thumbnail',
          label: (
            <HasIconMenu onClick={() => onChangeMany(false)} isCheck={!isMany}>
              <div className="left">
                <IconFont className="icon" type="unorderedlist" />
                <span className="label">{t('common.list')}</span>
              </div>
              <IconFont className="checked" type={isMany ? '' : 'check'} />
            </HasIconMenu>
          ),
        },
      ]}
    />
  )

  return (
    <>
      <div
        style={{
          padding: '0 24px',
          justifyContent: 'space-between',
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TabsItem isActive>
            <div>{props?.subTitle}</div>
          </TabsItem>
          <LabNumber isActive>{total ?? 0}</LabNumber>
        </div>
        <SearchWrap>
          <div style={{ position: 'absolute', top: '20px', right: '24px' }}>
            <InputSearch
              placeholder={t('common.pleaseSearchDemand')}
              onChangeSearch={onPressEnter}
              leftIcon
            />
          </div>
          <Space style={{ display: 'flex' }} size={8}>
            {props?.isMember ? null : (
              <>
                {props?.type === 'abeyance' && (
                  <DropDownMenu
                    menu={menuType}
                    icon={isMany ? 'database' : 'unorderedlist'}
                    isVisible={isVisibleFormat}
                    onChangeVisible={setIsVisibleFormat}
                  >
                    <HasIconMenu>
                      <div className="label">
                        {isMany ? t('common.timeList') : t('common.list')}
                      </div>
                    </HasIconMenu>
                  </DropDownMenu>
                )}
              </>
            )}

            {props.id !== 0 && (
              <>
                <DividerWrap type="vertical" />
                <HoverWrap
                  onClick={() => setIsShowSearch(!isShowSearch)}
                  isActive={isShowSearch}
                >
                  <IconFont className="iconMain" type="filter" />
                  <span className="label">{t('common.search')}</span>
                </HoverWrap>
              </>
            )}
            {props.id !== 0 && (
              <>
                <DividerWrap type="vertical" />
                <DropDownMenu
                  menu={<SetShowField onChangeFieldVisible={showModal} />}
                  icon="settings"
                  isVisible={isVisibleFields}
                  onChangeVisible={setIsVisibleFields}
                  isActive={isModalVisible}
                >
                  <div>{t('common.tableFieldSet')}</div>
                </DropDownMenu>
              </>
            )}
          </Space>
        </SearchWrap>
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
            <div>
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
            </div>
          </LoadingSpin>
        </div>
      )}

      {isMany ? (
        <div>
          <LoadingSpin spinning={isSpin}>
            {manyListData?.list?.filter((i: any) => i.count)?.length > 0 && (
              <div>
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
              </div>
            )}
            {manyListData?.list?.filter((i: any) => i.count)?.length <= 0 && (
              <div style={{ padding: 16 }}>
                <NoData />
              </div>
            )}
          </LoadingSpin>
        </div>
      ) : null}

      {!isMany && listData?.list?.length > 0 && (
        <PaginationBox
          total={total}
          pageSize={pageObj.size}
          currentPage={pageObj.page}
          onChange={onChangePage}
        />
      )}

      {props.id > 0 && (
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
      )}

      {/* <EditDemand
        visible={isVisible}
        onChangeVisible={onChangeVisible}
        demandId={operationItem?.id}
        projectId={projectId}
        onUpdate={onUpdate}
        notGetPath
        isAllProject={!props.id}
      /> */}
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
