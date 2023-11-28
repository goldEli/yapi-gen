/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import TabsDragging from './TabsDragging'
import RightDragging from './RightDragging'
import ParmasDialog from './ParmasDialog'
import { useDispatch, useSelector } from '@store/index'
import { setTemplateContentConfigs, setEditSave } from '@store/formWork'
import { useTranslation } from 'react-i18next'
import { getMessage } from '@/components/Message'

const TitleStyle = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 14px;
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  margin: 0 24px 16px 24px;
  span:nth-child(2) {
    margin-left: 8px;
    font-size: 12px;
    color: var(--neutral-n3);
    font-weight: 400;
    font-family: PingFang SC-Regular, PingFang SC;
  }
`
const LeftTabs = styled.div`
  overflow-x: hidden;
  flex: 1;
  height: 100%;
  /* overflow-y: auto; */
`
const RightTabs = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 400px;
  padding: 0 24px;
  border-left: 1px solid var(--neutral-n6-d1);
`
interface PropsType {
  back(): void
  value: string
}
interface DragItem {
  type: number
  title: string
  icon: string
}
const EditWork = (props: PropsType) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [dragItem, setDragItem] = useState<any>()
  const [index, setIndex] = useState(0)
  const [type, setType] = useState('')
  const { templateContentConfigs } = useSelector(store => store.formWork)
  const [dataList, setDataList] = useState<any>()
  const [isEmpty, setIsEmpty] = useState(false)
  const onDrag = (event: any, i: number, empty?: boolean) => {
    dispatch(setEditSave(false))
    setIsEmpty(empty || false)
    const evevtObj: any = event.dataTransfer.getData('item')
      ? JSON.parse(event.dataTransfer.getData('item'))
      : null
    // 上下移动不会触发拖动的弹窗
    if (evevtObj?.dragtype === 'move') {
      return
    }
    // 关联需求没有弹窗
    if (evevtObj.type === 4) {
      const configs = {
        type: evevtObj.type,
        tips: evevtObj.tips || '',
        name: evevtObj.title,
        id: Math.random(),
        is_required: 2,
      }
      const newList = dataList.find((el: { type: number }) => el.type === 4)
      if (newList) {
        getMessage({ msg: t('formWork.has'), type: 'warning' })
        return
      }
      if (empty) {
        dispatch(setTemplateContentConfigs([...dataList, configs]))
      } else {
        const arrData = Array.from(dataList)
        arrData.splice(i, 0, configs)
        setDataList(arrData)
        dispatch(setTemplateContentConfigs(arrData))
      }
    } else {
      const configs = {
        type: evevtObj.type,
        tips: evevtObj.tips || '',
        name: evevtObj.title,
        id: Math.random(),
        is_required: 2,
      }
      setType('add')
      setIndex(i)
      setDragItem(configs)
      evevtObj && setIsVisible(true)
    }
  }
  // 组件参数配置
  const ParmasDialogOnConfirm = (obj: any, num: number) => {
    const filterName = dataList.find((el: any) => el.name === obj.name)
    if (filterName && type === 'add') {
      return getMessage({ msg: t('formWork.hasTemplate'), type: 'warning' })
    }
    const configs = {
      type: num,
      id: Math.random(),
      tips: obj.tips || '',
      name: obj.name,
      is_required: obj.is_required,
    }
    setIsVisible(false)
    let arrData = Array.from(dataList)
    if (type === 'add') {
      isEmpty
        ? (arrData = [...dataList, configs])
        : arrData.splice(index, 0, configs)
      isEmpty ? setDataList([...dataList, configs]) : setDataList(arrData)
    } else if (type === 'edit') {
      arrData[index] = configs
      setDataList(arrData)
    }
    dispatch(setEditSave(false))
    dispatch(setTemplateContentConfigs(arrData))
  }
  // 必填选项
  const onChangeChecked = (val: boolean, el: any) => {
    dispatch(setEditSave(false))
    const num = val ? 1 : 2
    const arr = dataList.map((item: any) => ({
      ...item,
      is_required: el.id === item.id ? num : item.is_required,
    }))
    dispatch(setTemplateContentConfigs(arr))
    setDataList(arr)
  }
  // 行点击事件
  const onClick = (i: number, el: any) => {
    setIndex(i)
    setDragItem(el)
    setType('edit')
    setIsVisible(true)
  }
  // 删除
  const onDelete = (el: { name: string; id: any }) => {
    dispatch(setEditSave(false))
    const arr = dataList.filter((item: any) => el.id !== item.id)
    dispatch(setTemplateContentConfigs(arr))
    setDataList(arr)
  }
  useEffect(() => {
    setDataList(templateContentConfigs)
  }, [templateContentConfigs])
  return (
    <div id="father" style={{ display: 'flex', height: 'calc(100vh - 260px)' }}>
      <LeftTabs
        onDragOver={event => {
          event.preventDefault(), event.stopPropagation()
        }}
      >
        <TitleStyle draggable="false">
          <span>{t('formWork.content')}</span>
        </TitleStyle>
        <div
          style={{ height: 'calc(100% - 22px)', overflowY: 'auto' }}
          onDrop={event => {
            onDrag(event, dataList?.length - 1, true)
          }}
          onDragOver={event => {
            event.preventDefault()
          }}
        >
          <TabsDragging
            positionType="top"
            onClick={(i: any, child: any) => onClick(i, child)}
            onDrop={(event: any, i: any) => onDrag(event, i)}
            onChangeMove={(list: any) => {
              setDataList(list), dispatch(setTemplateContentConfigs(list))
            }}
            list={dataList}
            onChangeChecked={(val: boolean, child: any) =>
              onChangeChecked(val, child)
            }
            onDelete={(child: any) => onDelete(child)}
            setList={setDataList}
          />
        </div>
      </LeftTabs>
      {/* 基础控件 */}
      <RightTabs>
        <TitleStyle draggable="false" style={{ marginLeft: 0 }}>
          <span>{t('formWork.msg1')}</span>
          <span>{t('formWork.msg2')}</span>
        </TitleStyle>
        <RightDragging />
      </RightTabs>

      {/* 组件配置弹窗 */}
      <ParmasDialog
        dragItem={dragItem}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onConfirm={ParmasDialogOnConfirm}
      />
    </div>
  )
}
export default EditWork
