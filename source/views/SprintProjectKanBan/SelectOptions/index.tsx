import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Menu } from 'antd'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'

interface SelectBoxProps {
  title: string
  onChange(ley: string): void
  options: Model.SprintKanBan.Option[]
  operation?: Model.SprintKanBan.Option['operation']
}

const SelectOptionsBox = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 6px;
  /* padding: 0 16px; */
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  color: var(--neutral-n2);
  background-color: var(--hover-d2);
  &:hover {
    color: var(--auxiliary-text-t1-d2);
  }
`

const OperationArea = styled.div`
  width: 50px;
`
const BtnsArea = styled.div`
  display: none;
  gap: 14px;
`

const CheckIcon = styled.div<{ visible: boolean }>`
  display: ${props => (props.visible ? 'flex' : 'none')};
  justify-content: flex-end;
`

const LabelArea = styled.div`
  display: flex;
  gap: 8px;
  margin-right: 16px;
`

const DefaultTag = styled.div<{ visible: boolean }>`
  display: ${props => (props.visible ? 'flex' : 'none')};
  font-size: 12px;
  height: 22px;
  padding: 0 8px;
  align-items: center;
  justify-content: center;
  color: var(--neutral-n2);
  background-color: var(--neutral-n7);
  border-radius: 6px;
`

const Options = styled.div`
  height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover .label {
    color: var(--neutral-n1-d1);
  }
  &:hover ${BtnsArea} {
    display: flex;
  }
  &:hover ${CheckIcon} {
    display: none;
  }
`
const IconWrap = styled(IconFont)`
  font-size: 14px;
  color: var(--neutral-n3);
  &:hover {
    color: var(--auxiliary-b1);
  }
`

const HasIconMenu = styled.div<{ isCheck?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '.icon': {
      fontSize: 16,
    },
    '.checked': {
      fontSize: 16,
      color: 'var(--auxiliary-b1)',
    },
    '.left': {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
    },
    '&: hover': {
      '.label': {
        // color: 'var(--neutral-n3)',
      },
      '.icon': {
        // color: 'var(--neutral-n3)',
      },
    },
  },
  ({ isCheck }) => ({
    '.label': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n3)',
    },
    '.icon': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n3)',
    },
  }),
)

const SelectOptions: React.FC<SelectBoxProps> = props => {
  const [isVisibleFormat, setIsVisibleFormat] = useState(true)

  // 切换显示类型
  const onClickMenuFormat = (key: string) => {
    // getMessage({ msg: t('version2.reviewModeChangeSuccess'), type: 'success' })
    props.onChange(key)
    setIsVisibleFormat(false)
  }

  const [value, key] = useMemo(() => {
    const current = props.options.find(item => item.check)
    return [current?.value, current?.key]
  }, [props.options])

  const renderOption = (item: Model.SprintKanBan.Option) => {
    return {
      key: item.key,
      label: (
        <HasIconMenu
          onClick={() => onClickMenuFormat(item.key)}
          isCheck={item.key === key}
        >
          <Options>
            <span className="label">{item.value}</span>
            {item.check && <IconFont className="checked" type="check" />}
          </Options>
        </HasIconMenu>
      ),
    }
  }
  const renderOptionWidthOperation = (item: Model.SprintKanBan.Option) => {
    return {
      key: item.key,
      label: (
        <HasIconMenu
          onClick={() => onClickMenuFormat(item.key)}
          isCheck={item.key === key}
        >
          <Options>
            <LabelArea>
              <span className="label">{item.value}</span>
              <DefaultTag visible={item.isDefault ?? false}>默认</DefaultTag>
            </LabelArea>
            <OperationArea>
              <CheckIcon visible={item.check}>
                <IconFont className="checked" type="check" />
              </CheckIcon>
              <BtnsArea>
                <IconWrap type="edit" />
                <IconWrap type="delete" />
              </BtnsArea>
            </OperationArea>
          </Options>
        </HasIconMenu>
      ),
    }
  }

  const menuItems = useMemo(() => {
    // 如果是视图
    if (props.operation) {
      const arr = props.options.filter(item => !item.isDefault)
      const arrWithDefault = props.options.filter(item => item.isDefault)
      const dividerItem = { key: '', label: '', type: 'divider' }
      const arrWithDefaultItems = arrWithDefault?.map(
        renderOptionWidthOperation,
      )
      const arrItems = arr?.map(renderOptionWidthOperation)
      return [...arrWithDefaultItems, dividerItem, ...arrItems]
    }
    return props.options.map(renderOption)
  }, [props.options, key, props.operation])

  const title = useMemo(() => {
    return `${props.title}：${value}`
  }, [props.title, value])

  return (
    <DropDownMenu
      isVisible={isVisibleFormat}
      onChangeVisible={setIsVisibleFormat}
      menu={<Menu items={menuItems} />}
      isActive
    >
      <SelectOptionsBox>
        <span>{title}</span>
        <IconFont
          style={{ fontSize: 16, marginLeft: 8 }}
          type={isVisibleFormat ? 'up' : 'down'}
        />
      </SelectOptionsBox>
    </DropDownMenu>
  )
}

export default SelectOptions
