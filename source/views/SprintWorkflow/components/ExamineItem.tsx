// 需求设置-流转弹窗审核模块下的

/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import NoData from '@/components/NoData'
import { NameWrap } from '@/components/StyleCommon'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Input, Popover, Space, Timeline, Tooltip } from 'antd'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const AddWrap = styled.div({
  marginTop: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 24,
  width: 24,
  boxSizing: 'border-box',
  cursor: 'pointer',
  borderRadius: 16,
  border: '1px dashed var(--neutral-n3)',
  '.icon': {
    color: 'var(--neutral-n3)',
    fontSize: 16,
  },
  '&: hover': {
    border: '1px dashed var(--primary-d2)',
    '.icon': {
      color: 'var(--primary-d2)!important',
    },
  },
})

const PersonItemWrap = styled.div({
  height: 44,
  lineHeight: '44px',
  fontSize: 14,
  color: 'var( --neutral-n1-d1)',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '0 16px',
  '&: hover': {
    background: 'var( --neutral-n7)',
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
    color: 'var(--primary-d2)',
    background: 'var(--hover-d2)',
  },
})

const MenuWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: 14,
  color: 'var(--neutral-n2)',
})

export const IconFontWrap = styled(IconFont)({
  fontSize: 14,
  color: 'var( --neutral-n4)',
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
  color: 'var(--neutral-n3)',
  cursor: 'pointer',
  display: 'none',
  margin: '0 0 0 12px',
})

export const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.changeSize': {
    fontSize: 12,
    color: 'var(--neutral-n2)',
    marginLeft: 10,
  },
  '&: hover': {
    [IconfontCloseWrap.toString()]: {
      display: 'block',
    },
  },
})

const queTooltipStyle = css`
  margin-left: 8px;
  font-size: 15px;
  cursor: pointer;
`
interface ChoosePersonProps {
  onChangeValue(obj: any): void
  options: any
  visible?: any
}

export const ChoosePerson = (props: ChoosePersonProps) => {
  const [t] = useTranslation()
  const [value, setValue] = useState('')
  const inputRefDom = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }, [props.visible])

  return (
    <div style={{ padding: '16px 0', minWidth: 240 }}>
      <div style={{ padding: '0 16px' }}>
        <Input
          value={value}
          style={{ height: 32, width: 208 }}
          placeholder={t('newlyAdd.pleaseKeyWord')}
          onChange={e => setValue(e.target.value)}
          allowClear
          autoFocus
          ref={inputRefDom as any}
        />
      </div>
      <PersonWrap>
        {props?.options
          ?.filter((k: any) => k.name.includes(value))
          ?.map((i: any) => {
            return (
              <PersonItemWrap
                key={i.id}
                onClick={() => {
                  props?.onChangeValue(i)
                  setValue('')
                }}
              >
                <CommonUserAvatar avatar={i?.avatar} />
                <span style={{ marginLeft: 8 }}>{i.name}</span>
              </PersonItemWrap>
            )
          })}

        {props?.options?.filter((k: any) => k.name.includes(value))?.length <=
          0 && <NoData size="mini" />}
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
    {
      name: t('newlyAdd.sequence'),
      value: 1,
      icon: 'right',
      tips: t('other.text1'),
    },
    {
      name: t('newlyAdd.andExamine'),
      value: 2,
      icon: 'and',
      tips: t('other.text2'),
    },
    {
      name: t('newlyAdd.orExamine'),
      value: 3,
      icon: 'line',
      tips: t('other.text3'),
    },
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
        <span
          style={{
            marginLeft: '-2px',
          }}
          className="changeSize"
        >
          {t('newlyAdd.reviewPerson')}
        </span>

        <Tooltip
          placement="topRight"
          title={menuList?.filter((i: any) => i.value === normal)[0]?.tips}
        >
          <span
            style={{
              marginLeft: 32,
              color: 'var(--neutral-n1-d2)',
              verticalAlign: 'text-bottom',
              fontSize: 12,
            }}
          >
            {menuList?.filter((i: any) => i.value === normal)[0]?.name}
          </span>
          <IconFont
            style={{
              color: 'var(--neutral-n3)',
            }}
            className={queTooltipStyle}
            type="question"
          />
        </Tooltip>
        <Popover
          key={isShowSelect.toString()}
          visible={isShowSelect}
          placement="bottomRight"
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
              // marginTop: 4,
            }}
          >
            <IconFont
              style={{
                marginLeft: 8,
                color: isShowSelect
                  ? 'var(--primary-d2)'
                  : 'var(--neutral-n1-d2)',
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
                margin: '10px 0 4px 0',
              }}
            >
              <div
                style={{
                  display: 'flex',

                  alignItems: 'center',
                }}
              >
                <NewNameWrap>
                  <CommonUserAvatar avatar={i?.avatar} />
                  <IconFontWrap
                    type="close-solid"
                    onClick={() => onDelCheckPerson(i.id)}
                  />
                </NewNameWrap>
                <span
                  style={{
                    marginLeft: '10px',
                  }}
                  className="changeSize"
                >
                  {i.name}
                </span>
              </div>
              {index !== examineList?.length - 1 && (
                <IconFont
                  style={{
                    fontSize: 16,
                    margin: '0px 8px 0',
                    color: 'var(--neutral-n4)',
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
                  visible={isOpen}
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
                  style={{
                    fontSize: '12px',
                  }}
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
