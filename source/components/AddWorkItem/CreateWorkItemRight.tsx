/* eslint-disable no-undefined */
/* eslint-disable react/jsx-no-leaked-render */
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import { getTypeComponent, removeNull } from '@/tools'
import { decryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Checkbox, DatePicker, Form, Input, Select, TreeSelect } from 'antd'
import moment from 'moment'
import { useState, useEffect, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import ChangePriorityPopover from '../ChangePriorityPopover'
import CustomSelect from '../CustomSelect'
import IconFont from '../IconFont'
import StateTag from '../StateTag'
import { PriorityWrap, SeverityWrap, SliderWrap } from '../StyleCommon'
import ChangeSeverityPopover from '../ChangeSeverityPopover'

const RightWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 406,
  padding: '0px 14px 0 24px',
  borderLeft: '1px solid var(--neutral-n6-d2)',
})

const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: 'var(--primary-d1)',
})

const CheckboxWrap = styled(Checkbox)`
  .ant-checkbox-inner {
    border-radius: 50% !important;
  }
  .ant-checkbox-checked::after {
    border: none !important;
  }
`

interface Props {
  projectId: string | number
  onRef: any
  fieldsList: any[]
  detail?: any
  isSaveParams?: boolean
  workStatusList?: any
  isCreateDemand?: boolean
  newCategory?: any
  categoryType?: number
}

