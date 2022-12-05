// 需求设置-流转弹窗审核模块下的

/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { NameWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Input, Popover, Space, Timeline } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const AddWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  width: 32,
  boxSizing: 'border-box',
  cursor: 'pointer',
  borderRadius: 16,
  border: '1px dashed #969799',
  '.icon': {
    color: '#969799',
    fontSize: 16,
  },
  '&: hover': {
    border: '1px dashed #2877ff',
    '.icon': {
      color: '#2877ff!important',
    },
  },
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
  '::-webkit-scrollbar': { display: 'none' },
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

export const IconFontWrap = styled(IconFont)({
  fontSize: 14,
  color: '#BBBDBF',
  cursor: 'pointer',
  display: 'none',
  position: 'absolute',
  right: -4,
  top: -5,
})

export const NewNameWrap = styled.div({
  position: 'relative',
  overflow: 'inherit',
  '&: hover': {
    [IconFontWrap.toString()]: {
      display: 'block',
    },
  },
})

const IconfontCloseWrap = styled(IconFont)({
  fontSize: 16,
  color: '#969799',
  cursor: 'pointer',
  display: 'none',
  margin: '4px 0 0 12px',
})

export const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.changeSize': {
    fontSize: 12,
    marginTop: 4,
  },
  '&: hover': {
    [IconfontCloseWrap.toString()]: {
      display: 'block',
    },
  },
})

interface ChoosePersonProps {
  onChangeValue(obj: any): void
  options: any
}

export const ChoosePerson = (props: ChoosePersonProps) => {
  const [t] = useTranslation()
  const [value, setValue] = useState('')

  return (
    <div style={{ padding: '16px 0', minWidth: 240 }}>
      <div style={{ padding: '0 16px' }}>
        <Input
          style={{ height: 32, width: 208 }}
          placeholder={t('newlyAdd.pleaseKeyWord')}
          onChange={e => setValue(e.target.value)}
        />
      </div>
      <PersonWrap>
        {props?.options
          ?.filter((k: any) => k.name.includes(value))
          ?.map((i: any) => {
            return (
              <PersonItemWrap
                key={i.id}
                onClick={() => props?.onChangeValue(i)}
              >
                {i.avatar ? (
                  <img
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      marginRight: 8,
                    }}
                    src={i?.avatar}
                    alt=""
                  />
                ) : (
                  <NameWrap style={{ margin: '0 8px 0 0' }}>
                    {String(
                      i?.name?.substring(0, 1)?.trim().slice(0, 1),
                    ).toLocaleUpperCase()}
                  </NameWrap>
                )}
                {i.name}
              </PersonItemWrap>
            )
          })}
      </PersonWrap>
    </div>
  )
}

interface Props {
  onRef: any
  onDel(): void
  onChangeList(obj: any): void
  options?: any
  item: any
  len?: any
}

const ExamineItem = (props: Props) => {
  const [t] = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isShowSelect, setIsShowSelect] = useState(false)
  const [examineList, setExamineList] = useState<any>([])
  const [normal, setNormal] = useState(1)

  const menuList = [
    { name: t('newlyAdd.sequence'), value: 1, icon: 'right' },
    { name: t('newlyAdd.andExamine'), value: 2, icon: 'and' },
    { name: t('newlyAdd.orExamine'), value: 3, icon: 'line' },
  ]

  useEffect(() => {
    if (props?.item.id) {
      setNormal(props?.item?.obj?.operator || 1)
      setExamineList(props?.item?.obj?.verify_users || [])
    }
  }, [props?.item])

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
    const oldList = examineList
    const arr = [...oldList, ...[obj]]
    setExamineList(arr)
    props?.onChangeList({
      operator: normal,
      verify_users: arr,
      id: obj.id,
      type: 'add',
    })
  }

  const onDelCheckPerson = (id: any) => {
    const arr = examineList?.filter((i: any) => i.id !== id)
    setExamineList(arr)
    props?.onChangeList({
      operator: normal,
      verify_users: arr,
      id,
      type: 'del',
    })
  }

  const onChangeMenu = (val: any) => {
    setNormal(val)
    setIsShowSelect(false)
    props?.onChangeList({
      operator: val,
      id: props?.item.id,
      type: 'update',
    })
  }

  return (
    <Timeline.Item>
      <ItemWrap>
        <span className="changeSize">{t('newlyAdd.reviewPerson')}</span>
        <Popover
          key={isShowSelect.toString()}
          visible={isShowSelect}
          placement="bottom"
          trigger="hover"
          onVisibleChange={visible => setIsShowSelect(visible)}
          content={
            <MenuWrap>
              {menuList?.map((i: any) => (
                <MenuItemWrap
                  key={i.value}
                  onClick={() => onChangeMenu(i.value)}
                >
                  <span className="changeSize">{i.name}</span>
                </MenuItemWrap>
              ))}
            </MenuWrap>
          }
          getPopupContainer={node => node}
        >
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <span
              style={{
                marginLeft: 32,
                color: isShowSelect ? '#2877ff' : '##323233',
                fontSize: 12,
              }}
            >
              {menuList?.filter((i: any) => i.value === normal)[0]?.name}
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
        {props?.len !== 1 && (
          <IconfontCloseWrap type="close" onClick={props?.onDel} />
        )}
      </ItemWrap>
      <ItemWrap style={{ alignItems: 'flex-start', marginTop: 8 }}>
        <Space size={0} style={{ flexWrap: 'wrap' }}>
          {examineList?.map((i: any, index: any) => (
            <div
              key={i.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <NewNameWrap>
                  {i.avatar ? (
                    <img
                      style={{ width: 32, height: 32, borderRadius: 16 }}
                      src={i.avatar}
                    />
                  ) : (
                    <NameWrap style={{ margin: 0 }}>
                      {String(
                        i?.name?.substring(0, 1)?.trim().slice(0, 1),
                      ).toLocaleUpperCase()}
                    </NameWrap>
                  )}
                  <IconFontWrap
                    type="close-circle-fill"
                    onClick={() => onDelCheckPerson(i.id)}
                  />
                </NewNameWrap>
                <span className="changeSize">{i.name}</span>
              </div>
              {index !== examineList?.length - 1 && (
                <IconFont
                  style={{
                    fontSize: 16,
                    margin: '-20px 8px 0',
                    color: '#BBBDBF',
                  }}
                  type={
                    menuList?.filter((k: any) => k.value === normal)[0]?.icon
                  }
                />
              )}
            </div>
          ))}
          {props?.options?.length > 0 && (
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
                  options={props?.options}
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
                  className="icon"
                  type="plus"
                  onClick={() => setIsOpen(true)}
                />
              </AddWrap>
            </Popover>
          )}
        </Space>
      </ItemWrap>
    </Timeline.Item>
  )
}

export default ExamineItem
