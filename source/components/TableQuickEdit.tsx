/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
// 需求列表快捷编辑组件

import { useEffect, useRef, useState } from 'react'
import { CanOperation, IconFontWrapEdit } from '@/components/StyleCommon'
import { filterTreeData, getParamsData, getTypeComponent } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import { getIterateList } from '@/services/project/iterate'
import { getProjectMember } from '@/services/project'
import { getStaffList } from '@/services/staff'
import { getTreeList } from '@/services/project/tree'
import { useModel } from '@/models'

interface Props {
  children: any
  // 修改的key
  keyText: any
  // 当前修改的类型
  type?: string
  // 1：下拉数据传入下拉数据，时间及数值类型传入例：['date'|'number']
  value?: any
  // 默认回填的值
  defaultText?: any
  isCustom?: boolean
  remarks?: any
  // 是否是详情快捷编辑 - 用于判断是否是表格
  isInfo?: any
  // 当前需求数据
  item?: any
  onUpdate?(): void
  // 是否是从我的模块或者他的模块使用
  isMineOrHis?: any
}

const TableQuickEdit = (props: Props) => {
  const [isShowControl, setIsShowControl] = useState(false)
  const inputRef = useRef<any>(null)
  const [searchParams] = useSearchParams()
  const { projectInfo, getFieldList } = useModel('project')
  const { updateTableParams, getDemandInfo } = useModel('demand')
  const [params, setParams] = useState<any>({})
  let isCanEdit: any
  let projectId: any
  let canClick: any
  const isCan =
    props.isInfo ||
    !['text', 'textarea', 'number', 'integer'].includes(String(props.type))

  if (props.isMineOrHis) {
    isCanEdit = props?.item?.project?.isEdit
    projectId = props?.item?.project_id
    canClick = isCan && isCanEdit
  } else {
    isCanEdit =
      projectInfo.projectPermissions?.length > 0 &&
      projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
        ?.length > 0
    const paramsData = getParamsData(searchParams)
    projectId = paramsData.id
    canClick = isCan && isCanEdit
  }

  // 我的模块及他的模块并且是自定义字段
  const getIsCustomValues = async () => {
    const response = await getFieldList({ projectId, key: props.keyText })
    const currentObj = response.list?.filter(
      (i: any) => i.content === props.keyText,
    )[0]
    const resultValue = {
      value: currentObj?.type.value,
      remarks: currentObj?.remarks,
      attr: currentObj?.type.attr,
    }
    setParams(resultValue)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // 我的模块自定义模块并且是缺失下拉数据的： 迭代、处理人、抄送人、需求分类
  const getDefectSelectValues = async () => {
    let resultValue = {
      attr: props?.type,
      value: [],
    }
    if (props.keyText === 'iterate_id') {
      // 获取迭代下拉数据
      const response = await getIterateList({ projectId })
      resultValue.value = response?.list
        ?.filter((k: any) => k.status === 1)
        ?.map((i: any) => ({
          label: i.name,
          value: i.id,
        }))
    } else if (props.keyText === 'users') {
      // 获取处理人的下拉数据
      const response = await getProjectMember({ all: true, projectId })
      resultValue.value = response?.map((i: any) => ({
        label: i.name,
        value: i.id,
      }))
    } else if (props.keyText === 'copysend') {
      // 获取抄送人的下拉数据
      const response = await getStaffList({ all: 1 })
      resultValue.value = response
    } else if (props.keyText === 'class_id') {
      // 获取需求分类的下拉数据
      const response = await getTreeList({ id: projectId })
      resultValue.value = filterTreeData(response)[0].children
    }

    setParams(resultValue)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // 设置默认参数 - 主要用于需要接口获取参数的
  const setNormalParams = async () => {
    let resultValue: any
    if (props?.isMineOrHis && props?.isCustom) {
      // 我的模块及他的模块并且是自定义字段
      getIsCustomValues()
    } else if (
      props?.isMineOrHis &&
      ['fixed_radio', 'treeSelect', 'fixed_select'].includes(
        String(props?.type),
      )
    ) {
      // 我的模块自定义模块并且是缺失下拉数据的： 迭代、处理人、抄送人、需求分类
      getDefectSelectValues()
    } else {
      // 项目及详情中自带相应参数或者是之前的固定参数
      resultValue = {
        value: props.value,
        remarks: props.remarks,
        attr: props.type,
      }
      setParams(resultValue)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  useEffect(() => {
    if (isShowControl) {
      setNormalParams()
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
        ['select_checkbox', 'checkbox', 'fixed_select'].includes(
          String(props?.type),
        ) &&
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
          params,
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
            canClick ? setIsShowControl(true) : void 0
          }
          isTable={!props.isInfo}
          isCanEdit={isCanEdit}
        >
          {props.children}
          {isCanEdit ? (
            <IconFontWrapEdit
              onClick={() => setIsShowControl(true)}
              isTable={
                !props.isInfo &&
                ['text', 'textarea', 'number', 'integer'].includes(
                  String(props.type),
                )
              }
              type={
                props?.isInfo ||
                !['text', 'textarea', 'number', 'integer'].includes(
                  String(props.type),
                )
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