const CreateDemandRight = (props: Props) => {
  const info = useGetloginInfo()
  const [t] = useTranslation()
  const [form] = Form.useForm()
  // 折叠字段
  const [foldList, setFoldList] = useState<any>([])
  // 不折叠字段
  const [notFoldList, setNotFoldList] = useState<any>([])
  const [priorityDetail, setPriorityDetail] = useState<any>({})
  const [severity, setSeverity] = useState<any>(0)
  const [schedule, setSchedule] = useState(0)
  const [isShowFields, setIsShowFields] = useState(false)
  const {
    projectInfoValues,
    filterParamsModal,
    addWorkItemModal,
    addWorkItemParentList,
  } = useSelector(store => store.project)
  const { params } = addWorkItemModal
  const { userInfo } = useSelector(store => store.user)

  // 处理人相关的下拉
  const getCommonUser = (arr: any, memberArr: any) => {
    let res: any[] = []
    if (arr?.length > 0) {
      res = memberArr?.filter((i: any) => arr.some((k: any) => k.id === i.id))
    }
    return res?.length ? res.map((i: any) => i.id) : []
  }

  // 回填自定义数据 -- params：传入回填数据对象，isFilter：是否是筛选回填
  const setCustomFields = (params: any, isFilter: boolean) => {
    const resultCustom: any = {}
    const customArr = props.fieldsList?.filter((i: any) =>
      Object.keys(params).some((k: any) => k === i.content),
    )

    if (customArr?.length > 0) {
      customArr?.forEach((element: any) => {
        const customValue: any = params[element.content]
        if (
          [
            'select_checkbox',
            'select',
            'checkbox',
            'radio',
            'user_select_checkbox',
            'user_select',
          ].includes(element?.fieldContent?.attr)
        ) {
          // 判断是否是下拉框，是则去除空选项
          const values = customValue?.filter((i: any) => i !== -1)

          // 判断是否是单选，是则取第一个
          const resultValue = ['select', 'radio', 'user_select'].includes(
            element?.fieldContent?.attr,
          )
            ? values[0]
            : values
          resultCustom[element.content] = isFilter ? resultValue : customValue
        } else if (['number'].includes(element?.fieldContent?.attr)) {
          // 判断是否是数字类型，是则获取start
          resultCustom[element?.content] = isFilter
            ? Number(customValue?.start)
            : customValue
        } else if (['date'].includes(element?.fieldContent?.attr)) {
          // 判断是否是时间类型，是则获取第一个时间
          resultCustom[element?.content] = isFilter
            ? moment(customValue[0])
            : moment(customValue)
        } else if (['text', 'textarea'].includes(element?.fieldContent?.attr)) {
          resultCustom[element?.content] = customValue
        } else if (['single_checkbox'].includes(element?.fieldContent?.attr)) {
          resultCustom[element?.content] = customValue
        }
      })
    }
    form.setFieldsValue({ ...form, ...resultCustom })
  }

  // 需求详情返回后给标签及附件数组赋值
  useEffect(() => {
    if (
      params?.editId &&
      props?.detail?.id &&
      params?.editId === props?.detail?.id
    ) {
      // 需求进度
      setSchedule(props?.detail?.schedule)

      // 获取自定义字段回显值
      const form1Obj: any = {}
      for (const key in props?.detail?.customField) {
        form1Obj[key] =
          props?.detail?.customField[key]?.attr === 'date'
            ? props?.detail?.customField[key]?.value
              ? moment(props?.detail?.customField[key]?.value)
              : ''
            : props?.detail?.customField[key]?.value
      }
      form.setFieldsValue({ ...form, ...form1Obj })

      // 回显优先级
      setPriorityDetail(props?.detail.priority)
      // 回显严重程度
      setSeverity(props?.detail.severity?.id)

      // 开始时间
      if (props?.detail?.expectedStart) {
        form.setFieldsValue({
          expected_start_at: moment(props?.detail.expectedStart || 0),
        })
      }

      // 结束时间
      if (props?.detail?.expectedEnd) {
        form.setFieldsValue({
          expected_end_at: moment(props?.detail.expectedEnd || 0),
        })
      }

      let hasIterateId: any
      let hasChild: any

      // 如果是迭代创建或编辑，默认填入迭代
      if (params?.iterateId) {
        hasIterateId = removeNull(projectInfoValues, 'iterate_name')
          ?.filter((k: any) => k.status === 1)
          .filter((i: any) => i.id === params?.iterateId).length
          ? params?.iterateId
          : null
      }

      // 如果是子需求创建或编辑，默认父需求填入当前需求id
      if (params.isChild) {
        hasChild = addWorkItemParentList?.filter(
          (i: any) => i.value === Number(params?.parentId),
        )[0]?.value
      }

      form.setFieldsValue({
        status: props.newCategory?.statusId ?? props.detail?.status.status_id,

        // 抄送人
        users_copysend_name: getCommonUser(
          props?.detail?.copySend?.map((i: any) => i.copysend),
          removeNull(projectInfoValues, 'users_copysend_name'),
        ),

        // 附件
        attachments: props?.detail?.attachment?.map(
          (i: any) => i.attachment.path,
        ),

        // 处理人
        users_name: getCommonUser(
          props?.detail?.user?.map((i: any) => i.user),
          removeNull(projectInfoValues, 'user_name'),
        ),

        // 迭代
        iterate_name: params.iterateId
          ? hasIterateId
          : removeNull(projectInfoValues, 'iterate_name')
              ?.filter((k: any) => k.status === 1 || k.status === 4)
              ?.filter((i: any) => i.id === props?.detail?.iterateId).length
          ? props?.detail?.iterateId
          : undefined,

        // 发现版本
        discovery_version: removeNull(projectInfoValues, 'iterate_name')
          ?.filter((k: any) => k.status === 1 || k.status === 4)
          ?.filter((i: any) => i.id === props?.detail?.discovery_version).length
          ? props?.detail?.discovery_version
          : undefined,

        // 父需求
        parent_id: params.isChild
          ? hasChild
          : addWorkItemParentList?.filter(
              (i: any) => i.value === props?.detail?.parentId,
            ).length
          ? props?.detail?.parentId
          : null,

        // 需求分类
        class: props?.detail.class || null,

        // 解决办法
        solution: props.detail.solution || '',
      })
    } else {
      form.setFieldsValue({
        status: props?.workStatusList?.list?.filter(
          (i: any) => i.is_start === 1,
        )?.[0]?.statusId,
      })
      // 子需求默认回填父需求
      if (params?.isChild || params?.isCreateAffairsChild) {
        form.setFieldsValue({
          parent_id: addWorkItemParentList?.filter(
            (i: any) => i.value === Number(params?.parentId),
          )[0]?.value,
        })
      }

      // 迭代创建需求默认回填迭代
      if (params?.iterateId) {
        form.setFieldsValue({
          iterate_name: removeNull(projectInfoValues, 'iterate_name')
            ?.filter((k: any) => k.status === 1 || k.status === 4)
            .filter((i: any) => i.id === params?.iterateId).length
            ? params?.iterateId
            : null,
        })
      }

      // 如果不是快速创建并且不是完成并创建下一个，则回填筛选值
      if (!props.isSaveParams && !params?.isQuickCreate) {
        // 不是在迭代创建需求并且有筛选项
        if (!params?.iterateId && filterParamsModal?.iterateIds?.length) {
          const resultId = filterParamsModal?.iterateIds?.filter(
            (i: any) => i !== -1,
          )?.[0]
          form.setFieldsValue({
            iterate_name: removeNull(projectInfoValues, 'iterate_name')
              ?.filter((k: any) => k.status === 1 || k.status === 4)
              .filter((i: any) => i.id === resultId).length
              ? resultId
              : null,
          })
        }

        // 获取需求分类回填值 未分类可能是-1或者是0
        const resultClass = filterParamsModal?.class_id
          ? filterParamsModal?.class_id === -1
            ? 0
            : filterParamsModal?.class_id
          : filterParamsModal?.class_ids?.filter((i: any) => i !== -1)?.[0]

        // 筛选值-优先级
        const priorityId = filterParamsModal?.priorityIds?.filter(
          (i: any) => i !== -1,
        )?.[0]
        const resultPriority = removeNull(
          projectInfoValues,
          'priority',
        )?.filter((i: any) => i.id === priorityId)?.[0]

        // 筛选值-严重程度
        const severityId = filterParamsModal?.severityIds?.filter(
          (i: any) => i !== -1,
        )?.[0]
        const resultSeverity = removeNull(
          projectInfoValues,
          'severity',
        )?.filter((i: any) => i.id === severityId)?.[0]

        // 筛选回填处理人、抄送人、需求分类、优先级
        form.setFieldsValue({
          users_copysend_name: filterParamsModal?.copySendId?.filter(
            (i: any) => i !== -1,
          ),
          users_name: filterParamsModal?.usersNameId?.filter(
            (i: any) => i !== -1,
          ),
          class: resultClass,
          priority: resultPriority?.id,
          severity: resultSeverity?.id,
        })
        setPriorityDetail(resultPriority)
        setSeverity(resultSeverity?.id)

        // 筛选回填预计开始时间
        if (filterParamsModal?.expectedStart?.length > 0) {
          form.setFieldsValue({
            expected_start_at:
              filterParamsModal?.expectedStart[0] === '1970-01-01'
                ? ''
                : moment(filterParamsModal?.expectedStart[0]),
          })
        }

        // 筛选回填预计结束时间
        if (filterParamsModal?.expectedEnd?.length > 0) {
          form.setFieldsValue({
            expected_end_at: ['2030-01-01', '1970-01-01'].includes(
              filterParamsModal?.expectedEnd[1],
            )
              ? ''
              : moment(filterParamsModal?.expectedEnd[1]),
          })
        }

        // 筛选值回填自定义字段值
        if (
          filterParamsModal?.custom_field &&
          JSON.stringify(filterParamsModal?.custom_field) !== '{}'
        ) {
          setCustomFields(filterParamsModal?.custom_field, true)
        }
      }

      // 如果是快捷创建并且有缓存数据
      if (params?.isQuickCreate && localStorage.getItem('quickCreateData')) {
        const hisCategoryData = JSON.parse(
          decryptPhp(localStorage.getItem('quickCreateData') as any),
        )

        form.setFieldsValue({
          users_name: hisCategoryData?.userIds,
          class: hisCategoryData?.class,
          parent_id: hisCategoryData?.parentId,
          iterate_name: hisCategoryData?.iterateId,
          users_copysend_name: hisCategoryData?.copySendIds,
          priority: removeNull(projectInfoValues, 'priority')?.filter(
            (i: any) => i.id === hisCategoryData?.priority,
          )?.[0]?.id,
        })

        if (hisCategoryData?.expectedStart) {
          form.setFieldsValue({
            expected_start_at: moment(hisCategoryData.expectedStart || 0),
          })
        }

        if (hisCategoryData?.expectedEnd) {
          form.setFieldsValue({
            expected_end_at: moment(hisCategoryData.expectedEnd || 0),
          })
        }

        // 优先级
        setPriorityDetail(
          removeNull(projectInfoValues, 'priority')?.filter(
            (i: any) => i.id === hisCategoryData?.priority,
          )?.[0],
        )
        setSeverity(
          removeNull(projectInfoValues, 'severity')?.filter(
            (i: any) => i.id === hisCategoryData?.severity,
          )?.[0]?.id,
        )
        if (
          hisCategoryData?.customField &&
          JSON.stringify(hisCategoryData?.customField) !== '{}'
        ) {
          setCustomFields(hisCategoryData?.customField, false)
        }
      }
    }
  }, [
    params?.editId,
    props?.detail,
    addWorkItemParentList,
    props.fieldsList,
    props.workStatusList,
    props.newCategory,
  ])

  useEffect(() => {
    if (props.fieldsList?.length > 0) {
      setFoldList(
        props.fieldsList?.filter(
          (i: any) =>
            i.isFold === 2 &&
            i.status === 1 &&
            !['finish_at', 'created_at', 'user_name'].includes(i.content),
        ),
      )
      setNotFoldList(
        props.fieldsList?.filter(
          (i: any) =>
            i.isFold === 1 &&
            i.status === 1 &&
            !['finish_at', 'created_at', 'user_name'].includes(i.content),
        ),
      )
    } else {
      setFoldList([])
      setNotFoldList([])
    }
  }, [props.fieldsList])

  // 清空右侧参数
  const onReset = () => {
    form.resetFields()
    setPriorityDetail({})
    setSeverity(0)
    setIsShowFields(false)
  }

  // 提交右侧参数
  const onConfirm = async () => {
    await form.validateFields()

    // form.validateFields().then(() => {
    const customValues: any = {}
    const values = form.getFieldsValue()
    values.priority =
      JSON.stringify(priorityDetail) === '{}' ? null : priorityDetail
    values.severity = severity

    Object.keys(values)?.forEach((k: any) => {
      values[k] = values[k] ? values[k] : ''
      const obj = props.fieldsList?.filter((i: any) => k === i.content)[0]

      // 处理预计结束时间和预计开始时间
      if (['expected_end_at', 'expected_start_at'].includes(k)) {
        values[k] = values[k] ? moment(values[k]).format('YYYY-MM-DD') : ''
      }

      // 处理自定义字段中时间参数
      if (obj?.fieldContent?.attr === 'date' && values[k]) {
        values[obj.content] = moment(values[obj.content]).format(
          obj?.fieldContent?.value?.[0] === 'datetime'
            ? 'YYYY-MM-DD HH:mm:ss'
            : 'YYYY-MM-DD',
        )
      } else if (
        obj?.fieldContent?.attr === 'select_checkbox' ||
        obj?.fieldContent?.attr === 'checkbox' ||
        obj?.fieldContent?.attr === 'user_select_checkbox'
      ) {
        values[obj.content] = values[obj.content]?.length
          ? values[obj.content]
          : []
      }

      if (String(k).includes('custom_')) {
        customValues[k] = values[k]
      }
    })
    return { ...values, ...{ customField: customValues } }

    // })
  }

  useImperativeHandle(props.onRef, () => {
    return {
      confirm: onConfirm,
      reset: onReset,
    }
  })

  // 修改需求进度
  const onChangeSetSchedule = (val: any) => {
    setSchedule(val)
    form.setFieldsValue({
      schedule: val,
    })
  }

  const onChangeCheckBox = (e: any, key: any) => {
    form.setFieldsValue({
      [key]: e.target.checked ? 1 : 0,
    })
  }

  // 修改优先级
  const onCurrentDetail = (item: any) => {
    setPriorityDetail(item)
    form.setFieldsValue({
      priority: item,
    })
  }

  // 修改优先级
  const onChangeSeverity = (item: any) => {
    setSeverity(item.severity)
    form.setFieldsValue({
      severity: item.severity,
    })
  }

  const format = (a: any) => {
    const newA = a.filter((j: any) => {
      return j.value === info
    })

    const newB = a.filter((j: any) => {
      return j.value !== info
    })

    return newA.concat(newB)
  }
  // 返回基本字段
  const getBasicTypeComponent = (item: any) => {
    let nodeComponent
    // 下拉多选 抄送人，处理人，迭代,发现版本
    if (
      [
        'users_copysend_name',
        'iterate_name',
        'users_name',
        'discovery_version',
      ].includes(item.content)
    ) {
      nodeComponent = (
        <CustomSelect
          style={{ width: '100%' }}
          showArrow
          mode={
            ['discovery_version', 'iterate_name'].includes(item.content)
              ? (null as any)
              : 'multiple'
          }
          showSearch
          placeholder={t('common.pleaseSelect')}
          getPopupContainer={(node: any) => node}
          allowClear
          optionFilterProp="label"
          disabled={
            !props.isCreateDemand ||
            (item.content === 'iterate_name' &&
              [3, 6].includes(props.categoryType || props.detail.work_type))
          }
          options={format(
            (['discovery_version', 'iterate_name'].includes(item.content)
              ? removeNull(projectInfoValues, item.content)?.filter((k: any) =>
                  [4, 1].includes(k.status),
                )
              : removeNull(projectInfoValues, item.content)
            )?.map((i: any) => ({
              label:
                (item.content === 'users_name' ||
                  item.content === 'users_copysend_name') &&
                i.id === info
                  ? `${i.content} （${t('myself')}）`
                  : i.content,
              value: i.id,
            })),
          )}
        />
      )
    } else if (item.content === 'priority') {
      // 优先级
      nodeComponent = (
        <ChangePriorityPopover
          isCanOperation
          record={{ project_id: props?.projectId }}
          onCurrentDetail={(row: any) => onCurrentDetail(row)}
        >
          <PriorityWrap>
            <IconFont
              className="priorityIcon"
              type={priorityDetail?.icon}
              style={{
                fontSize: 20,
                color: priorityDetail?.color,
              }}
            />
            <div>
              <span>{priorityDetail?.content_txt || '--'}</span>
              <IconFont
                style={{ color: 'var(--neutral-n4)' }}
                className="icon"
                type="down-icon"
              />
            </div>
          </PriorityWrap>
        </ChangePriorityPopover>
      )
    } else if (item.content === 'severity') {
      // 优先级
      nodeComponent = (
        <ChangeSeverityPopover
          isCanOperation
          onChangeSeverity={(row: any) => onChangeSeverity(row)}
          record={{ project_id: props?.projectId }}
          projectId={props?.projectId}
        >
          <SeverityWrap
            style={{
              background: removeNull(projectInfoValues, 'severity')?.filter(
                (i: any) => i.id === severity,
              )?.[0]?.color,
              width: 'max-content',
              cursor: 'pointer',
            }}
          >
            {removeNull(projectInfoValues, 'severity')?.filter(
              (i: any) => i.id === severity,
            )?.[0]?.content || '--'}
          </SeverityWrap>
        </ChangeSeverityPopover>
      )
    } else if (item.content === 'class') {
      // 需求分类
      nodeComponent = (
        <TreeSelect
          style={{ width: '100%' }}
          showArrow
          showSearch
          placeholder={t('newlyAdd.pleaseClass')}
          getPopupContainer={node => node}
          disabled={!props.isCreateDemand}
          allowClear
          treeData={
            projectInfoValues?.filter((i: any) => i.key === 'class')[0]
              ?.children
          }
        />
      )
    } else if (item.content === 'parent_id') {
      // 父需求
      nodeComponent = (
        <CustomSelect
          disabled={!props.isCreateDemand || params?.isCreateAffairsChild}
          style={{ width: '100%' }}
          showArrow
          showSearch
          placeholder={t('common.pleaseParentDemand')}
          options={
            params?.editId
              ? addWorkItemParentList?.filter(
                  (k: any) =>
                    k.value !== params?.editId &&
                    k.parentId !== params?.editId &&
                    k.parentId !== props?.detail?.parentId,
                )
              : addWorkItemParentList
          }
          getPopupContainer={(node: any) => node}
          optionFilterProp="label"
          allowClear
        />
      )
    } else if (item.content === 'solution') {
      // 解决办法
      nodeComponent = (
        <Input
          placeholder={t('common.pleaseEnter')}
          allowClear
          autoComplete="off"
        />
      )
    } else {
      nodeComponent = (
        <DatePicker
          disabled={!props.isCreateDemand}
          getPopupContainer={node => node}
          style={{ width: '100%' }}
        />
      )
    }
    return nodeComponent
  }

  // 返回自定义字段相应的控件
  const getCustomDom = (item: any) => {
    const currentItem = JSON.parse(JSON.stringify(item.fieldContent))
    let options: any = currentItem.value
    if (['user_select_checkbox', 'user_select'].includes(currentItem.attr)) {
      options =
        currentItem.value?.[0] === 'projectMember'
          ? removeNull(projectInfoValues, 'user_name')?.map((i: any) => ({
              label: i.content,
              value: i.id,
            }))
          : removeNull(projectInfoValues, 'users_copysend_name')?.map(
              (i: any) => ({
                label: i.content,
                value: i.id,
              }),
            )
    }

    return getTypeComponent({
      ...{ attr: currentItem.attr, value: options },
      ...{ remarks: item.remarks },
    })
  }

  return (
    <RightWrap>
      <Form layout="vertical" form={form} disabled={!props.isCreateDemand}>
        {props?.projectId && (
          <Form.Item
            label={t('state')}
            name="status"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              style={{ width: '100%' }}
              showArrow
              showSearch
              placeholder={t('common.pleaseSelect')}
              getPopupContainer={(node: any) => node}
              allowClear
              disabled={params?.editId}
            >
              {props.workStatusList?.list?.map((i: any) => {
                return (
                  <Select.Option
                    value={i.statusId}
                    key={i.statusId}
                    label={i.name}
                  >
                    <StateTag
                      name={i.name}
                      state={
                        i?.is_start === 1 && i?.is_end === 2
                          ? 1
                          : i?.is_end === 1 && i?.is_start === 2
                          ? 2
                          : i?.is_start === 2 && i?.is_end === 2
                          ? 3
                          : 0
                      }
                    />
                  </Select.Option>
                )
              })}
            </CustomSelect>
          </Form.Item>
        )}
        {notFoldList?.map((i: any) => (
          <>
            {i.fieldContent?.attr === 'single_checkbox' && (
              <Form.Item key={i.content} label={i.title} name={i.content}>
                <CheckboxWrap
                  defaultChecked={form.getFieldValue(i.content) || false}
                  onChange={e => onChangeCheckBox(e, i.content)}
                />
              </Form.Item>
            )}
            {i.content !== 'schedule' &&
              i.fieldContent?.attr !== 'single_checkbox' && (
                <Form.Item
                  key={i.content}
                  label={i.title}
                  name={i.content}
                  rules={[{ required: i.isRequired === 1, message: '' }]}
                >
                  {i.isCustomize === 1
                    ? getCustomDom(i)
                    : getBasicTypeComponent(i)}
                </Form.Item>
              )}
            {/* 需求进度 */}
            {i.content === 'schedule' && params?.editId && (
              <Form.Item
                key={i.content}
                label={i.title}
                name={i.content}
                rules={[{ required: i.isRequired === 1, message: '' }]}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <SliderWrap
                    style={{ width: 330 }}
                    value={schedule}
                    tipFormatter={(value: any) => `${value}%`}
                    onChange={value => onChangeSetSchedule(value)}
                    disabled={
                      !(
                        props?.detail?.user
                          ?.map((k: any) => k.user.id)
                          ?.includes(userInfo?.id) &&
                        props?.detail.status.is_start !== 1 &&
                        props?.detail.status.is_end !== 1
                      )
                    }
                  />
                  <span
                    style={{
                      color: 'var(--neutral-n2)',
                      marginLeft: 8,
                      fontSize: 14,
                    }}
                  >
                    {schedule}%
                  </span>
                </div>
              </Form.Item>
            )}
          </>
        ))}
        {!isShowFields && foldList?.length > 0 && (
          <ShowLabel onClick={() => setIsShowFields(true)}>
            {t('newlyAdd.open')}
          </ShowLabel>
        )}
        <div hidden={!isShowFields}>
          {foldList?.map((i: any) => (
            <>
              {i.fieldContent?.attr === 'single_checkbox' && (
                <Form.Item key={i.content} label={i.title} name={i.content}>
                  <CheckboxWrap
                    defaultChecked={form.getFieldValue(i.content) || false}
                    onChange={e => onChangeCheckBox(e, i.content)}
                  />
                </Form.Item>
              )}
              {i.content !== 'schedule' &&
                i.fieldContent?.attr !== 'single_checkbox' && (
                  <Form.Item
                    key={i.content}
                    label={i.title}
                    name={i.content}
                    rules={[{ required: i.isRequired === 1, message: '' }]}
                  >
                    {i.isCustomize === 1
                      ? getCustomDom(i)
                      : getBasicTypeComponent(i)}
                  </Form.Item>
                )}
              {/* 需求进度 */}
              {i.content === 'schedule' && params?.editId && (
                <Form.Item
                  key={i.content}
                  label={i.title}
                  name={i.content}
                  rules={[{ required: i.isRequired === 1, message: '' }]}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SliderWrap
                      style={{ width: 330 }}
                      value={schedule}
                      tipFormatter={(value: any) => `${value}%`}
                      onChange={value => onChangeSetSchedule(value)}
                      disabled={
                        !(
                          props?.detail?.user
                            ?.map((k: any) => k.user.id)
                            ?.includes(userInfo?.id) &&
                          props?.detail.status.is_start !== 1 &&
                          props?.detail.status.is_end !== 1
                        )
                      }
                    />
                    <span
                      style={{
                        color: 'var(--neutral-n2)',
                        marginLeft: 8,
                        fontSize: 14,
                      }}
                    >
                      {schedule}%
                    </span>
                  </div>
                </Form.Item>
              )}
            </>
          ))}
        </div>
        {isShowFields && foldList?.length > 0 && (
          <ShowLabel onClick={() => setIsShowFields(false)}>
            {t('newlyAdd.close')}
          </ShowLabel>
        )}
      </Form>
    </RightWrap>
  )
}

export default CreateDemandRight
