/**
 * 1. 视图管理下拉
 * 2. 普通下拉（下拉内容展示与打钩）
 */
import React, { useMemo, useState } from 'react'
import { Menu } from 'antd'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'
import {
  BtnsArea,
  CheckIcon,
  DefaultTag,
  HasIconMenu,
  IconWrap,
  LabelArea,
  OperationArea,
  Options,
  SelectOptionsBox,
} from './styled'

export interface Options {
  key: string
  value: string
  check: boolean
}

interface SelectBoxProps {
  title: string
  onChange(key: string): void
  options: Options[]
}

const SelectOptionsNormal: React.FC<SelectBoxProps> = props => {
  const [isVisibleFormat, setIsVisibleFormat] = useState(false)

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

  const renderOption = (item: Options) => {
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
            </LabelArea>
            <OperationArea>
              <CheckIcon visible={item.check}>
                <IconFont className="checked" type="check" />
              </CheckIcon>
            </OperationArea>
          </Options>
        </HasIconMenu>
      ),
    }
  }

  const menuItems = useMemo(() => {
    return props.options.map(renderOption)
  }, [props.options, key])

  const title = useMemo(() => {
    return `${props.title}：${value ? value : ''}`
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

export default SelectOptionsNormal
