/* eslint-disable react/jsx-handler-names */
import styled from '@emotion/styled'
import { useState } from 'react'
import TabsDragging from './TabsDragging'
import RightDragging from './RightDragging'
import ParmasDialog from './ParmasDialog'
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
const EditWork = () => {
  const [isVisible, setIsVisible] = useState(false)
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
  return (
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
  )
}
export default EditWork
