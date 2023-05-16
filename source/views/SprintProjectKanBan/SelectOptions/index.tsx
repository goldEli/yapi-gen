import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Menu } from 'antd'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'
import { HasIconMenu } from '@/components/StyleCommon'

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
const Options = styled.div`
  height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

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

  const menuItems = useMemo(() => {
    // 如果是视图
    if (props.operation) {
      const arr = props.options.filter(item => !item.isDefault)
      const arrWithDefault = props.options.filter(item => item.isDefault)
      const dividerItem = { key: '', label: '', type: 'divider' }
      const arrWithDefaultItems = arrWithDefault?.map(renderOption)
      const arrItems = arr?.map(renderOption)
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
