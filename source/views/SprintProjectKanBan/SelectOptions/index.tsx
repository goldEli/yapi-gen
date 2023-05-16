import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Menu } from 'antd'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'
import { HasIconMenu } from '@/components/StyleCommon'

interface SelectBoxProps {
  title: string
  onChange(ley: string): void
  options: { key: string; value: string; check: boolean }[]
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

const SelectOptions: React.FC<SelectBoxProps> = props => {
  const [isVisibleFormat, setIsVisibleFormat] = useState(false)

  // 切换显示类型
  const onClickMenuFormat = (key: string) => {
    // getMessage({ msg: t('version2.reviewModeChangeSuccess'), type: 'success' })
    // props.onChangeFormat(type)
    props.onChange(key)
    setIsVisibleFormat(false)
  }

  const [value, key] = useMemo(() => {
    const current = props.options.find(item => item.check)
    return [current?.value, current?.key]
  }, [props.options])

  const menuItems = useMemo(() => {
    return props.options.map(item => {
      return {
        key: item.key,
        label: (
          <HasIconMenu
            onClick={() => onClickMenuFormat(item.key)}
            isCheck={item.key === key}
          >
            <span className="label">{item.value}</span>
            {item.check && <IconFont className="checked" type="check" />}
          </HasIconMenu>
        ),
      }
    })
  }, [props.options, key])

  const title = useMemo(() => {
    return `${props.title}：${value}`
  }, [props.title, value])

  return (
    <DropDownMenu
      isVisible={isVisibleFormat}
      onChangeVisible={setIsVisibleFormat}
      menu={<Menu items={menuItems} />}
      isActive
      // icon={props.isGrid ? 'app-store' : 'unorderedlist'}
      // icon={'app-store'}
    >
      {/* <div>{1111}</div> */}
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
