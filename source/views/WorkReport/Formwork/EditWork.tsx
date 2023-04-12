/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import TabsDragging from './TabsDragging'
import RightDragging from './RightDragging'
import ParmasDialog from './ParmasDialog'
import CommonButton from '@/components/CommonButton'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import { setEditSave, setTemplateContentConfigs } from '@store/formWork'
import { upDateTemplate } from '@/services/formwork'
import { message } from 'antd'
const TitleStyle = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 14px;
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  margin-bottom: 16px;
  span:nth-child(2) {
    margin-left: 8px;
    font-size: 12px;
    color: var(--neutral-n3);
    font-weight: 400;
    font-family: PingFang SC-Regular, PingFang SC;
  }
`
const LeftTabs = styled.div`
  flex: 1;
  margin: 0 24px;
  height: calc(100vh - 220px);
  overflow-y: auto;
`
const RightTabs = styled.div`
  height: calc(100vh - 220px);
  overflow-y: auto;
  width: 400;
  padding-left: 24px;
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
  const [isVisible, setIsVisible] = useState(false)
  const [delIsVisible, setDelIsVisible] = useState(false)
  const [dragItem, setDragItem] = useState<any>()
  const [index, setIndex] = useState(0)
  const [type, setType] = useState('')
  const { templateContentConfigs } = useSelector(store => store.formWork)
  const [dataList, setDataList] = useState([
    {
      name: '汇报对象',
      is_required: 2,
      tips: '',
      type: 1,
    },
  ])
  const onDrag = (event: any, i: number) => {
    const evevtObj: any = event.dataTransfer.getData('item')
      ? JSON.parse(event.dataTransfer.getData('item'))
      : null
    if (evevtObj.type === 4) {
      const configs = {
        type: evevtObj.type,
        tips: evevtObj.tips || '',
        name: evevtObj.title,
        is_required: 2,
      }
      const arrData = Array.from(dataList)
      arrData.splice(i, 0, configs)
      setDataList(arrData)
    } else {
      const configs = {
        type: evevtObj.type,
        tips: evevtObj.tips || '',
        name: evevtObj.title,
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
    const configs = {
      type: num,
      tips: obj.tips || '',
      name: obj.name,
      is_required: obj.is_required,
    }
    setIsVisible(false)
    const arrData = Array.from(dataList)
    if (type === 'add') {
      arrData.splice(index, 0, configs)
      setDataList(arrData)
    } else if (type === 'edit') {
      arrData[index] = configs
      setDataList(arrData)
    }
    dispatch(setTemplateContentConfigs(arrData))
  }
  const onChangeChecked = (val: boolean, el: any) => {
    const num = val ? 1 : 2
    const arr = dataList.map(item => ({
      ...item,
      is_required: el.name === item.name ? num : item.is_required,
    }))
    dispatch(setTemplateContentConfigs(arr))
    setDataList(arr)
  }
  const onClick = (i: number, el: any) => {
    setIndex(i)
    setDragItem(el)
    setType('edit')
    setIsVisible(true)
  }
  const onDelete = (el: { name: string }) => {
    const arr = dataList.filter(item => el.name !== item.name)
    dispatch(setTemplateContentConfigs(arr))
    setDataList(arr)
  }
  // console.log(templateContentConfigs, 'TemplateContentConfigs')
  return (
    <>
      <div id="father" style={{ display: 'flex' }}>
        <LeftTabs>
          <TitleStyle draggable="false">
            <span>汇报内容</span>
          </TitleStyle>
          <div>
            <TabsDragging
              positionType="top"
              onClick={(i: any, child: any) => onClick(i, child)}
              onDrop={(event: any, i: any) => onDrag(event, i)}
              onMove={(data: any) => console.log('move')}
              // onChangeMove={(list: any) => setList1(list)}
              list={dataList}
              onChangeChecked={(val: boolean, child: any) =>
                onChangeChecked(val, child)
              }
              onDelete={(child: any) => onDelete(child)}
              setList={setDataList}
            />
          </div>
        </LeftTabs>
        <RightTabs>
          <TitleStyle draggable="false">
            <span>基础控件</span>
            <span>将控件拖动到左侧区域创建</span>
          </TitleStyle>
          <RightDragging />
        </RightTabs>

        {/* 组件配置弹窗 */}
        <ParmasDialog
          // type={type}
          dragItem={dragItem}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          onConfirm={ParmasDialogOnConfirm}
        />
      </div>

      {/* 未保存的弹窗 */}
      <DeleteConfirm
        title={'保存提示'}
        text="【模版名称】还未保存，是否保存编辑内容？"
        isVisible={delIsVisible}
        onConfirm={() => setDelIsVisible(false)}
        notCancel
      />
    </>
  )
}
export default EditWork
