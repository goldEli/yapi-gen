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

interface SelectBoxProps {
  title: string
  onChange(key: string): void
  options: Model.KanBan.ViewItem[]
  operation?: Model.KanBan.ViewItem['operation']
  onCreateView?: () => void
  createViewTitle?: string
  onDel?: (key: string) => void
  onEdit?: (key: string) => void
  onDefault?: (key: string) => void
}

const SelectOptions: React.FC<SelectBoxProps> = props => {
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

  const renderOption = (item: Model.KanBan.ViewItem) => {
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
  const renderOptionWidthOperation = (item: Model.KanBan.ViewItem) => {
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
                <IconWrap
                  visible={!!props.onDefault}
                  onClick={e => {
                    e.stopPropagation()
                    setIsVisibleFormat(false)
                    props?.onDefault?.(item.key)
                  }}
                  type="tag-96pg0hf3"
                />
                <IconWrap
                  visible={!!props.onEdit}
                  onClick={e => {
                    e.stopPropagation()
                    setIsVisibleFormat(false)
                    props?.onEdit?.(item.key)
                  }}
                  type="edit"
                />
                <IconWrap
                  visible={!!props.onDel}
                  onClick={e => {
                    e.stopPropagation()
                    setIsVisibleFormat(false)
                    props?.onDel?.(item.key)
                  }}
                  type="delete"
                />
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
      return [
        ...arrWithDefaultItems,
        dividerItem,
        ...arrItems,
        dividerItem,
        {
          key: 'create-view',
          label: (
            <HasIconMenu onClick={() => {}} isCheck={false}>
              <Options
                onClick={e => {
                  e.stopPropagation()
                  props?.onCreateView?.()
                }}
              >
                <span className="label">
                  {props.createViewTitle ? props.createViewTitle : '创建视图'}
                </span>
              </Options>
            </HasIconMenu>
          ),
        },
      ]
    }
    return props.options.map(renderOption)
  }, [props.options, key, props.operation, props.createViewTitle])

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
