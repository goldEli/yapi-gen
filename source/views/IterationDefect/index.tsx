/* eslint-disable no-undefined */
import React, { useEffect, useRef, useState } from 'react'
import PermissionWrap from '@/components/PermissionWrap'
import CreateViewPort from '@/components/CreateViewPort'
import ManageView from '@/components/ManageView'
import { useSearchParams } from 'react-router-dom'
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
import {
  setFilterKeys,
  setIsUpdateAddWorkItem,
  setFilterParams,
} from '@store/project'
import WrapLeft from './components/WrapLeft'
import DefectTable from './components/DefectTable'
import Operation from './components/Operation'
import { OptionalFeld } from '@/components/OptionalFeld'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { saveTitles } from '@store/view'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { getFlawList } from '@/services/flaw'

export const TreeContext: any = React.createContext('')

const Index = (props: any) => {
  const keyRef = useRef()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const dispatch = useDispatch()
  const myTreeComponent: any = useRef(null)
  const { projectInfo, filterKeys } = useSelector(store => store.project)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [key, setKey] = useState()
  const [searchVal, setSearchVal] = useState('')
  const [searchItems, setSearchItems] = useState<any>({})
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
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

  const keyValue = {
    key,
    changeKey: (value: any) => {
      setKey(value)
      keyRef.current = value
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
      setSearchItems(params)
      setDataList({ list: undefined })
      setPageObj({
        page: 1,
        size: pageObj.size,
      })
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
      userId: searchParamsObj.userId,
      tagIds: searchParamsObj.tagId,
      startTime: searchParamsObj.createdAtId,
      expectedStart: searchParamsObj.expectedStartAtId,
      expectedEnd: searchParamsObj.expectedendat,
      updatedTime: searchParamsObj.updatedat,
      endTime: searchParamsObj.finishAt,
      usersNameId: searchParamsObj.usersnameId,
      copySendId: searchParamsObj.usersCopysendNameId,
      class_ids: searchParamsObj.class_ids,
      category_id: searchParamsObj.category_id,
      schedule_start: searchParamsObj.schedule_start,
      schedule_end: searchParamsObj.schedule_end,
      custom_field: searchParamsObj?.custom_field,
      class_id: keyRef.current,
      // system_view: searchChoose ? searchChoose['system_view'] : undefined,
    }
    dispatch(setFilterParams(params))
    const result = await getFlawList(params)
    setDataList(result)
    setIsSpinning(false)
    // props.onIsUpdate?.()
    // dispatch(setIsRefresh(false))
    // setIsUpdated(false)
    dispatch(setIsUpdateAddWorkItem(false))
  }

  // 更新缺陷列表，state： 是否有加载动画，topId: 用于树形结构展开，isClass： 是否编辑的是需求分类
  const onUpdate = (state?: boolean, topId?: any, isClass?: any) => {
    getList(searchItems, pageObj, order, state)
    // 是编辑需求分类的话，就更新左侧需求分类列表
    if (isClass) {
      myTreeComponent?.current?.init()
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
  }

  // 分页改变
  const onChangePageNavigation = (item: any) => {
    setPageObj(item)
  }

  const onChangeRow = (topId?: any) => {
    getList(searchItems, pageObj, order, false)
  }

  // 修改排序
  const onChangeOrder = (item: any) => {
    setOrder(item)
  }

  // 删除确认事件
  const onDeleteConfirm = async (item: number) => {
    //
  }

  // 删除弹窗
  const onDelete = (item: any) => {
    open({
      title: `删除确认【${item.storyPrefixKey}】`,
      text: '你将永久删除该缺陷，删除后将不可恢复请谨慎操作！',
      onConfirm: () => {
        onDeleteConfirm(item.id)
        return Promise.resolve()
      },
    })
  }

  useEffect(() => {
    if (projectInfo?.id) {
      getShowkey()
    }
  }, [projectInfo])

  useEffect(() => {
    getList(searchItems, pageObj, order)
  }, [key, order, pageObj, projectId])

  useEffect(() => {
    // 进入主页清除已存储的筛选计数
    setFilterKeys([])
  }, [])

  return (
    <PermissionWrap
      // /ProjectManagement/Project
      auth=""
      permission={['']}
    >
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
      <TreeContext.Provider value={keyValue}>
        <Wrap>
          <ProjectCommonOperation onInputSearch={onInputSearch} />
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
              />
              <ContentMain>
                <DefectTable
                  data={dataList}
                  onDelete={onDelete}
                  onChangePageNavigation={onChangePageNavigation}
                  onChangeRow={onChangeRow}
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
      </TreeContext.Provider>
    </PermissionWrap>
  )
}

export default Index
