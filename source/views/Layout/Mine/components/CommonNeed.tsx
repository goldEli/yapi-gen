/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-useless-fragment */
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
import { Checkbox, Menu, message, Space, Spin, Table } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from '@/components/TableColumns/MineOrHisTableColumn'
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
import {
  setAddWorkItemModal,
  setProjectInfo,
  setProjectInfoValues,
} from '@store/project'
import { deleteDemand } from '@/services/demand'
import PaginationBox from '@/components/TablePagination'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import SetShowField from '@/components/SetShowField/indedx'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import ResizeTable from '@/components/ResizeTable'
import ScreenMinHover from '@/components/ScreenMinHover'
import { getMessage } from '@/components/Message'
import {
  deleteAffairs,
  updateAffairsPriority,
  updateAffairsStatus,
} from '@/services/affairs'
import {
  deleteFlaw,
  updateFlawPriority,
  updateFlawStatus,
} from '@/services/flaw'
import { DefectDropdownMenu } from '@/components/TableDropdownMenu/DefectDropdownMenu'
import { SprintDropdownMenu } from '@/components/TableDropdownMenu/SprintDropdownMenu'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'

const LoadingSpin = styled(Spin)({
  minHeight: 300,
  '.ant-spin-nested-loading, .ant-spin-container': {
    height: 'initial!important',
  },
})

const TableTitle = styled.div({
  color: 'var(--neutral-n1-d1)',
  fontSize: '16px',
  height: '53px',
  display: 'flex',
  alignItems: 'center',
  marginLeft: '16px',
  fontFamily: 'SiYuanMedium',
  span: {
    borderLeft: '3px solid var(--primary-d2)',
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
  onShowDel(record: any): void
  isAllProject?: boolean
}

const MoreWrap = (props: MoreWrapProps) => {
  const [t] = useTranslation()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const dispatch = useDispatch()

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsMoreVisible(false)
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          projectId: item.project_id,
          editId: item.id,
          type: item.work_type,
          title:
            item.project_type === 1
              ? item.is_bug === 1
                ? t('editorialDefect')
                : t('requirementsForEditing')
              : t('editorial_affairs'),
        },
      }),
    )
  }

  // 点击删除
  const onDeleteChange = (item: any) => {
    setIsMoreVisible(false)
    props.onShowDel(props.record)
  }

  // 点击创建子需求
  const onCreateChild = (item: any) => {
    let type: any =
      item.project_type === 1
        ? 1
        : item.is_bug === 1
        ? 2
        : item.work_type === 3
        ? 8
        : 6
    setIsMoreVisible(false)
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          projectId: item.project_id,
          isChild: true,
          isCreateAffairsChild: item.project_type === 2,
          parentId: item.id,
          parentList: item.parent,
          categoryId: item.category_id ?? item.categoryId,
          type,
          title:
            item.project_type === 1
              ? item.is_bug === 1
                ? t('createSubtransaction')
                : t('create_sub_requirements')
              : t('createSubtransaction'),
        },
      }),
    )
  }

  const onComputed = () => {
    let isEdit: boolean
    let isDelete: boolean
    if (props?.record?.project_type === 1) {
      isEdit = Object.values(props?.record?.project?.permissions).includes(
        'b/story/update',
      )
      isDelete = Object.values(props?.record?.project?.permissions).includes(
        'b/story/delete',
      )
    } else if (
      props?.record?.project_type === 2 &&
      props?.record?.is_bug === 1
    ) {
      isEdit = Object.values(props?.record?.project?.permissions).includes(
        'b/flaw/update',
      )
      isDelete = Object.values(props?.record?.project?.permissions).includes(
        'b/flaw/delete',
      )
    } else {
      isEdit = Object.values(props?.record?.project?.permissions).includes(
        'b/transaction/update',
      )
      isDelete = Object.values(props?.record?.project?.permissions).includes(
        'b/transaction/delete',
      )
    }
    return isEdit || isDelete
  }

  return (
    <>
      {onComputed() && (
        <MoreDropdown
          isMoreVisible={isMoreVisible}
          onChangeVisible={setIsMoreVisible}
          menu={
            <>
              {props?.record?.project_type === 1 && (
                <DemandOperationDropdownMenu
                  onEditChange={onEditChange}
                  onDeleteChange={onDeleteChange}
                  onCreateChild={onCreateChild}
                  record={props?.record}
                  isAllProject={props.isAllProject}
                />
              )}
              {props?.record?.project_type === 2 &&
                props.record?.is_bug === 1 && (
                  <DefectDropdownMenu
                    onEditChange={onEditChange}
                    onDeleteChange={onDeleteChange}
                    record={props?.record}
                    isAllProject={props.isAllProject}
                  />
                )}
              {props?.record?.project_type === 2 &&
                props.record?.is_bug !== 1 && (
                  <SprintDropdownMenu
                    onEditChange={onEditChange}
                    onDeleteChange={onDeleteChange}
                    onCreateChild={onCreateChild}
                    record={props?.record}
                    isAllProject={props.isAllProject}
                  />
                )}
            </>
          }
        />
      )}
    </>
  )
}

