/* eslint-disable no-negated-condition */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable complexity */

import styled from '@emotion/styled'
import { PriorityWrap, SliderWrap } from '@/components/StyleCommon'
import { DatePicker, Form, Select, TreeSelect } from 'antd'
import { useTranslation } from 'react-i18next'
import { useEffect, useImperativeHandle, useState } from 'react'
import IconFont from '@/components/IconFont'
import { getTypeComponent, removeNull } from '@/tools'
import moment from 'moment'
import { decryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'

const RightWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 406,
  paddingLeft: 24,
  borderLeft: '1px solid var(--neutral-n6-d1)',
  paddingRight: 16,
})

const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: 'var(--primary-d1)',
})

interface Props {
  onRef: any
  //需求id
  demandId: any
  // 项目id
  projectId: any
  // 父需求
  parentList: any
  // 迭代id
  iterateId?: any
  //是否来自子需求
  isChild?: any
  // 是否是完成并创建
  isSaveParams?: boolean
  // 我的-快速创建
  isQuickCreate?: any
  // 自定义字段
  fieldsList: any
  // 父需求id --- 和isChild一起使用
  parentId?: any

  treeArr?: any
  demandDetail?: any
}

const EditDemandRIght = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const { userInfo } = useSelector(store => store.user)
  const { filterParamsModal, projectInfoValues } = useSelector(
    store => store.project,
  )
  const [schedule, setSchedule] = useState(0)
  const [isShowFields, setIsShowFields] = useState(false)
  const [priorityDetail, setPriorityDetail] = useState<any>({})

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
    let resultCustom: any = {}
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
    form1.setFieldsValue(resultCustom)
  }

  // 需求详情返回后给标签及附件数组赋值
  useEffect(() => {
    if (
      props?.demandId &&
      props?.demandDetail?.id &&
      props.demandId === props?.demandDetail?.id
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
      form1.setFieldsValue(form1Obj)
      // 回显优先级
      setPriorityDetail(props?.demandDetail.priority)
      // 开始时间
      if (props?.demandDetail?.expectedStart) {
        form.setFieldsValue({
          startTime: moment(props?.demandDetail.expectedStart || 0),
        })
      }
      // 结束时间
      if (props?.demandDetail?.expectedEnd) {
        form.setFieldsValue({
          endTime: moment(props?.demandDetail.expectedEnd || 0),
        })
      }

      let hasIterateId: any
      let hasChild: any
      // 如果是迭代创建或编辑，默认填入迭代
      if (props.iterateId) {
        hasIterateId = removeNull(projectInfoValues, 'iterate_name')
          ?.filter((k: any) => k.status === 1)
          .filter((i: any) => i.id === props?.iterateId).length
          ? props?.iterateId
          : null
      }
      // 如果是子需求创建或编辑，默认父需求填入当前需求id
      if (props.isChild) {
        hasChild = props.parentList?.filter(
          (i: any) => i.value === Number(props?.parentId),
        )[0]?.value
      }

      form.setFieldsValue({
        // 抄送人
        copySendIds: getCommonUser(
          props?.demandDetail?.copySend?.map((i: any) => i.copysend),
          removeNull(projectInfoValues, 'users_copysend_name'),
        ),
        // 附件
        attachments: props?.demandDetail?.attachment?.map(
          (i: any) => i.attachment.path,
        ),
        // 处理人
        userIds: getCommonUser(
          props?.demandDetail?.user?.map((i: any) => i.user),
          removeNull(projectInfoValues, 'user_name'),
        ),
        // 迭代
        iterateId: props.iterateId
          ? hasIterateId
          : removeNull(projectInfoValues, 'iterate_name')
              ?.filter((k: any) => k.status === 1)
              ?.filter((i: any) => i.id === props?.demandDetail?.iterateId)
              .length
          ? props?.demandDetail?.iterateId
          : null,
        // 父需求
        parentId: props.isChild
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
      if (props.isChild) {
        form.setFieldsValue({
          parentId: props.parentList?.filter(
            (i: any) => i.value === Number(props?.parentId),
          )[0]?.value,
        })
      }
      // 迭代创建需求默认回填迭代
      if (props.iterateId) {
        form.setFieldsValue({
          iterateId: removeNull(projectInfoValues, 'iterate_name')
            ?.filter((k: any) => k.status === 1)
            .filter((i: any) => i.id === props?.iterateId).length
            ? props?.iterateId
            : null,
        })
      }
      // 如果不是快速创建并且不是完成并创建下一个，则回填筛选值
      if (!props.isSaveParams && !props.isQuickCreate) {
        // 不是在迭代创建需求并且有筛选项
        if (!props.iterateId && filterParamsModal?.iterateIds?.length) {
          const resultId = filterParamsModal?.iterateIds?.filter(
            (i: any) => i !== -1,
          )?.[0]
          form.setFieldsValue({
            iterateId: removeNull(projectInfoValues, 'iterate_name')
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
          copySendIds: filterParamsModal?.copySendId?.filter(
            (i: any) => i !== -1,
          ),
          userIds: filterParamsModal?.usersNameId?.filter((i: any) => i !== -1),
          class: resultClass,
          priority: resultPriority,
        })
        setPriorityDetail(resultPriority)

        // 筛选回填预计开始时间
        if (filterParamsModal?.expectedStart?.length > 0) {
          form.setFieldsValue({
            startTime:
              filterParamsModal?.expectedStart[0] === '1970-01-01'
                ? ''
                : moment(filterParamsModal?.expectedStart[0]),
          })
        }

        // 筛选回填预计结束时间
        if (filterParamsModal?.expectedEnd?.length > 0) {
          form.setFieldsValue({
            endTime: ['2030-01-01', '1970-01-01'].includes(
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
      if (props.isQuickCreate && localStorage.getItem('quickCreateData')) {
        const hisCategoryData = JSON.parse(
          decryptPhp(localStorage.getItem('quickCreateData') as any),
        )

        form.setFieldsValue({
          userIds: hisCategoryData?.userIds,
          class: hisCategoryData?.class,
          parentId: hisCategoryData?.parentId,
          iterateId: hisCategoryData?.iterateId,
          copySendIds: hisCategoryData?.copySendIds,
          priority: removeNull(projectInfoValues, 'priority')?.filter(
            (i: any) => i.id === hisCategoryData?.priority,
          )?.[0],
        })

        if (hisCategoryData?.expectedStart) {
          form.setFieldsValue({
            startTime: moment(hisCategoryData.expectedStart || 0),
          })
        }

        if (hisCategoryData?.expectedEnd) {
          form.setFieldsValue({
            endTime: moment(hisCategoryData.expectedEnd || 0),
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
  }, [props?.demandId, props?.demandDetail, props.parentList, props.fieldsList])

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

  // 提交右侧参数
  const onConfirm = () => {
    const values = form.getFieldsValue()
    const customValues = form1.getFieldsValue()
    values.priority =
      JSON.stringify(priorityDetail) === '{}' ? null : priorityDetail

    Object.keys(customValues)?.forEach((k: any) => {
      customValues[k] = customValues[k] ? customValues[k] : ''
      const obj = props.fieldsList?.filter((i: any) => k === i.content)[0]
      if (obj?.type?.attr === 'date' && customValues[k]) {
        customValues[obj.content] = moment(customValues[obj.content]).format(
          obj?.type?.value[0] === 'datetime'
            ? 'YYYY-MM-DD HH:mm:ss'
            : 'YYYY-MM-DD',
        )
      } else if (
        obj?.type?.attr === 'select_checkbox' ||
        obj?.type?.attr === 'checkbox' ||
        obj?.type?.attr === 'user_select_checkbox'
      ) {
        customValues[obj.content] = customValues[obj.content]?.length
          ? customValues[obj.content]
          : []
      }
    })

    return { ...values, ...{ customField: customValues } }
  }

  // 清空右侧参数
  const onReset = () => {
    form.resetFields()
    form1.resetFields()
    setPriorityDetail({})
    setIsShowFields(false)
  }

  useImperativeHandle(props.onRef, () => {
    return {
      confirm: onConfirm,
      reset: onReset,
    }
  })

  // 返回自定义字段相应的控件
  const getCustomDom = (item: any) => {
    const currentItem = JSON.parse(JSON.stringify(item.type))
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
        {props?.demandId && (
          <Form.Item label={t('newlyAdd.demandProgress')} name="schedule">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SliderWrap
                style={{ width: 330 }}
                value={schedule}
                tipFormatter={(value: any) => `${value}%`}
                onChange={value => onChangeSetSchedule(value)}
                disabled={
                  !(
                    props?.demandDetail?.user
                      ?.map((i: any) => i.user.id)
                      ?.includes(userInfo?.id) &&
                    props?.demandDetail.status.is_start !== 1 &&
                    props?.demandDetail.status.is_end !== 1
                  )
                }
              />
              <span style={{ color: '#646566', marginLeft: 8, fontSize: 14 }}>
                {schedule}%
              </span>
            </div>
          </Form.Item>
        )}
        <Form.Item label={t('common.dealName')} name="userIds">
          <Select
            style={{ width: '100%' }}
            showArrow
            mode="multiple"
            disabled={!props?.projectId}
            showSearch
            placeholder={t('common.searchDeal')}
            getPopupContainer={node => node}
            allowClear
            optionFilterProp="label"
            options={removeNull(projectInfoValues, 'user_name')?.map(
              (i: any) => ({
                label: i.content,
                value: i.id,
              }),
            )}
          />
        </Form.Item>
        <Form.Item label={t('common.expectedStart')} name="startTime">
          <DatePicker
            getPopupContainer={node => node}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label={t('common.expectedEnd')} name="endTime">
          <DatePicker
            getPopupContainer={node => node}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label={t('newlyAdd.demandClass')} name="class">
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
        </Form.Item>
        <Form.Item label={t('common.parentDemand')} name="parentId">
          <Select
            style={{ width: '100%' }}
            showArrow
            showSearch
            placeholder={t('common.pleaseParentDemand')}
            disabled={!props?.projectId}
            options={
              props?.demandId
                ? props.parentList?.filter(
                    (k: any) =>
                      k.value !== props?.demandId &&
                      k.parentId !== props?.demandId &&
                      k.parentId !== props?.demandDetail?.parentId,
                  )
                : props.parentList
            }
            getPopupContainer={node => node}
            optionFilterProp="label"
            allowClear
          />
        </Form.Item>
        <Form.Item label={t('common.priority')} name="priority">
          <ChangePriorityPopover
            isCanOperation={props?.projectId}
            record={{ project_id: props?.projectId }}
            onCurrentDetail={(item: any) => onCurrentDetail(item)}
          >
            {props?.projectId && (
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
            )}
            {!props?.projectId && (
              <span style={{ cursor: 'not-allowed' }}>--</span>
            )}
          </ChangePriorityPopover>
        </Form.Item>
        <Form.Item label={t('common.iterate')} name="iterateId">
          <Select
            placeholder={t('common.pleaseSelect')}
            showSearch
            showArrow
            getPopupContainer={node => node}
            allowClear
            optionFilterProp="label"
            disabled={!props?.projectId}
            options={removeNull(projectInfoValues, 'iterate_name')
              ?.filter((k: any) => k.status === 1)
              ?.map((i: any) => ({
                label: i.content,
                value: i.id,
              }))}
          />
        </Form.Item>
        <Form.Item label={t('common.copySend')} name="copySendIds">
          <Select
            style={{ width: '100%' }}
            showArrow
            mode="multiple"
            showSearch
            placeholder={t('common.pleaseChooseCopySend')}
            getPopupContainer={node => node}
            optionFilterProp="label"
            options={removeNull(projectInfoValues, 'users_copysend_name')?.map(
              (i: any) => ({
                label: i.content,
                value: i.id,
              }),
            )}
          />
        </Form.Item>
      </Form>
      {props.fieldsList && (
        <>
          {!isShowFields && props.fieldsList?.length > 0 && (
            <ShowLabel onClick={() => setIsShowFields(true)}>
              {t('newlyAdd.open')}
            </ShowLabel>
          )}
          <Form
            layout="vertical"
            form={form1}
            style={{ display: isShowFields ? 'block' : 'none' }}
          >
            {props.fieldsList?.map((i: any) => (
              <div style={{ display: 'flex' }} key={i.content}>
                <Form.Item label={i.name} name={i.content}>
                  {getCustomDom(i)}
                </Form.Item>
              </div>
            ))}
          </Form>
          {isShowFields && props.fieldsList?.length > 0 && (
            <ShowLabel onClick={() => setIsShowFields(false)}>
              {t('newlyAdd.close')}
            </ShowLabel>
          )}
        </>
      )}
    </RightWrap>
  )
}

export default EditDemandRIght
