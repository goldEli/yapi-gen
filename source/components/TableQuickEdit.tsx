/* eslint-disable react/jsx-no-useless-fragment */
// 需求列表快捷编辑组件
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
import { Checkbox, message, Tooltip } from 'antd'
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
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import { getMessage } from './Message'
import { updateAffairsTableParams } from '@/services/affairs'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { updateFlawTableParams } from '@/services/flaw'
import { getFlawInfo } from '@store/flaw/flaw.thunk'

const LimitText = styled.div`
  width: 192px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const DisableWrap = styled.div`
  cursor: no-drop;
`

const CheckboxWrap = styled(Checkbox)`
  .ant-checkbox-inner {
    border-radius: 50% !important;
  }
  .ant-checkbox-checked::after {
    border: none !important;
  }
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

  // 是否是详情页面
  isInfoPage?: boolean

  // 人员下拉框是否绑定在body上面
  isBindBody?: string
  isBug?: boolean
}

const TableQuickEdit = (props: Props) => {
  const info = useGetloginInfo()
  const [t] = useTranslation()
  const [isShowControl, setIsShowControl] = useState(false)
  const inputRef = useRef<HTMLInputElement>()
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
    isCanEdit = props?.item?.project?.isEdit
    projectId = props?.item?.project_id
    canClick = isCan && isCanEdit
  } else {
    isCanEdit =
      projectInfo.projectPermissions?.length > 0 &&
      projectInfo.projectPermissions?.filter(
        (i: any) =>
          i.identity ===
          (projectInfo.projectType === 1
            ? props.isBug
              ? 'b/flaw/update'
              : 'b/story/update'
            : 'b/transaction/update'),
      )?.length > 0
    const paramsData = getParamsData(searchParams)
    if (props.keyText === 'tag') {
      console.log(
        isCan,
        '=isCanEditisCanEdit',
        isCanEdit,
        props.keyText,
        ' isCan && isCanEdit',
        isCan && isCanEdit,
      )
    }
    projectId = paramsData?.id
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
    const response = ['user_select_checkbox', 'user_select'].includes(
      String(props.type),
    )
      ? props.item.fieldContentValue[0] === 'companyMember'
        ? projectInfoValues
            ?.filter((i: any) => i.key === 'users_copysend_name')[0]
            ?.children?.filter((i: any) => i.id !== -1)
        : projectInfoValues
            ?.filter((i: any) => i.key === 'users_name')[0]
            ?.children?.filter((i: any) => i.id !== -1)
      : null

    const resultValue = {
      value: ['user_select_checkbox', 'user_select'].includes(
        String(props.type),
      )
        ? response?.map((i: any) => ({
            label: i.content,
            value: i.id,
          }))
        : props.item?.fieldContentValue,
      remarks: '',
      attr: props.type,
    }
    setParams(resultValue)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  //  迭代、处理人、抄送人、需求分类、标签、发现版本--- 接口获取
  const getDefaultSelectValues = async () => {
    const resultValue: any = {
      attr: props?.type,
      value: [],
    }
    if (
      props.keyText === 'iterate_id' ||
      props.keyText === 'discovery_version'
    ) {
      // 获取迭代下拉数据
      const response = await getIterateList({ projectId })
      resultValue.value = response?.list
        ?.filter((k: any) => k.status === 1 || k.status === 4)
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
    const resultValue: any = {
      attr: props?.type,
      value: [],
    }
    if (
      props.keyText === 'iterate_id' ||
      props.keyText === 'discovery_version'
    ) {
      // 获取迭代下拉数据
      const response = projectInfoValues
        ?.filter((i: any) => i.key === 'iterate_name')[0]
        ?.children?.filter((i: any) => i.id !== -1)

      resultValue.value = response
        ?.filter((k: any) => k.status === 1 || k.status === 4)
        ?.map((i: any) => ({
          label: i.content,
          value: i.id,
        }))
    } else if (props.keyText === 'users') {
      // 获取处理人的下拉数据
      const response = projectInfoValues
        ?.filter((i: any) => i.key === 'users_name')[0]
        ?.children?.filter((i: any) => i.id !== -1)

      const arr1 = response
        ?.map((i: any) => ({
          label: i.id === info ? `${i.content}（${t('myself')}）` : i.content,
          value: i.id,
        }))
        .filter((i: any) => i.value === info)
      const arr12 = response
        ?.map((i: any) => ({
          label: i.id === info ? `${i.content}（${t('myself')}）` : i.content,
          value: i.id,
        }))
        .filter((i: any) => i.value !== info)
      resultValue.value = arr1.concat(arr12)
    } else if (props.keyText === 'copysend') {
      // 获取抄送人的下拉数据
      const response = projectInfoValues
        ?.filter((i: any) => i.key === 'users_copysend_name')[0]
        ?.children?.filter((i: any) => i.id !== -1)
      const arr1 = response
        ?.map((i: any) => ({
          label: i.id === info ? `${i.content}（${t('myself')}）` : i.content,
          value: i.id,
        }))
        .filter((i: any) => i.value === info)
      const arr12 = response
        ?.map((i: any) => ({
          label: i.id === info ? `${i.content}（${t('myself')}）` : i.content,
          value: i.id,
        }))
        .filter((i: any) => i.value !== info)
      resultValue.value = arr1.concat(arr12)
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

    setParams({ ...resultValue, isBindBody: props.isBindBody })
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
  const onChange = async (newValue: any, type?: any) => {
    if (props.item.categoryConfigList[props.keyText] === 1 && !newValue) {
      getMessage({ msg: `${props.keyText}为必填字段！`, type: 'warning' })
      setIsShowControl(false)
      return
    }

    if (props.keyText === 'name' && newValue.length <= 0) {
      getMessage({ msg: t('p2.nameNotNull'), type: 'warning' })
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
        getMessage({
          msg: t('version2.endTimeComputedStartTime'),
          type: 'warning',
        })
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
        getMessage({
          msg: t('version2.startTimeComputedEndTime'),
          type: 'warning',
        })
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

    if (projectInfo.projectType === 1) {
      // 缺陷
      if (props.item.is_bug === 1) {
        await updateFlawTableParams(obj)
        if (props.isInfoPage) {
          dispatch(getFlawInfo({ projectId, id: props.item?.id }))
        } else {
          props.onUpdate?.()
        }
      } else {
        // 需求
        await updateTableParams(obj)
        if (props.isInfoPage) {
          const result = await getDemandInfo({ projectId, id: props.item?.id })
          dispatch(setDemandInfo(result))
        } else {
          props.onUpdate?.()
        }
      }
    } else {
      // 事务
      await updateAffairsTableParams(obj)
      if (props.isInfoPage) {
        dispatch(getAffairsInfo({ projectId, sprintId: props.item?.id }))
      } else {
        props.onUpdate?.()
      }
    }
    getMessage({ msg: t('common.editSuccess'), type: 'success' })
    if (type === 1) {
      setIsShowControl(false)
    }
  }

  // 操作框失焦
  const onBlur = (val: any) => {
    if (props.item.categoryConfigList[props.keyText] === 1 && !val) {
      getMessage({
        msg: `${props.keyText}${t('is_required')}`,
        type: 'warning',
      })
      setIsShowControl(false)
      return
    }

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

      {/* 如果是详情或者是表格上可编辑字段 */}
      {(Object.keys(props.item.categoryConfigList).includes(props.keyText) ||
        props.isInfo ||
        props.keyText === 'name' ||
        props.keyText === 'tag') && (
        <>
          {!isShowControl && (
            <>
              {/* 快捷修改确认勾选框显示 */}
              {props.type === 'single_checkbox' && (
                <CheckboxWrap
                  checked={props?.defaultText}
                  onChange={e => onChange(e.target.checked ? 1 : 0)}
                />
              )}
              {props.type !== 'single_checkbox' && (
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
                      style={{ color: 'var(--neutral-n4)' }}
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
            </>
          )}
        </>
      )}

      {/* 不能操作的并且不是详情快捷操作，只展示 */}
      {!Object.keys(props.item.categoryConfigList).includes(props.keyText) &&
        !props.isInfo &&
        props.keyText !== 'name' &&
        props.keyText !== 'tag' && (
          <DisableWrap>
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
          </DisableWrap>
        )}
    </div>
  )
}

export default TableQuickEdit
