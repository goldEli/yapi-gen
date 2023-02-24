// 需求列表快捷编辑组件

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useEffect, useRef, useState } from 'react'
import { CanOperation, IconFontWrapEdit } from '@/components/StyleCommon'
import { getNestedChildren, getParamsData, getTypeComponent } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import {
  getProjectMember,
  getTagList,
  storyConfigField,
} from '@/services/project'
import { getStaffList } from '@/services/staff'
import { message, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useDispatch, useSelector } from '@store/index'
import { setDemandInfo } from '@store/demand'
import styled from '@emotion/styled'
import { getIterateList } from '@/services/iterate'
import {
  getDemandInfo,
  getTreeList,
  updateTableParams,
} from '@/services/demand'

const LimitText = styled.div`
  width: 192px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

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

  // 他的/我的子需求列表使用 --- 用于判断是否有编辑权限
  projectPermissions?: any

  // 自定义人员的下拉
  defaultTextValues?: any

  // 用于判断当前是否是所有项目， 是则调用就接口获取下拉值
  projectId?: any

  // 是否需求标题 -- 是则不加tooltip并取消padding
  isDemandName?: boolean
}

const TableQuickEdit = (props: Props) => {
  const [t] = useTranslation()
  const [isShowControl, setIsShowControl] = useState(false)
  const inputRef = useRef<any>(null)
  const [searchParams] = useSearchParams()
  const [selectTagList, setSelectTagList] = useState<any>([])
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const [params, setParams] = useState<any>({})
  let isCanEdit: any
  let projectId: any
  let canClick: any
  const dispatch = useDispatch()
  const isCan =
    props.isInfo ||
    !['text', 'textarea', 'number', 'integer'].includes(String(props.type))

  const isShowIcon =
    !props.isInfo &&
    ['text', 'textarea', 'number', 'integer'].includes(String(props.type))

  if (props.isMineOrHis) {
    isCanEdit =
      props?.item?.project?.isEdit ||
      props?.projectPermissions?.filter(
        (i: any) => i.identity === 'b/story/update',
      )
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

  // 我的模块及他的模块并且是自定义字段 --- 接口获取
  const getIsCustomValues = async () => {
    const response = await storyConfigField({ projectId, key: props.keyText })
    const currentObj = response.list?.filter(
      (i: any) => i.content === props.keyText,
    )[0]
    const resultValue = {
      value: ['user_select_checkbox', 'user_select'].includes(
        currentObj?.type.attr,
      )
        ? currentObj?.type.data?.map((i: any) => ({
            label: i.name,
            value: i.id,
          }))
        : currentObj?.type.value,
      remarks: currentObj?.remarks,
      attr: currentObj?.type.attr,
    }
    setParams(resultValue)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // 我的模块及他的模块并且是自定义字段 --- 项目信息获取
  const getCustomValuesInfo = () => {
    const response = projectInfoValues
      ?.filter((i: any) => i.key === props.keyText)[0]
      ?.children?.filter((i: any) => i.id !== -1)
    const resultValue = {
      value: ['user_select_checkbox', 'user_select'].includes(
        String(props.type),
      )
        ? response?.map((i: any) => ({
            label: i.content,
            value: i.id,
          }))
        : response?.map((i: any) => i.content),
      remarks: '',
      attr: props.type,
    }
    setParams(resultValue)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  //  迭代、处理人、抄送人、需求分类、标签--- 接口获取
  const getDefaultSelectValues = async () => {
    let resultValue: any = {
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
      const response = await getTreeList({ id: projectId, isTree: 1 })
      resultValue.value = [
        ...[
          {
            title: t('newlyAdd.unclassified'),
            key: 0,
            value: 0,
            children: [],
          },
        ],
        ...getNestedChildren(response, 0),
      ]
    } else if (props.keyText === 'tag') {
      // 获取标签下拉数据
      const response: any = await getTagList({ projectId })
      setSelectTagList(response)
      resultValue.value = response?.map((i: any) => ({
        label: i.content,
        value: i.content,
      }))
    }

    setParams(resultValue)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  //  迭代、处理人、抄送人、需求分类、标签--- 项目信息获取
  const getDefaultSelectValuesInfo = () => {
    let resultValue: any = {
      attr: props?.type,
      value: [],
    }
    if (props.keyText === 'iterate_id') {
      // 获取迭代下拉数据
      const response = projectInfoValues
        ?.filter((i: any) => i.key === 'iterate_name')[0]
        ?.children?.filter((i: any) => i.id !== -1)

      resultValue.value = response
        ?.filter((k: any) => k.status === 1)
        ?.map((i: any) => ({
          label: i.content,
          value: i.id,
        }))
    } else if (props.keyText === 'users') {
      // 获取处理人的下拉数据
      const response = projectInfoValues
        ?.filter((i: any) => i.key === 'users_name')[0]
        ?.children?.filter((i: any) => i.id !== -1)

      resultValue.value = response?.map((i: any) => ({
        label: i.content,
        value: i.id,
      }))
    } else if (props.keyText === 'copysend') {
      // 获取抄送人的下拉数据
      const response = projectInfoValues
        ?.filter((i: any) => i.key === 'users_copysend_name')[0]
        ?.children?.filter((i: any) => i.id !== -1)
      resultValue.value = response?.map((i: any) => ({
        label: i.content,
        value: i.id,
      }))
    } else if (props.keyText === 'class_id') {
      // 获取需求分类的下拉数据
      const response = projectInfoValues?.filter(
        (i: any) => i.key === 'class',
      )[0].children
      resultValue.value = response
    } else if (props.keyText === 'tag') {
      // 获取标签下拉数据
      const response: any = projectInfoValues
        ?.filter((i: any) => i.key === 'tag')[0]
        ?.children?.filter((i: any) => i.id !== -1)
      setSelectTagList(response)
      resultValue.value = response?.map((i: any) => ({
        label: i.content,
        value: i.content,
      }))
    }

    setParams(resultValue)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // 设置默认参数 - 主要用于需要接口获取参数的
  const setNormalParams = async () => {
    if (props?.isCustom) {
      // 我的模块及他的模块并且是自定义字段
      if (props.projectId === 0) {
        getIsCustomValues()
      } else {
        getCustomValuesInfo()
      }
    } else {
      // 项目及详情中自带相应参数或者是之前的固定参数
      if (props.projectId === 0) {
        getDefaultSelectValues()
      } else {
        getDefaultSelectValuesInfo()
      }
    }
  }

  useEffect(() => {
    if (isShowControl) {
      setNormalParams()
    }
  }, [isShowControl])

  // 操作框改变
  const onChange = async (newValue: any, type: any) => {
    if (props.keyText === 'name' && newValue.length <= 0) {
      message.warning(t('p2.nameNotNull'))
      setIsShowControl(false)
      return
    }

    // 判断如果修改的是预计开始时间，则判断结束时间不能小于开始时间
    if (props?.keyText === 'expected_start_at') {
      if (
        props.item.expectedEnd &&
        moment(props.item.expectedEnd || '').unix() <
          moment(newValue || '').unix()
      ) {
        message.warning(t('version2.endTimeComputedStartTime'))
        setIsShowControl(false)
        return
      }
    }

    // 判断如果修改的是预计结束时间，则判断开始时间不能大于结束时间
    if (props?.keyText === 'expected_end_at') {
      if (
        props.item.expectedStart &&
        moment(props.item.expectedStart || '').unix() >
          moment(newValue || '').unix()
      ) {
        message.warning(t('version2.startTimeComputedEndTime'))
        setIsShowControl(false)
        return
      }
    }
    const obj: any = {
      projectId,
      id: props.item?.id,
    }
    if (props?.isCustom) {
      obj.otherParams = {
        custom_field: {
          [props?.keyText]: newValue || '',
        },
      }
    } else if (props.keyText === 'tag') {
      obj.otherParams = {
        [props?.keyText]:
          selectTagList
            ?.filter((i: any) => newValue.some((k: any) => k === i.content))
            ?.map((i: any) => ({
              name: i.content,
              color: i.color,
            })) || [],
      }
    } else {
      obj.otherParams = {
        [props?.keyText]: newValue || newValue === 0 ? newValue : '',
      }
    }

    try {
      await updateTableParams(obj)
      if (props.isInfo) {
        const result = await getDemandInfo({ projectId, id: props.item?.id })
        dispatch(setDemandInfo(result))
      } else {
        props.onUpdate?.()
      }
      message.success(t('common.editSuccess'))
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
        [
          'select_checkbox',
          'checkbox',
          'fixed_select',
          'user_select_checkbox',
        ].includes(String(props?.type)) &&
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
      {isShowControl &&
        getTypeComponent(
          params,
          onChange,
          true,
          props?.defaultText,
          inputRef,
          onBlur,
        )}
      {!isShowControl && (
        <CanOperation
          onClick={() =>
            // 详情和列表上不是文本的可点击整个元素
            canClick ? setIsShowControl(true) : void 0
          }
          isTable={!props.isInfo}
          isCanEdit={isCanEdit}
        >
          {(!['text', 'textarea'].includes(props.type as any) ||
            props.isDemandName) && <div>{props.children}</div>}

          {['text', 'textarea'].includes(props.type as any) &&
            !props.isDemandName && (
              <>
                {props.isInfo && <div>{props.children}</div>}
                {!props.isInfo && (
                  <Tooltip
                    title={props.children}
                    placement="topLeft"
                    getPopupContainer={node => node}
                  >
                    <LimitText>{props.children}</LimitText>
                  </Tooltip>
                )}
              </>
            )}

          {isCanEdit && (
            <IconFontWrapEdit
              onClick={() => setIsShowControl(true)}
              isTable={isShowIcon}
              type={
                props?.isInfo ||
                !['text', 'textarea', 'number', 'integer'].includes(
                  String(props.type),
                )
                  ? 'down-icon'
                  : 'edit-square'
              }
            />
          )}
        </CanOperation>
      )}
    </div>
  )
}

export default TableQuickEdit
