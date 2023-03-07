/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import { getTypeComponent, removeNull } from '@/tools'
import { decryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { DatePicker, Form, Select, TreeSelect } from 'antd'
import moment from 'moment'
import { useState, useEffect, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import ChangePriorityPopover from '../ChangePriorityPopover'
import IconFont from '../IconFont'
import StateTag from '../StateTag'
import { PriorityWrap, SliderWrap } from '../StyleCommon'

const RightWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 406,
  padding: '0px 14px 0 24px',
  borderLeft: '1px solid #EBEDF0',
})

const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: '#2877ff',
})

interface Props {
  projectId: string | number
  parentList: any[]
  onRef: any
  fieldsList: any[]
  demandDetail?: any
  isSaveParams?: boolean
  workStatusList?: any
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
  const [schedule, setSchedule] = useState(0)
  const [isShowFields, setIsShowFields] = useState(false)
  const { projectInfoValues, filterParamsModal } = useSelector(
    store => store.project,
  )
  const { userInfo } = useSelector(store => store.user)
  const { createDemandProps } = useSelector(store => store.demand)

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
        ].includes(element.type.attr)
      ) {
        // 判断是否是下拉框，是则去除空选项
        const values = customValue?.filter((i: any) => i !== -1)

        // 判断是否是单选，是则取第一个
        const resultValue = ['select', 'radio', 'user_select'].includes(
          element.type.attr,
        )
          ? values[0]
          : values
        resultCustom[element.content] = isFilter ? resultValue : customValue
      } else if (['number'].includes(element.type.attr)) {
        // 判断是否是数字类型，是则获取start
        resultCustom[element.content] = isFilter
          ? Number(customValue?.start)
          : customValue
      } else if (['date'].includes(element.type.attr)) {
        // 判断是否是时间类型，是则获取第一个时间
        resultCustom[element.content] = isFilter
          ? moment(customValue[0])
          : moment(customValue)
      } else if (['text', 'textarea'].includes(element.type.attr)) {
        resultCustom[element.content] = customValue
      }
    })
    form.setFieldsValue({ ...form, ...resultCustom })
  }

  // 需求详情返回后给标签及附件数组赋值
  useEffect(() => {
    if (
      createDemandProps?.demandId &&
      props?.demandDetail?.id &&
      createDemandProps.demandId === props?.demandDetail?.id
    ) {
      // 需求进度
      setSchedule(props?.demandDetail?.schedule)

      // 获取自定义字段回显值
      const form1Obj: any = {}
      for (const key in props?.demandDetail?.customField) {
        form1Obj[key] =
          props?.demandDetail?.customField[key]?.attr === 'date'
            ? props?.demandDetail?.customField[key]?.value
              ? moment(props?.demandDetail?.customField[key]?.value)
              : ''
            : props?.demandDetail?.customField[key]?.value
      }
      form.setFieldsValue({ ...form, ...form1Obj })

      // 回显优先级
      setPriorityDetail(props?.demandDetail.priority)

      // 开始时间
      if (props?.demandDetail?.expectedStart) {
        form.setFieldsValue({
          expected_start_at: moment(props?.demandDetail.expectedStart || 0),
        })
      }

      // 结束时间
      if (props?.demandDetail?.expectedEnd) {
        form.setFieldsValue({
          expected_end_at: moment(props?.demandDetail.expectedEnd || 0),
        })
      }

      let hasIterateId: any
      let hasChild: any

      // 如果是迭代创建或编辑，默认填入迭代
      if (createDemandProps.iterateId) {
        hasIterateId = removeNull(projectInfoValues, 'iterate_name')
          ?.filter((k: any) => k.status === 1)
          .filter((i: any) => i.id === createDemandProps?.iterateId).length
          ? createDemandProps?.iterateId
          : null
      }

      // 如果是子需求创建或编辑，默认父需求填入当前需求id
      if (createDemandProps.isChild) {
        hasChild = props.parentList?.filter(
          (i: any) => i.value === Number(createDemandProps?.parentId),
        )[0]?.value
      }

      form.setFieldsValue({
        status: props.demandDetail?.status.status_id,

        // 抄送人
        users_copysend_name: getCommonUser(
          props?.demandDetail?.copySend?.map((i: any) => i.copysend),
          removeNull(projectInfoValues, 'users_copysend_name'),
        ),

        // 附件
        attachments: props?.demandDetail?.attachment?.map(
          (i: any) => i.attachment.path,
        ),

        // 处理人
        users_name: getCommonUser(
          props?.demandDetail?.user?.map((i: any) => i.user),
          removeNull(projectInfoValues, 'user_name'),
        ),

        // 迭代
        iterate_name: createDemandProps.iterateId
          ? hasIterateId
          : removeNull(projectInfoValues, 'iterate_name')
              ?.filter((k: any) => k.status === 1)
              ?.filter((i: any) => i.id === props?.demandDetail?.iterateId)
              .length
          ? props?.demandDetail?.iterateId
          : [],

        // 父需求
        parent_id: createDemandProps.isChild
          ? hasChild
          : props.parentList?.filter(
              (i: any) => i.value === props?.demandDetail?.parentId,
            ).length
          ? props?.demandDetail?.parentId
          : null,

        // 需求分类
        class: props?.demandDetail.class || null,
      })
    } else {
      // 子需求默认回填父需求
      if (createDemandProps.isChild) {
        form.setFieldsValue({
          parent_id: props.parentList?.filter(
            (i: any) => i.value === Number(createDemandProps?.parentId),
          )[0]?.value,
        })
      }

      // 迭代创建需求默认回填迭代
      if (createDemandProps.iterateId) {
        form.setFieldsValue({
          iterate_name: removeNull(projectInfoValues, 'iterate_name')
            ?.filter((k: any) => k.status === 1)
            .filter((i: any) => i.id === createDemandProps?.iterateId).length
            ? createDemandProps?.iterateId
            : null,
        })
      }

      // 如果不是快速创建并且不是完成并创建下一个，则回填筛选值
      if (!props.isSaveParams && !createDemandProps.isQuickCreate) {
        // 不是在迭代创建需求并且有筛选项
        if (
          !createDemandProps.iterateId &&
          filterParamsModal?.iterateIds?.length
        ) {
          const resultId = filterParamsModal?.iterateIds?.filter(
            (i: any) => i !== -1,
          )?.[0]
          form.setFieldsValue({
            iterate_name: removeNull(projectInfoValues, 'iterate_name')
              ?.filter((k: any) => k.status === 1)
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
        })
        setPriorityDetail(resultPriority)

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
      if (
        createDemandProps.isQuickCreate &&
        localStorage.getItem('quickCreateData')
      ) {
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
        if (
          hisCategoryData?.customField &&
          JSON.stringify(hisCategoryData?.customField) !== '{}'
        ) {
          setCustomFields(hisCategoryData?.customField, false)
        }
      }
    }
  }, [
    createDemandProps?.demandId,
    props?.demandDetail,
    props.parentList,
    props.fieldsList,
    props.workStatusList,
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

    Object.keys(values)?.forEach((k: any) => {
      values[k] = values[k] ? values[k] : ''
      const obj = props.fieldsList?.filter((i: any) => k === i.content)[0]

      // 处理预计结束时间和预计开始时间
      if (['expected_end_at', 'expected_start_at'].includes(k)) {
        values[k] = moment(values[k.content]).format('YYYY-MM-DD')
      }

      // 处理自定义字段中时间参数
      if (obj?.fieldContent?.attr === 'date' && values[k]) {
        values[obj.content] = moment(values[obj.content]).format(
          obj?.fieldContent?.value[0] === 'datetime'
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

  // 修改优先级
  const onCurrentDetail = (item: any) => {
    setPriorityDetail(item)
    form.setFieldsValue({
      priority: item,
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

    // 下拉多选 抄送人，处理人，迭代
    if (
      ['users_copysend_name', 'iterate_name', 'users_name'].includes(
        item.content,
      )
    ) {
      nodeComponent = (
        <Select
          style={{ width: '100%' }}
          showArrow
          mode="multiple"
          disabled={!props?.projectId}
          showSearch
          placeholder={t('common.pleaseSelect')}
          getPopupContainer={node => node}
          allowClear
          optionFilterProp="label"
          options={format(
            (item.content === 'iterate_name'
              ? removeNull(projectInfoValues, item.content)?.filter(
                  (k: any) => k.status === 1,
                )
              : removeNull(projectInfoValues, item.content)
            )?.map((i: any) => ({
              label:
                (item.content === 'users_name' ||
                  item.content === 'users_copysend_name') &&
                i.id === info
                  ? `${i.content} （我自己）`
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
              <IconFont className="icon" type="down-icon" />
            </div>
          </PriorityWrap>
        </ChangePriorityPopover>
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
          allowClear
          treeData={
            projectInfoValues?.filter((i: any) => i.key === 'class')[0]
              ?.children
          }
          disabled={!props?.projectId}
        />
      )
    } else if (item.content === 'parent_id') {
      // 父需求
      nodeComponent = (
        <Select
          style={{ width: '100%' }}
          showArrow
          showSearch
          placeholder={t('common.pleaseParentDemand')}
          disabled={!props?.projectId}
          options={
            createDemandProps?.demandId
              ? props.parentList?.filter(
                  (k: any) =>
                    k.value !== createDemandProps?.demandId &&
                    k.parentId !== createDemandProps?.demandId &&
                    k.parentId !== props?.demandDetail?.parentId,
                )
              : props.parentList
          }
          getPopupContainer={node => node}
          optionFilterProp="label"
          allowClear
        />
      )
    } else {
      nodeComponent = (
        <DatePicker
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
      <Form layout="vertical" form={form}>
        {props?.projectId && (
          <Form.Item
            label="需求状态"
            name="status"
            rules={[{ required: true, message: '' }]}
          >
            <Select
              style={{ width: '100%' }}
              showArrow
              showSearch
              placeholder={t('common.pleaseSelect')}
              getPopupContainer={node => node}
              allowClear
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
            </Select>
          </Form.Item>
        )}
        {notFoldList?.map((i: any) => (
          <>
            {i.content !== 'schedule' && (
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
            {i.content === 'schedule' && createDemandProps.demandId && (
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
                        props?.demandDetail?.user
                          ?.map((k: any) => k.user.id)
                          ?.includes(userInfo?.id) &&
                        props?.demandDetail.status.is_start !== 1 &&
                        props?.demandDetail.status.is_end !== 1
                      )
                    }
                  />
                  <span
                    style={{ color: '#646566', marginLeft: 8, fontSize: 14 }}
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
        {isShowFields &&
          foldList?.map((i: any) => (
            <Form.Item
              key={i.content}
              label={i.title}
              name={i.content}
              rules={[{ required: i.isRequired === 1, message: '' }]}
            >
              {i.isCustomize === 1 ? getCustomDom(i) : getBasicTypeComponent(i)}
            </Form.Item>
          ))}
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
