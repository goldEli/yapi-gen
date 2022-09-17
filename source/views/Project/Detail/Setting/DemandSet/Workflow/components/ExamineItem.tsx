/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { NameWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Input, Popover, Space, Timeline } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'

const AddWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  width: 32,
  boxSizing: 'border-box',
  cursor: 'pointer',
  borderRadius: 16,
  border: '1px dashed #969799',
})

const PersonItemWrap = styled.div({
  height: 44,
  lineHeight: '44px',
  fontSize: 14,
  color: '#323233',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '0 16px',
  '&: hover': {
    background: '#F0F4FA',
  },
})

const PersonWrap = styled.div({
  maxHeight: 200,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  marginTop: 8,
})

const MenuItemWrap = styled.span({
  display: 'inline-block',
  cursor: 'pointer',
  height: 32,
  padding: '0 16px',
  lineHeight: '32px',
  '&:hover': {
    color: '#2877ff',
    background: '#F0F4FA',
  },
})

const MenuWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: 14,
  color: '#646566',
})

const IconFontWrap = styled(IconFont)({
  fontSize: 14,
  color: '#BBBDBF',
  cursor: 'pointer',
  display: 'none',
  position: 'absolute',
  right: -4,
  top: -5,
})

const NewNameWrap = styled(NameWrap)({
  position: 'relative',
  overflow: 'inherit',
  '&: hover': {
    [IconFontWrap.toString()]: {
      display: 'block',
    },
  },
})

const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const personList = [
  { name: '张三', id: 1 },
  { name: '哈哈哈', id: 2 },
  { name: '问问', id: 3 },
  { name: '站和人', id: 4 },
  { name: '里斯', id: 5 },
]

interface ChoosePersonProps {
  onChangeValue(obj: any): void
  checkList?: any
}

const ChoosePerson = (props: ChoosePersonProps) => {
  const [value, setValue] = useState('')
  const [arr, setArr] = useState<any>([])

  useEffect(() => {
    setArr(
      personList?.filter(
        (i: any) => !props.checkList?.find((k: any) => k.id === i.id),
      ),
    )
  }, [personList, props.checkList])

  return (
    <div style={{ padding: '16px 0', minWidth: 240 }}>
      <div style={{ padding: '0 16px' }}>
        <Input
          style={{ height: 32, width: 208 }}
          placeholder="请输入关键字"
          onChange={e => setValue(e.target.value)}
        />
      </div>
      <PersonWrap>
        {arr
          ?.filter((k: any) => k.name.includes(value))
          ?.map((i: any) => (
            <PersonItemWrap key={i.id} onClick={() => props?.onChangeValue(i)}>
              <NameWrap style={{ margin: '0 8px 0 0' }}>张</NameWrap>
              {i.name}
            </PersonItemWrap>
          ))}
      </PersonWrap>
    </div>
  )
}

const ExamineItem = (props: { onRef: any }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isShowSelect, setIsShowSelect] = useState(false)
  const [examineList, setExamineList] = useState<any>([])

  const onReset = () => {
    setExamineList([])
    setIsShowSelect(false)
    setIsOpen(false)
  }

  useImperativeHandle(props.onRef, () => {
    return {
      reset: onReset,
    }
  })

  const onAddPerson = (obj: any) => {
    setExamineList([...examineList, ...[obj]])
  }

  const onDelCheckPerson = (id: any) => {
    setExamineList(examineList?.filter((i: any) => i.id !== id))
  }
  return (
    <Timeline.Item>
      <ItemWrap>
        <span>审核人</span>
        <Popover
          key={isShowSelect.toString()}
          visible={isShowSelect}
          placement="bottom"
          trigger="hover"
          onVisibleChange={visible => setIsShowSelect(visible)}
          content={
            <MenuWrap>
              <MenuItemWrap key={1}>依次审核</MenuItemWrap>
              <MenuItemWrap key={2}>与逻辑审核</MenuItemWrap>
              <MenuItemWrap key={3}>或逻辑审核</MenuItemWrap>
            </MenuWrap>
          }
          getPopupContainer={node => node}
        >
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginLeft: 32,
                color: isShowSelect ? '#2877ff' : '##323233',
              }}
            >
              依次审核
            </span>
            <IconFont
              style={{
                marginLeft: 8,
                color: isShowSelect ? '#2877ff' : '##323233',
              }}
              type={isShowSelect ? 'up' : 'down'}
            />
          </div>
        </Popover>
      </ItemWrap>
      <ItemWrap style={{ alignItems: 'flex-start', marginTop: 8 }}>
        <Space size={8}>
          {examineList?.map((i: any) => (
            <div
              key={i.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <NewNameWrap>
                <span>张</span>
                <IconFontWrap
                  type="close-circle-fill"
                  onClick={() => onDelCheckPerson(i.id)}
                />
              </NewNameWrap>
              <span>{i.name}</span>
            </div>
          ))}
        </Space>

        <Popover
          key={isOpen.toString()}
          visible={isOpen}
          placement="bottomRight"
          trigger="click"
          onVisibleChange={visible => setIsOpen(visible)}
          getTooltipContainer={node => node}
          content={
            <ChoosePerson
              onChangeValue={obj => onAddPerson(obj)}
              checkList={examineList}
            />
          }
          getPopupContainer={node => node}
        >
          <AddWrap
            style={{
              marginLeft: examineList?.length ? '40px' : 0,
            }}
          >
            <IconFont
              type="plus"
              onClick={() => setIsOpen(true)}
              style={{ color: '#969799', fontSize: 16 }}
            />
          </AddWrap>
        </Popover>
      </ItemWrap>
    </Timeline.Item>
  )
}

export default ExamineItem