const CommonNeed = (props: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [openDemandDetail] = useOpenDemandDetail()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { isRefresh } = useSelector(store => store.user)
  const { isUpdateCreate } = useSelector(store => store.mine)
  const { projectInfo, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const [isDelVisible, setIsDelVisible] = useState(false)
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
  const [pageObj, setPageObj] = useState({ page: 1, size: 30 })
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
      statusId: e.category_status_ids,
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
      setListData({ list: undefined })
      setManyListData({ list: undefined })
    }

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
      setManyListData({ list: res })
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

  const updateStatus = async (res1: any, type?: number) => {
    // 1是需求，2是事务，3是缺陷
    const methodsList = [
      { type: 1, url: updateDemandStatus },
      { type: 2, url: updateAffairsStatus },
      { type: 3, url: updateFlawStatus },
    ]
    const currentType = methodsList.filter((i: any) => i.type === type)[0]
    try {
      await currentType.url(res1)
      getMessage({
        msg: t('common.circulationSuccess') as string,
        type: 'success',
      })
      init()
    } catch (error) {
      //
    }
  }
  const updatePriority = async (res1: any, type?: number) => {
    // 1是需求，2是事务，3是缺陷
    const methodsList = [
      { type: 1, url: updatePriorityStatus },
      { type: 2, url: updateAffairsPriority },
      { type: 3, url: updateFlawPriority },
    ]
    const currentType = methodsList.filter((i: any) => i.type === type)[0]

    try {
      await currentType.url(res1)
      getMessage({
        msg: t('common.prioritySuccess') as string,
        type: 'success',
      })
      init()
    } catch (error) {
      //
    }
  }

  const onDeleteConfirm = async (row: any, checked: boolean) => {
    let type: number
    let params: any = {
      projectId: row.project_id,
      id: row?.id,
    }
    // 1是需求，2是事务，3是缺陷
    if (row.project_type === 1 && row.is_bug === 1) {
      type = 3
    } else if (row.project_type === 1 && row.is_bug !== 1) {
      type = 1
    } else {
      type = 2
      params.isDeleteChild = checked ? 1 : 2
    }
    const methodsList = [
      { type: 1, url: deleteDemand },
      { type: 2, url: deleteAffairs },
      { type: 3, url: deleteFlaw },
    ]
    const currentType = methodsList.filter((i: any) => i.type === type)[0]

    await currentType.url(params)
    getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
    setIsDelVisible(false)
    init()
  }

  const showDel = (record: any) => {
    setProjectId(record.project_id)
    setOperationItem(record)
    let checked = [4, 5].includes(record.work_type)
      ? [4, 5].includes(record.work_type)
      : false
    // 是否是事务
    const isAffairs = record.project_type === 2

    open({
      title: t('deleteConfirmation'),
      text: isAffairs ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ marginBottom: 8 }}>
            {t(
              'youWillPermanentlyDeleteAndItsWhichCannotBeRecoveredAfterPleaseOperateWith',
              { key: record.story_prefix_key },
            )}
          </span>
          {record.work_type !== 6 && (
            <Checkbox
              disabled={[4, 5].includes(record.work_type)}
              defaultChecked={checked}
              onChange={e => (checked = e.target.checked)}
            >
              {t('deleteAllSubtransactionsUnderThisTransactionAtTheSameTime')}
            </Checkbox>
          )}
        </div>
      ) : record.project_type === 1 && record.is_bug === 1 ? (
        t('areYouSureToDeleteThisFlaw')
      ) : (
        t('mark.del')
      ),

      onConfirm() {
        onDeleteConfirm(record, checked)
        return Promise.resolve()
      },
    })
  }

  // 点击打开详情并组装当前平级的需求id列表
  const onClickItem = async (item: any) => {
    if (item.project?.isPublic !== 1 && !item.project?.isUserMember) {
      getMessage({ msg: t('common.notCheckInfo'), type: 'warning' })
    } else {
      let demandIds: any

      if (isMany) {
        demandIds = manyListData?.list
          .filter((k: any) => k.is_member)
          ?.filter((i: any) => i.status_name === item.statusName)[0]
          ?.list?.map((i: any) => i.id)
      } else {
        demandIds = listData?.list
          ?.filter((k: any) => k.is_member)
          .map((i: any) => i.id)
      }
      item.isMineOrHis = true
      item.isAllProject = props.id === 0
      if (props.id === 0) {
        const result = await getProjectInfo({ projectId: item.project_id })
        dispatch(setProjectInfo(result))
        const result1 = await getProjectInfoValues({
          projectId: item.project_id,
        })
        dispatch(setProjectInfoValues(result1))
      }
      let type = 0
      if (item.project_type === 2) {
        type = 1
      }
      if (item.project_type === 1 && item.is_bug === 2) {
        type = 3
      }
      if (item.project_type === 1 && item.is_bug === 1) {
        type = 2
      }

      openDemandDetail(
        { ...item, ...{ demandIds } },
        item.project_id,
        item.id,
        type,
      )
    }
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
    onClickItem,
    projectType: projectInfo.projectType,
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
              onShowDel={showDel}
              isAllProject={!props.id}
            />
          )
        },
      },
    ]

    if (props.id === 0) {
      const index = newList.findIndex((i: any) => i.key === 'iterate_name')
      newList.splice(index, 1)
    }
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
      // 如果项目id变化了，并且搜索值不同的话则清空
      keyword === '' ? init(false) : setKeyword('')
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
    if (isRefresh || isUpdateCreate || isUpdateAddWorkItem) {
      init()
      // 作用于-所有项目中打开弹窗后，编辑更新，projectInfo不正确问题
      if (props.id !== 0) {
        getShowkey()
      }
    }
  }, [isRefresh, isUpdateCreate, isUpdateAddWorkItem])

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

  const onChangeMany = (state: boolean) => {
    getMessage({
      msg: t('version2.reviewModeChangeSuccess') as string,
      type: 'success',
    })
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
      <DeleteConfirmModal />
      <div
        style={{
          margin: `0 24px ${isShowSearch ? 0 : 16}px 24px`,
          justifyContent: 'space-between',
          display: 'flex',
          borderBottom: '1px solid var(--neutral-n6-d1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 24,
            }}
          >
            <TabsItem isActive>
              <div>{props?.subTitle}</div>
            </TabsItem>
            <LabNumber isActive>{total ?? 0}</LabNumber>
          </div>
          <InputSearch
            placeholder={t('searchForRequirementNameOrNumber')}
            onChangeSearch={onPressEnter}
            leftIcon
            defaultValue={keyword}
            width={184}
          />
        </div>

        <SearchWrap>
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
                {/* <DividerWrap type="vertical" /> */}
                <ScreenMinHover
                  label={t('common.search')}
                  icon="filter"
                  onClick={() => setIsShowSearch(!isShowSearch)}
                  isActive={isShowSearch}
                />
              </>
            )}

            {(props.id !== 0 || props.type === 'abeyance') && (
              <DividerWrap type="vertical" />
            )}
            <ScreenMinHover
              label={t('common.refresh')}
              icon="sync"
              onClick={() => init(false)}
            />

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
        <TableFilter
          onFilter={getSearchKey}
          onSearch={onSearch}
          list={searchList}
          basicsList={filterBasicsList}
          specialList={filterSpecialList}
          customList={filterCustomList}
          hasLeft
        />
      ) : null}
      {!isMany && (
        <div style={{ padding: '0 24px' }}>
          <ResizeTable
            isSpinning={isSpin}
            dataWrapNormalHeight="calc(100vh - 311px)"
            col={selectColum}
            dataSource={listData?.list}
            noData={<NoData />}
          />
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
                    <ResizeTable
                      isSpinning={false}
                      dataWrapNormalHeight="460px"
                      col={selectColum}
                      dataSource={item?.list}
                      noData={<NoData />}
                    />
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
    </>
  )
}

export default CommonNeed
