/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-negated-condition */
/* eslint-disable react/no-danger */
/* eslint-disable complexity */
/* eslint-disable no-constant-binary-expression */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import TabsDragging from './TabsDragging'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import EditField from './EditField'
import { configSave } from '@/services/demand'
import { getCategoryConfigList } from '@store/category/thunk'
import {
  setGetCategoryConfigArray,
  setProjectFieIdsData,
} from '@store/category'
import { useTranslation } from 'react-i18next'
import { getMessage } from '@/components/Message'
import * as services from '@/services'
const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  padding: 20px 0 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const Main = (props: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [infoIcon, setInfoIcon] = useState(true)
  const [moreIcon, setMoreIcon] = useState(true)
  const { getCategoryConfigDataList, activeCategory, getProjectFieIdsData } =
    useSelector(store => store.category)
  const { projectInfo } = useSelector(store => store.project)
  const [getCategoryConfigT, setGetCategoryConfigT] = useState<any>([])
  const [getCategoryConfigF, setGetCategoryConfigF] = useState<any>([])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [delItem, setDelItem] = useState<any>()
  const [addAndEditVisible, setAddAndEditVisible] = useState<boolean>(false)
  const [fieldType, setFieldType] = useState()
  const [draggingIndex, setDraggingIndex] = useState<any>()
  const [configType, setConfigType] = useState(0)
  const [colItem, setColItem] = useState<any>()
  const topTitleRef: any = useRef()
  const bottomTitleRef: any = useRef()
  const [dragState, setDragState] = useState(true)
  useEffect(() => {
    setGetCategoryConfigT(getCategoryConfigDataList?.isFoldT)
    setGetCategoryConfigF(getCategoryConfigDataList?.isFoldF)
    setInfoIcon(true)
    dispatch(
      setGetCategoryConfigArray([
        ...getCategoryConfigDataList?.isFoldF,
        ...getCategoryConfigDataList?.isFoldT,
      ]),
    )
    localStorage.bottomTitleTop =
      bottomTitleRef?.current?.getBoundingClientRect().top
    localStorage.topTitleTop = topTitleRef?.current?.getBoundingClientRect().top
  }, [getCategoryConfigDataList])
  // 删除
  const onDelete = (state: any, child: any) => {
    setDelItem({ state, child })
    setIsVisible(true)
  }
  const delConfig = () => {
    const { state, child } = delItem
    if (state === 1) {
      const filterData: any = getCategoryConfigF.filter(
        (item: any) => item.storyId !== child.storyId,
      )
      setGetCategoryConfigF(filterData)
      dispatch(
        setGetCategoryConfigArray([...filterData, ...getCategoryConfigT]),
      )
    } else {
      const filterData: any = getCategoryConfigT.filter(
        (item: any) => item.storyId !== child.storyId,
      )
      setGetCategoryConfigT(filterData)
      dispatch(
        setGetCategoryConfigArray([...filterData, ...getCategoryConfigF]),
      )
      setGetCategoryConfigT(filterData)
    }
    getProjectFieIdsApi()
    setIsVisible(false)
    props.onIsOperate(true)
  }
  // 请求api
  const getProjectFieIdsApi = async () => {
    const payloadList = await services.demand.getProjectFieIds(projectInfo.id)
    dispatch(setProjectFieIdsData(payloadList))
  }
  // 必填
  function onChangeChecked(state: any, val: boolean, child: any) {
    const checked = val ? 1 : 2
    if (state === 1) {
      setGetCategoryConfigF(
        getCategoryConfigF?.map((el: any) => ({
          ...el,
          isRequired: el.id === child.id ? checked : el.isRequired,
        })),
      )
    } else {
      setGetCategoryConfigT(
        getCategoryConfigT?.map((el: any) => ({
          ...el,
          isRequired: el.id === child.id ? checked : el.isRequired,
        })),
      )
    }
    dispatch(
      setGetCategoryConfigArray([...getCategoryConfigF, ...getCategoryConfigT]),
    )
    props.onIsOperate(true)
  }
  // 插入
  const onInsert = async (item: any) => {
    const newItem = {
      id: 0,
      title: item.title,
      remarks: item.remarks,
      fieldContent: item.field_content,
      content: item.field_content.attr,
      isCustomize: 1,
      storyId: item.id,
      is_required: 2,
      is_fold: configType === 1 ? 1 : 2,
    }
    if (configType === 1) {
      const arrData = Array.from(getCategoryConfigF)
      arrData.splice(draggingIndex, 0, newItem)
      // 插入空白区域的情况
      draggingIndex !== -1
        ? setGetCategoryConfigF(arrData)
        : setGetCategoryConfigF([...getCategoryConfigF, newItem])
      dispatch(
        setGetCategoryConfigArray([
          ...getCategoryConfigT,
          ...(draggingIndex !== -1
            ? arrData
            : [...getCategoryConfigF, newItem]),
        ]),
      )
    } else {
      const arrData = Array.from(getCategoryConfigT)
      arrData.splice(draggingIndex, 0, newItem)
      setGetCategoryConfigT(arrData)
      draggingIndex !== -1
        ? setGetCategoryConfigT(arrData)
        : setGetCategoryConfigT([...getCategoryConfigT, newItem])
      dispatch(
        setGetCategoryConfigArray([
          ...getCategoryConfigF,
          ...(draggingIndex !== -1
            ? arrData
            : [...getCategoryConfigT, newItem]),
        ]),
      )
    }
  }
  // 去重
  const fitlerDataList = (data: any) => {
    let obj: any = {}
    let set: any = data?.reduce((cur: any, next: any) => {
      obj[next.storyId] ? '' : (obj[next.storyId] = true && cur.push(next))
      return cur
    }, [])
    return set
  }
  // 根据下标去插入元素
  const editCategoryConfig = (item: any, type: any, index: any) => {
    const newItem = {
      title: item.title,
      remarks: item.remarks,
      content: item.content,
      fieldContent: item?.field_content || item?.fieldContent,
      id: item.dragtype === 'move' ? item.id : 0,
      storyId: item.storyId,
      isCustomize: item?.is_customize || item?.isCustomize,
      is_required: item.dragtype !== 'move' ? 2 : item?.isRequired,
      is_fold: type === 1 ? 1 : 2,
    }
    if (type === 1) {
      const arrData = Array.from(getCategoryConfigF)
      arrData.splice(index, 0, newItem)
      setGetCategoryConfigF(fitlerDataList(arrData))
      if (item.dragtype === 'move') {
        const data = getCategoryConfigT.filter(
          (el: any) => el.storyId !== newItem.storyId,
        )
        data && setGetCategoryConfigT(fitlerDataList(data))
      }
      dispatch(setGetCategoryConfigArray([...arrData, ...getCategoryConfigT]))
    } else if (type === 2) {
      const arrData = Array.from(getCategoryConfigT)
      arrData.splice(index, 0, newItem)
      setGetCategoryConfigT(fitlerDataList(arrData))
      if (item.dragtype === 'move') {
        const data = getCategoryConfigF.filter(
          (el: any) => el.storyId !== newItem.storyId,
        )
        data && setGetCategoryConfigF(fitlerDataList(data))
      }
      dispatch(setGetCategoryConfigArray([...arrData, ...getCategoryConfigF]))
    }
    setDragState(false)
  }
  //拖动传递过来的参数
  const onDrop = (state: any, event: any, index: any) => {
    setConfigType(state)
    setDraggingIndex(index)
    // 自定义字段只能添加20个
    const customizeNum = getProjectFieIdsData?.filter(
      (el: any) => el.is_customize === 1,
    )
    const evevtObj: any = event.dataTransfer.getData('item')
      ? JSON.parse(event.dataTransfer.getData('item'))
      : null
    const dragItem = event.dataTransfer.getData('DragItem')
      ? JSON.parse(event.dataTransfer.getData('DragItem'))
      : null
    if (customizeNum?.length === 20 && evevtObj?.dragtype === 'add') {
      getMessage({ msg: t('newlyAdd.maxAddFields'), type: 'warning' })
      return
    } else {
      setColItem(null)
      evevtObj?.dragtype === 'add' && setAddAndEditVisible(true),
        setFieldType(evevtObj)
      evevtObj?.dragtype === 'edit' &&
        editCategoryConfig(evevtObj, state, index)
      dragItem?.dragtype === 'move' &&
        editCategoryConfig(dragItem, state, index)
      props.onIsOperate(true)
    }
  }
  // 每一行的点击事件
  const tabsDraggingOnclick = (state: any, index: any, child: any) => {
    setConfigType(state)
    setDraggingIndex(index)
    setColItem(child)
    setAddAndEditVisible(true)
  }

  // 保存排序
  const save = async () => {
    let dataArr = [...getCategoryConfigF, ...getCategoryConfigT]
    const newData = dataArr.map((el: any, i: number) => ({
      id: el.id,
      story_config_id: el.storyId,
      sort: i,
      is_fold: el.isFold || el.is_fold,
      is_required: el.isRequired || el.is_required,
    }))
    try {
      await configSave({
        id: activeCategory.id,
        project_id: projectInfo.id,
        data: newData,
      })
      getMessage({ msg: t('common.saveSuccess'), type: 'success' })
      await dispatch(
        getCategoryConfigList({
          projectId: projectInfo.id,
          categoryId: activeCategory.id,
        }),
      )
      props.onBack()
    } catch (error) {
      props.onBack()
    }
  }
  useEffect(() => {
    if (props.isSave) {
      save()
    }
  }, [props.isSave])
  const onUpDate = async (res: any) => {
    const newItem = {
      title: res.name,
      remarks: res.remarks,
      fieldContent: res.content,
      is_fold: configType === 1 ? 1 : 2,
    }
    if (configType === 1) {
      const arrData = Array.from(getCategoryConfigF)
      const item: any = arrData[draggingIndex]
      arrData[draggingIndex] = { ...item, ...newItem }
      setGetCategoryConfigF(arrData)
      dispatch(setGetCategoryConfigArray([...arrData, ...getCategoryConfigT]))
    } else {
      const arrData = Array.from(getCategoryConfigT)
      const item: any = arrData[draggingIndex]
      arrData[draggingIndex] = { ...item, ...newItem }
      dispatch(setGetCategoryConfigArray([...arrData, ...getCategoryConfigF]))
      setGetCategoryConfigT(arrData)
    }
  }
  const onChangeMove = (list: any, type: any) => {
    type === 1 ? setGetCategoryConfigF(list) : setGetCategoryConfigT(list)
    props.onIsOperate(true)
  }
  // 空白区域的情况
  const onDropEmpty = (event: any, state: number) => {
    setConfigType(state)
    setDraggingIndex(-1)
    const evevtObj: any = event.dataTransfer.getData('item')
      ? JSON.parse(event.dataTransfer.getData('item'))
      : null
    evevtObj?.dragtype === 'add' && setAddAndEditVisible(true),
      setFieldType(evevtObj)
    let dragItem: any = null
    if (event.dataTransfer.getData('item')) {
      dragItem = JSON.parse(event.dataTransfer.getData('item'))
    } else if (event.dataTransfer.getData('DragItem')) {
      dragItem = JSON.parse(event.dataTransfer.getData('DragItem'))
    }
    // 拖拽被加进去的不要
    if (!dragItem.title || !dragItem.storyId) {
      return
    }
    dragItem.isFold = state
    const filterDataF = getCategoryConfigF.filter(
      (el: any) => el.storyId !== dragItem.storyId,
    )
    const filterDataT = getCategoryConfigT.filter(
      (el: any) => el.storyId !== dragItem.storyId,
    )
    //  双方都需要过滤到拖动的item
    if (state === 1) {
      setGetCategoryConfigF([...filterDataF, dragItem])
      setGetCategoryConfigT(filterDataT)
      dispatch(
        setGetCategoryConfigArray([
          ...filterDataT,
          ...[...filterDataF, dragItem],
        ]),
      )
    } else {
      setGetCategoryConfigF(filterDataF)
      setGetCategoryConfigT([...filterDataT, dragItem])
      dispatch(
        setGetCategoryConfigArray([
          ...filterDataF,
          ...[...filterDataT, dragItem],
        ]),
      )
    }
    props.onIsOperate(true)
  }
  return (
    <div
      id="father"
      draggable="false"
      style={{
        flex: 1,
        height: 'calc(100vh - 220px)',
        overflowY: 'auto',
        padding: '0 24px',
      }}
    >
      <TitleStyle
        ref={topTitleRef}
        draggable="false"
        onClick={() => setInfoIcon(!infoIcon)}
      >
        {getCategoryConfigF?.length >= 1 && (
          <CommonIconFont
            type={infoIcon ? 'down-icon' : 'right-icon'}
            size={14}
            color="var(--neutral-n3)"
          />
        )}
        <span style={{ marginLeft: '8px' }}>
          {t('newlyAdd.basicInfo') as string}
        </span>
      </TitleStyle>
      <div
        style={{ minHeight: 180 }}
        onDrop={event => onDropEmpty(event, 1)}
        onDragOver={event => {
          event.preventDefault()
        }}
      >
        {infoIcon && (
          <TabsDragging
            dragState={dragState}
            onClick={(i: any, child: any) => tabsDraggingOnclick(1, i, child)}
            onDrop={(event: any, index: any) => onDrop(1, event, index)}
            state={1}
            positionType="top"
            onChangeMove={(list: any) => onChangeMove(list, 1)}
            list={getCategoryConfigF}
            onChangeChecked={(val: boolean, child: any) =>
              onChangeChecked(1, val, child)
            }
            onDelete={(child: any) => onDelete(1, child)}
            setList={setGetCategoryConfigF}
          />
        )}
      </div>
      <TitleStyle
        ref={bottomTitleRef}
        draggable="false"
        onClick={() => setMoreIcon(!moreIcon)}
      >
        <CommonIconFont
          type={moreIcon ? 'down-icon' : 'right-icon'}
          size={14}
          color="var(--neutral-n3)"
        />
        <span style={{ marginLeft: '8px' }}>{t('more_folding') as string}</span>
      </TitleStyle>
      <div
        style={{ minHeight: 300 }}
        onDrop={event => onDropEmpty(event, 2)}
        onDragOver={event => {
          event.preventDefault()
        }}
      >
        {moreIcon && (
          <TabsDragging
            dragState={dragState}
            state={2}
            positionType="bottom"
            onChangeMove={(list: any) => onChangeMove(list, 2)}
            onClick={(i: any, child: any) => tabsDraggingOnclick(2, i, child)}
            onDrop={(event: any, index: any) => onDrop(2, event, index)}
            list={getCategoryConfigT}
            onDelete={(child: any) => onDelete(2, child)}
            onChangeChecked={(val: boolean, child: any) =>
              onChangeChecked(2, val, child)
            }
            setList={setGetCategoryConfigT}
          />
        )}
        <DeleteConfirm
          isVisible={isVisible}
          onChangeVisible={() => setIsVisible(false)}
          onConfirm={() => delConfig()}
        />
        {/* 创建编辑自定义字段弹窗 */}
        <EditField
          fieldType={fieldType}
          item={colItem}
          isVisible={addAndEditVisible}
          onEditUpdate={res => onUpDate(res)}
          onInsert={(item: any) => onInsert(item)}
          onClose={() => setAddAndEditVisible(false)}
        />
      </div>
    </div>
  )
}
export default Main
