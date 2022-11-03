/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
// 需求列表快捷编辑组件

import { useEffect, useRef, useState } from 'react'
import { CanOperation, IconFontWrapEdit } from '@/components/StyleCommon'
import { getParamsData, getTypeComponent } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'

interface Props {
  children: any
  // 修改的key
  keyText: any
  // 当前修改的类型
  type: string
  // 1：下拉数据传入下拉数据，时间及数值类型传入例：['date'|'number']
  value?: any
  // 默认回填的值
  defaultText?: any
  isCustom?: boolean
  remarks?: any
  // 是否是详情快捷编辑
  isInfo?: any
  // 当前需求数据
  item?: any
  onUpdate?(): void
}

const TableQuickEdit = (props: Props) => {
  const [isShowControl, setIsShowControl] = useState(false)
  const inputRef = useRef<any>(null)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo } = useModel('project')
  const { updateTableParams, getDemandInfo } = useModel('demand')
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  useEffect(() => {
    if (isShowControl) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isShowControl])

  // 操作框改变
  const onChange = async (newValue: any, type: any) => {
    const obj: any = {
      projectId,
      id: props.item?.id,
    }
    if (props?.isCustom) {
      obj.otherParams = {
        custom_field: { [props?.keyText]: newValue },
      }
    } else {
      obj.otherParams = { [props?.keyText]: newValue || '' }
    }
    try {
      await updateTableParams(obj)
      if (props.isInfo) {
        getDemandInfo({ projectId, id: props.item?.id })
      } else {
        props.onUpdate?.()
      }
      if (type === 1) {
        setIsShowControl(false)
      }
    } catch (error) {
      //
    }
  }

  // 操作框失焦
  const onBlur = (val: any) => {
    if (val === props?.defaultText) {
      setIsShowControl(false)
    } else {
      let resultVal: any
      if (
        ['select_checkbox', 'checkbox', 'fixed_select'].includes(props?.type) &&
        !val
      ) {
        resultVal = []
      } else {
        resultVal = val || ''
      }
      onChange(resultVal, 1)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {isShowControl ? (
        getTypeComponent(
          {
            attr: props.type,
            value: props.value,
            remarks: props?.remarks,
          },
          true,
          props?.defaultText,
          inputRef,
          onBlur,
          onChange,
        )
      ) : (
        <CanOperation
          onClick={() =>
            // 详情和列表上不是文本的可点击整个元素
            props.isInfo || props.type !== 'text'
              ? setIsShowControl(true)
              : void 0
          }
          isTable={!props.isInfo}
          isCanEdit={isCanEdit}
        >
          {props.children}
          {isCanEdit ? (
            <IconFontWrapEdit
              onClick={() => setIsShowControl(true)}
              isTable={!props.isInfo && props.type === 'text'}
              type={
                props?.isInfo || props.type !== 'text'
                  ? 'down-icon'
                  : 'edit-square'
              }
            />
          ) : null}
        </CanOperation>
      )}
    </div>
  )
}

export default TableQuickEdit
