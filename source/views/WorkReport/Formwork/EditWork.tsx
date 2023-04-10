/* eslint-disable react/jsx-handler-names */
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import TabsDragging from './TabsDragging'
import RightDragging from './RightDragging'
import ParmasDialog from './ParmasDialog'
import CommonButton from '@/components/CommonButton'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import { setEditSave } from '@store/formWork'
import { upDateTemplate } from '@/services/formwork'
import { getTemplateList } from '@store/formWork/thunk'
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
const BtnRow = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-end;
`
interface PropsType {
  back(): void
  value: string
}
const EditWork = (props: PropsType) => {
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const [delIsVisible, setDelIsVisible] = useState(false)
  const { editSave } = useSelector(store => store.formWork)
  const [save, setSave] = useState(editSave)
  const [list1, setList1] = useState([
    {
      title: 'q',
      fieldContent: {
        attr: 'text',
      },
      storyId: 1,
    },
    {
      title: 'q1',
      fieldContent: {
        attr: 'text',
      },
      storyId: 2,
    },
  ])
  const onDrag = (event: any, index: number) => {
    setIsVisible(true)
  }
  const back = () => {
    if (editSave) {
      props.back()
    } else {
      setDelIsVisible(true)
    }
  }
  useEffect(() => {
    setSave(editSave)
  }, [editSave])
  const saveApi = async () => {
    dispatch(setEditSave(true))
    await upDateTemplate({ name: props.value })
    message.success('编辑成功')
    await dispatch(getTemplateList())
  }
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
              onClick={(i: any, child: any) => console.log('click')}
              onDrop={(event: any, index: any) => onDrag(event, index)}
              onMove={(data: any) => console.log('move')}
              onChangeMove={(list: any) => setList1(list)}
              list={list1}
              onChangeChecked={(val: boolean, child: any) =>
                console.log('checked')
              }
              onDelete={(child: any) => console.log('sc')}
              setList={setList1}
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
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          onConfirm={() => 123}
        />
      </div>
      {/* 底部保存 */}
      <BtnRow>
        <CommonButton type="light" onClick={() => back()}>
          下一步
        </CommonButton>
        {save ? (
          <CommonButton
            type="primary"
            onClick={() => console.log(123)}
            style={{ margin: '0 0px 0 16px' }}
          >
            已保存
          </CommonButton>
        ) : (
          <CommonButton
            type="primary"
            onClick={() => saveApi()}
            style={{ margin: '0 0px 0 16px' }}
          >
            保存
          </CommonButton>
        )}
      </BtnRow>
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
