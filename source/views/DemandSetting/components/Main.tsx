/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import TabsDragging from './TabsDragging'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import EditField from './EditField'
import { configSave } from '@/services/demand'
import { message } from 'antd'
import { getCategoryConfigList } from '@store/category/thunk'
import { setGetCategoryConfigArray } from '@store/category'
import { useTranslation } from 'react-i18next'

const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  margin: 20px 0 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const Main = (props: any) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [infoIcon, setInfoIcon] = useState(true)
  const [moreIcon, setMoreIcon] = useState(false)
  const { getCategoryConfigDataList, activeCategory, getProjectFieIdsData } =
    useSelector(store => store.category)
  const { projectInfo } = useSelector(store => store.project)
  const [getCategoryConfigT, setGetCategoryConfigT] = useState<any>()
  const [getCategoryConfigF, setGetCategoryConfigF] = useState<any>()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [delItem, setDelItem] = useState<any>()
  const [addAndEditVisible, setAddAndEditVisible] = useState<boolean>(false)
  const [fieldType, setFieldType] = useState()
  const [draggingIndex, setDraggingIndex] = useState<any>()
  const [configType, setConfigType] = useState(0)
  const [colItem, setColItem] = useState<any>()
  useEffect(() => {
    setGetCategoryConfigT(getCategoryConfigDataList?.isFoldT)
    setGetCategoryConfigF(getCategoryConfigDataList?.isFoldF)
    setInfoIcon(true)
  }, [getCategoryConfigDataList])
  //  移动后跟新的数据
  const onMove = (state: number, data: any) => {
    if (state === 1) {
      setGetCategoryConfigF(data)
    } else {
      setGetCategoryConfigT(data)
    }
    props.onIsOperate(true)
  }
  // 删除
  const onDelete = (state: any, child: any) => {
    setDelItem({ state, child })
    setIsVisible(true)
  }
  const delConfig = () => {
    const { state, child } = delItem
    if (state === 1) {
      setGetCategoryConfigF(
        getCategoryConfigF.filter(
          (item: any) => item.storyId !== child.storyId,
        ),
      )
    } else {
      setGetCategoryConfigT(
        getCategoryConfigT.filter(
          (item: any) => item.storyId !== child.storyId,
        ),
      )
    }
    setIsVisible(false)
    props.onIsOperate(true)
  }
  useEffect(() => {
    if (getCategoryConfigF?.length >= 1 || getCategoryConfigT?.length >= 1)
      dispatch(
        setGetCategoryConfigArray([
          ...getCategoryConfigF,
          ...getCategoryConfigT,
        ]),
      )
  }, [getCategoryConfigF, getCategoryConfigT])
  // 必填
  const onChangeChecked = (state: any, val: boolean, child: any) => {
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
    props.onIsOperate(true)
  }
  // 插入
  const onInsert = async (item: any) => {
    const newItem = {
      title: item.title,
      remarks: item.remarks,
      fieldContent: item.field_content,
      content: item.field_content.attr,
      isCustomize: 1,
      storyId: item.id,
      is_required: 2,
      is_fold: draggingIndex === 1 ? 1 : 2,
    }
    if (configType === 1) {
      const arrData = Array.from(getCategoryConfigF)
      arrData.splice(draggingIndex, 0, newItem)
      setGetCategoryConfigF(arrData)
    } else {
      const arrData = Array.from(getCategoryConfigT)
      arrData.splice(draggingIndex, 0, newItem)
      setGetCategoryConfigT(arrData)
    }
    setDraggingIndex(null)
  }
  const EditCategoryConfig = (item: any) => {
    const newItem = {
      title: item.title,
      remarks: item.remarks,
      content: item.field_content.attr,
      fieldContent: item.field_content,
      storyId: item.id,
      isCustomize: 1,
      is_required: 2,
      is_fold: configType === 1 ? 1 : 2,
    }
    if (configType === 1) {
      const arrData = Array.from(getCategoryConfigF)
      arrData.splice(draggingIndex, 0, newItem)
      setGetCategoryConfigF(arrData)
    } else {
      const arrData = Array.from(getCategoryConfigT)
      arrData.splice(draggingIndex, 0, newItem)
      setGetCategoryConfigT(arrData)
    }
  }
  //拖动传递过来的参数
  const onDrop = (state: any, event: any, index: any) => {
    setDraggingIndex(index)
    // 自定义字段只能添加20个
    const customizeNum = getProjectFieIdsData?.filter(
      (el: any) => el.is_customize === 1,
    )
    const evevtObj = JSON.parse(event.dataTransfer.getData('item'))
    if (customizeNum?.length === 20 && evevtObj.dragtype === 'add') {
      message.warning(t('newlyAdd.maxAddFields'))
      return
    }
    setColItem(null)
    evevtObj.dragtype === 'add' && setAddAndEditVisible(true),
      setFieldType(evevtObj)
    evevtObj.dragtype === 'edit' && EditCategoryConfig(evevtObj)
    setConfigType(state)
    props.onIsOperate(true)
  }
  const tabsDraggingOnClcik = (state: any, index: any, child: any) => {
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
    await configSave({
      id: activeCategory.id,
      project_id: projectInfo.id,
      data: newData,
    })
    message.success(t('common.saveSuccess'))
    await dispatch(
      getCategoryConfigList({
        projectId: projectInfo.id,
        categoryId: activeCategory.id,
      }),
    )
    props.onBack()
  }
  useEffect(() => {
    if (props.isSave) {
      save()
    }
  }, [props.isSave])
  const onUpDate = async () => {
    await dispatch(
      getCategoryConfigList({
        projectId: projectInfo.id,
        categoryId: activeCategory.id,
      }),
    )
  }
  return (
    <div
      style={{
        flex: 1,
        height: 'calc(100vh - 200px)',
        overflowY: 'auto',
        paddingRight: 24,
      }}
    >
      <TitleStyle onClick={() => setInfoIcon(!infoIcon)}>
        {getCategoryConfigF?.length >= 1 && (
          <CommonIconFont
            type={infoIcon ? 'down-icon' : 'right-icon'}
            size={14}
            color="var(--neutral-n3)"
          />
        )}
        <span>{t('newlyAdd.basicInfo') as string}</span>
      </TitleStyle>
      {infoIcon && (
        <TabsDragging
          onClick={(i: any, child: any) => tabsDraggingOnClcik(1, i, child)}
          onDrop={(event: any, index: any) => onDrop(1, event, index)}
          onMove={(data: any) => onMove(1, data)}
          state={1}
          list={getCategoryConfigF}
          onChangeChecked={(val: boolean, child: any) =>
            onChangeChecked(1, val, child)
          }
          onDelete={(child: any) => onDelete(1, child)}
          setList={setGetCategoryConfigF}
        />
      )}
      <TitleStyle onClick={() => setMoreIcon(!moreIcon)}>
        <CommonIconFont
          type={moreIcon ? 'down-icon' : 'right-icon'}
          size={14}
          color="var(--neutral-n3)"
        />
        <span>{t('more_folding') as string}</span>
      </TitleStyle>
      {moreIcon && (
        <TabsDragging
          state={2}
          onClick={(i: any, child: any) => tabsDraggingOnClcik(1, i, child)}
          onDrop={(event: any, index: any) => onDrop(2, event, index)}
          onMove={(data: any) => onMove(2, data)}
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
        onEditUpdate={() => onUpDate()}
        onInsert={(item: any) => onInsert(item)}
        onClose={() => setAddAndEditVisible(false)}
      />
    </div>
  )
}
export default Main
