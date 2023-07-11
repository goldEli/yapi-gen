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
import { CustomWrap } from '../SelectOptionsNormal/styled'

export interface Options {
  id: number
  name: string
  check: boolean
  isDefault?: boolean
  operation?: boolean
}
interface SelectBoxProps {
  title: string
  onChange(key: number): void
  options: Options[]
  operation?: Options['operation']
  onCreateView?(): void
  createViewTitle?: string
  onDel?(key: number): void
  onEdit?(key: number): void
  onDefault?(key: number): void
}

const SelectOptions: React.FC<SelectBoxProps> = props => {
  const [isVisibleFormat, setIsVisibleFormat] = useState(false)

  // 切换显示类型
  const onClickMenuFormat = (key: number) => {
    // getMessage({ msg: t('version2.reviewModeChangeSuccess'), type: 'success' })
    props.onChange(key)
    setIsVisibleFormat(false)
  }

  const [value, key] = useMemo(() => {
    const current = props.options.find(item => item.check)
    return [current?.name, current?.id]
  }, [props.options])

  const renderOption = (item: Options) => {
    return {
      key: item.id,
      label: (
        <HasIconMenu
          onClick={() => onClickMenuFormat(item.id)}
          isCheck={item.id === key}
        >
          <Options>
            <LabelArea>
              <span className="label">{item.name}</span>
              <DefaultTag visible={item.isDefault ?? false}>默认</DefaultTag>
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
  const renderOptionWidthOperation = (item: Options) => {
    return {
      key: item.id,
      label: (
        <HasIconMenu
          onClick={() => onClickMenuFormat(item.id)}
          isCheck={item.id === key}
        >
          <Options>
            <LabelArea>
              <span className="label">{item.name}</span>
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
                    props?.onDefault?.(item.id)
                  }}
                  type="tag-96pg0hf3"
                />
                <IconWrap
                  visible={!!props.onEdit}
                  onClick={e => {
                    e.stopPropagation()
                    setIsVisibleFormat(false)
                    props?.onEdit?.(item.id)
                  }}
                  type="edit"
                />
                <IconWrap
                  visible={!!props.onDel}
                  onClick={e => {
                    e.stopPropagation()
                    setIsVisibleFormat(false)
                    props?.onDel?.(item.id)
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
      const dividerItem = { key: 0, label: '', type: 'divider' }
      const arrWithDefaultItems = arrWithDefault?.map(renderOption)
      if (arrWithDefaultItems.length) {
        arrWithDefaultItems.push(dividerItem as any)
      }
      const arrItems = arr?.map(renderOptionWidthOperation)
      if (arrItems.length) {
        arrItems.push(dividerItem as any)
      }
      return [
        ...arrWithDefaultItems,
        ...arrItems,
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
    return `${props.title}：${value ? value : ''}`
  }, [props.title, value])

  return (
    <CustomWrap>
      <DropDownMenu
        isVisible={isVisibleFormat}
        onChangeVisible={setIsVisibleFormat}
        menu={<Menu items={menuItems} />}
        isActive
        notIcon
      >
        <SelectOptionsBox>
          <span>{title}</span>
          <IconFont
            style={{ fontSize: 16, marginLeft: 8 }}
            type={isVisibleFormat ? 'up' : 'down'}
          />
        </SelectOptionsBox>
      </DropDownMenu>
    </CustomWrap>
  )
}

export default SelectOptions
