/* eslint-disable no-undefined */
import React, { useEffect, useRef, useState } from 'react'
import PermissionWrap from '@/components/PermissionWrap'
import CreateViewPort from '@/components/CreateViewPort'
import ManageView from '@/components/ManageView'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import {
  ContentLeft,
  ContentMain,
  ContentRight,
  ContentWrap,
  Wrap,
} from './style'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import { useDispatch, useSelector } from '@store/index'
import { setFilterKeys, setFilterParams } from '@store/project'
import WrapLeft from './components/WrapLeft'
import DefectTable from './components/DefectTable'
import Operation from './components/Operation'
import { OptionalFeld } from '@/components/OptionalFeld'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { clearValue, saveTitles } from '@store/view'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { deleteFlaw, getFlawList } from '@/services/flaw'
import useKeyPress from '@/hooks/useKeyPress'
import { getMessage } from '@/components/Message'
import { useTranslation } from 'react-i18next'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'
export const TreeContextDefect: any = React.createContext('')

const Index = (props: any) => {
  const [t] = useTranslation()
  const { useKeys } = useKeyPress()
  useKeys('1', '/ProjectDetail/Iteration')
  useKeys('2', '/ProjectDetail/KanBan')
  useKeys('3', '/Report/Performance')
  useKeys('5', '/ProjectDetail/Demand')
  const keyRef = useRef()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { open: openToast, DeleteConfirmModal: DeleteConfirmModalToast } =
    useDeleteConfirmModal()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const myTreeComponent: any = useRef(null)
  const { projectInfo, filterKeys, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const searchChoose = useSelector(store => store.view.searchChoose)
  const { userInfo } = useSelector(store => store.user)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [key, setKey] = useState<any>()
  const [searchVal, setSearchVal] = useState('')
  const [searchItems, setSearchItems] = useState<any>({})
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 30 })
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [isShowLeft, setIsShowLeft] = useState(false)
  const [isSettingState, setIsSettingState] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [titleList3, setTitleList3] = useState<any[]>([])
  const [allTitleList, setAllTitleList] = useState<any[]>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [plainOptions3, setPlainOptions3] = useState<any>([])

  const keyValueTree = {
    key,
    changeKey: (value: any) => {
      setPageObj({ page: 1, size: pageObj.size })
      setKey(value)
      keyRef.current = value

      getList(searchItems, pageObj, order)
    },
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
    dispatch(saveTitles(all))
  }

  // 获取显示字段配置
  const getShowkey = () => {
    setPlainOptions(projectInfo?.plainOptions || [])
    setPlainOptions2(projectInfo?.plainOptions2 || [])
    setPlainOptions3(projectInfo?.plainOptions3 || [])
    setTitleList(projectInfo?.titleList || [])
    setTitleList2(projectInfo?.titleList2 || [])
    setTitleList3(projectInfo?.titleList3 || [])
    setAllTitleList([
      ...(projectInfo.titleList || []),
      ...(projectInfo.titleList2 || []),
      ...(projectInfo.titleList3 || []),
    ])
    dispatch(
      saveTitles([
        ...(projectInfo.titleList || []),
        ...(projectInfo.titleList2 || []),
        ...(projectInfo.titleList3 || []),
      ]),
    )
  }

  // 搜索框
  const onInputSearch = (keyValue: any) => {
    if (searchVal !== keyValue) {
      setSearchVal(keyValue)
      const params = searchItems
      params.searchValue = keyValue
      params.keyword = keyValue
      setSearchItems(params)
      setDataList({ list: undefined })
      setPageObj({
        page: 1,
        size: pageObj.size,
      })
      getList(searchItems, pageObj, { key: '', value: '' })
      // 添加搜索项 计数
      const keys = keyValue
        ? [...filterKeys, ...['searchVal']]
        : filterKeys?.filter((i: any) => i !== 'searchVal')
      dispatch(setFilterKeys([...new Set(keys)]))
    }
  }

  const getList = async (
    searchParamsObj: any,
    item?: any,
    orderItem?: any,
    updateState?: boolean,
  ) => {
    if (!updateState) {
      setIsSpinning(true)
    }
    let params = {
      projectId,
      page: item.page,
      pageSize: item.size,
      order: orderItem.value,
      orderKey: orderItem.key,
      searchValue: searchParamsObj.searchValue,
      statusIds: searchParamsObj.statusId,
      iterateIds: searchParamsObj.iterateId,
      priorityIds: searchParamsObj.priorityId,
      userId:
        searchChoose?.system_view === 3 ? userInfo.id : searchParamsObj.userId,
      tagIds: searchParamsObj.tagId,
      startTime: searchParamsObj.createdAtId,
      expectedStart: searchParamsObj.expectedStartAtId,
      expectedEnd: searchParamsObj.expectedendat,
      updatedTime: searchParamsObj.updatedat,
      endTime: searchParamsObj.finishAt,
      usersNameId:
        searchChoose?.system_view === 2
          ? userInfo.id
          : searchParamsObj.usersnameId,
      copySendId: searchParamsObj.usersCopysendNameId,
      class_ids: searchParamsObj.class_ids,
      category_id: searchParamsObj.category_id,
      schedule_start: searchParamsObj.schedule_start,
      schedule_end: searchParamsObj.schedule_end,
      custom_field: searchParamsObj?.custom_field,
      class_id: keyRef.current,
      discovery_version: searchParamsObj?.discovery_version,
      severity: searchParamsObj?.severity,
      solution: searchParamsObj?.solution,
      system_view: searchChoose?.system_view,
    }
    dispatch(setFilterParams(params))
    const result = await getFlawList(params)
    setDataList(result)
    setIsSpinning(false)
    // props.onIsUpdate?.()
    // dispatch(setIsRefresh(false))
    // setIsUpdated(false)
  }

  // 更新缺陷列表，state： 是否有加载动画，topId: 用于树形结构展开，isClass： 是否编辑的是需求分类
  const onUpdate = (state?: boolean, topId?: any, isClass?: any) => {
    getList(searchItems, pageObj, order, state)
    // 是编辑需求分类的话，就更新左侧需求分类列表
    if (isClass) {
      myTreeComponent?.current?.init(true)
    }
  }

  // 刷新列表
  const refresh = () => {
    getList(searchItems, pageObj, order, false)
  }

  // 筛选条件
  const onSearch = (params: any) => {
    setDataList({ list: undefined })
    setSearchItems(params)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
    getList(
      params,
      {
        page: 1,
        size: pageObj.size,
      },
      order,
    )
  }

  // 分页改变
  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
    getList(searchItems, item, order)
  }

  // 修改排序
  const onChangeOrder = (item: any) => {
    setOrder(item)
    getList(searchItems, pageObj, item)
  }

  // 删除确认事件
  const onDeleteConfirm = async (id: number) => {
    await deleteFlaw({ projectId, id })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    getList(searchItems, pageObj, order)
    myTreeComponent?.current?.init(true)
  }

  // 删除弹窗
  const onDelete = (item: any) => {
    open({
      title: `${t('confirmationOfDeletion')}【${item.storyPrefixKey}】`,
      text: t(
        'youWillPermanentlyDeleteThisAndItWillNotBeRecoverableAfterPleaseOperateWith',
      ),
      onConfirm: () => {
        onDeleteConfirm(item.id)
        return Promise.resolve()
      },
    })
  }

  useEffect(() => {
    if (projectInfo?.id) {
      getShowkey()
      setPageObj({ page: 1, size: 30 })
      setOrder({ value: '', key: '' })
      setKey('')
      setSearchVal('')
      setSearchItems({})
      keyValueTree.changeKey('')
      getList({}, { page: 1, size: 30 }, { value: '', key: '' })
    }
  }, [projectInfo])

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      getList(searchItems, pageObj, order)
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    // 进入主页清除已存储的筛选计数
    setFilterKeys([])
    return () => {
      dispatch(clearValue())
    }
  }, [])

  const onToastConfirm = () => {
    dispatch(setActiveCategory({}))
    const resultParams = encryptPhp(
      JSON.stringify({
        id: projectInfo?.id,
      }),
    )
    navigate(`/ProjectDetail/Setting/TypeConfiguration?data=${resultParams}`)
  }

  // 点击创建缺陷
  const onCreateDefect = () => {
    openToast({
      title: t('p2.toast'),
      text: t('thisDefectHasNotYetCreatedACreateItQuickly'),
      onConfirm: () => {
        onToastConfirm()
        return Promise.resolve()
      },
    })
  }

  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth="b/flaw/"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <DeleteConfirmModalToast />
      <DeleteConfirmModal />
      <CreateViewPort pid={projectId} />
      <ManageView projectId={projectId} />
      <OptionalFeld
        allTitleList={allTitleList}
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        plainOptions3={plainOptions3}
        checkList={titleList}
        checkList2={titleList2}
        checkList3={titleList3}
        isVisible={isSettingState}
        onClose={() => setIsSettingState(false)}
        getCheckList={getCheckList}
      />
      <TreeContextDefect.Provider value={keyValueTree}>
        <Wrap>
          <ProjectCommonOperation
            onInputSearch={onInputSearch}
            title={t('searchForDefectNameOrNumber')}
          />
          <ContentWrap>
            <ContentLeft>
              <WrapLeft
                ref={myTreeComponent}
                projectId={projectId}
                isShowLeft={isShowLeft}
                onUpdate={onUpdate}
                iKey={key}
              />
            </ContentLeft>
            <ContentRight>
              <Operation
                pid={projectId}
                onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
                onRefresh={refresh}
                onSearch={onSearch}
                settingState={isSettingState}
                onChangeSetting={setIsSettingState}
                isShowLeft={isShowLeft}
                otherParams={{
                  page: pageObj.page,
                  pageSize: pageObj.size,
                  orderKey: order.key,
                  order: order.value,
                  classId: key,
                }}
                dataLength={dataList?.total}
                onCreateDefect={onCreateDefect}
              />
              <ContentMain>
                <DefectTable
                  data={dataList}
                  onDelete={onDelete}
                  onChangePageNavigation={onChangePageNavigation}
                  onChangeOrder={onChangeOrder}
                  isSpinning={isSpinning}
                  onUpdate={onUpdate}
                  titleList={titleList}
                  titleList2={titleList2}
                  titleList3={titleList3}
                  allTitleList={allTitleList}
                />
              </ContentMain>
            </ContentRight>
          </ContentWrap>
        </Wrap>
      </TreeContextDefect.Provider>
    </PermissionWrap>
  )
}

export default Index
