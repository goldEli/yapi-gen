/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable complexity */

import styled from '@emotion/styled'
import {
  FormWrapDemand,
  PriorityWrap,
  SliderWrap,
} from '@/components/StyleCommon'
import PopConfirm from '@/components/Popconfirm'
import { DatePicker, Form, Select, TreeSelect } from 'antd'
import { useTranslation } from 'react-i18next'
import { useModel } from '@/models'
import { useEffect, useImperativeHandle, useState } from 'react'
import { LevelContent } from '@/components/Level'
import IconFont from '@/components/IconFont'
import { getNestedChildren, getTypeComponent } from '@/tools'
import moment from 'moment'

const RightWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 406,
  paddingLeft: 24,
  borderLeft: '1px solid #EBEDF0',
})

const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: '#2877ff',
})

interface Props {
  onRef: any
  //需求id
  demandId: any
  // 项目id
  projectId: any
  // 父需求
  parentList: any
  // 需求分类
  treeArr: any
  // 迭代id
  iterateId?: any
  // 需求详情
  info?: any
  //是否来自子需求
  isChild?: any
}

const EditDemandRIght = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const { userInfo } = useModel('user')
  const { selectAllStaffData, memberList, fieldList, priorityList } =
    useModel('project')
  const { selectIterate } = useModel('iterate')
  const { demandInfo, filterParams } = useModel('demand')
  const [schedule, setSchedule] = useState(0)
  const [isShowFields, setIsShowFields] = useState(false)
  const [priorityDetail, setPriorityDetail] = useState<any>({})
  const [classTreeData, setClassTreeData] = useState<any>([])

  // 处理人相关的下拉
  const getCommonUser = (arr: any, memberArr: any) => {
    let res: any[] = []
    if (arr?.length > 0) {
      res = memberArr?.filter((i: any) => arr.some((k: any) => k.id === i.id))
    }
    return res?.length ? res.map((i: any) => i.id) : []
  }

  useEffect(() => {
    setClassTreeData([
      ...[
        {
          title: t('newlyAdd.unclassified'),
          key: 0,
          value: 0,
          children: [],
        },
      ],
      ...getNestedChildren(props.treeArr, 0),
    ])
  }, [props.treeArr])

  // 需求详情返回后给标签及附件数组赋值
  useEffect(() => {
    if (props?.demandId && props.info?.id) {
      setSchedule(props.info?.schedule)
      const form1Obj: any = {}
      for (const key in props.info?.customField) {
        form1Obj[key] =
          props.info?.customField[key]?.attr === 'date'
            ? props.info?.customField[key]?.value
              ? moment(props.info?.customField[key]?.value)
              : ''
            : props.info?.customField[key]?.value
      }
      form1.setFieldsValue(form1Obj)
      setPriorityDetail(props.info.priority)
      if (props.info?.expectedStart) {
        form.setFieldsValue({
          startTime: moment(props.info.expectedStart || 0),
        })
      }

      if (props.info?.expectedEnd) {
        form.setFieldsValue({
          endTime: moment(props.info.expectedStart || 0),
        })
      }

      let hasIterateId: any
      let hasChild: any
      // 如果是迭代创建或编辑，默认填入迭代
      if (props.iterateId) {
        hasIterateId = selectIterate?.list
          ?.filter((k: any) => k.status === 1)
          .filter((i: any) => i.id === props?.iterateId).length
          ? props?.iterateId
          : null
      }
      // 如果是子需求创建或编辑，默认父需求填入当前需求id
      if (props.isChild) {
        hasChild = props.parentList?.filter(
          (i: any) => i.value === Number(demandInfo?.id),
        )[0]?.value
      }

      form.setFieldsValue({
        copySendIds: getCommonUser(
          props.info?.copySend?.map((i: any) => i.copysend),
          selectAllStaffData,
        ),
        attachments: props.info?.attachment?.map((i: any) => i.attachment.path),
        userIds: getCommonUser(
          props.info?.user?.map((i: any) => i.user),
          memberList,
        ),
        iterateId: props.iterateId
          ? hasIterateId
          : selectIterate?.list
              ?.filter((k: any) => k.status === 1)
              ?.filter((i: any) => i.id === props.info?.iterateId).length
          ? props.info?.iterateId
          : null,
        parentId: props.isChild
          ? hasChild
          : props.parentList?.filter(
              (i: any) => i.value === props.info?.parentId,
            ).length
          ? props.info?.parentId
          : null,
        class: props.treeArr?.filter((j: any) => j.id === props.info.class)
          ?.length
          ? props.info.class
          : props.info.class === 0
          ? 0
          : null,
      })
    } else {
      // console.log(
      //   memberList,
      //   '111',
      //   classTreeData,
      //   '333',
      //   priorityList,
      //   '333',
      //   selectIterate,
      //   '12121',
      //   selectAllStaffData,
      //   '44',
      //   filterParams,
      // )
      // 子需求默认回填父需求
      if (props.isChild) {
        form.setFieldsValue({
          parentId: props.parentList?.filter(
            (i: any) => i.value === Number(demandInfo?.id),
          )[0]?.value,
        })
      }
      // 迭代创建需求默认回填迭代
      if (props.iterateId) {
        form.setFieldsValue({
          iterateId: selectIterate?.list
            ?.filter((k: any) => k.status === 1)
            .filter((i: any) => i.id === props?.iterateId).length
            ? props?.iterateId
            : null,
        })
      }
      // 不是在迭代创建需求并且有筛选项
      if (!props.iterateId && filterParams?.iterateId?.length) {
        const resultId = filterParams?.iterateId?.filter(
          (i: any) => i !== -1,
        )?.[0]
        form.setFieldsValue({
          iterateId: selectIterate?.list
            ?.filter((k: any) => k.status === 1)
            .filter((i: any) => i.id === resultId).length
            ? resultId
            : null,
        })
      }

      form.setFieldsValue({
        copySendIds: filterParams?.usersCopysendNameId?.filter(
          (i: any) => i !== -1,
        ),
        userIds: filterParams?.usersnameId?.filter((i: any) => i !== -1),
        class: filterParams?.class_ids?.filter((i: any) => i !== -1),
      })
    }
  }, [props?.demandId, props.info, props.parentList, selectIterate])

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
      const obj = fieldList?.list?.filter((i: any) => k === i.content)[0]
      if (obj?.type?.attr === 'date' && customValues[k]) {
        customValues[obj.content] = moment(customValues[obj.content]).format(
          obj?.type?.value[0] === 'datetime'
            ? 'YYYY-MM-DD HH:mm:ss'
            : 'YYYY-MM-DD',
        )
      } else if (
        obj?.type?.attr === 'select_checkbox' ||
        obj?.type?.attr === 'checkbox'
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

  // 提交参数后的操作
  const onSubmitUpdate = () => {
    setIsShowFields(false)
  }

  useImperativeHandle(props.onRef, () => {
    return {
      confirm: onConfirm,
      reset: onReset,
      update: onSubmitUpdate,
    }
  })

  return (
    <RightWrap>
      <FormWrapDemand layout="vertical" form={form}>
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
                    props.info?.user
                      ?.map((i: any) => i.user.id)
                      ?.includes(userInfo?.id) &&
                    props.info.status.is_start !== 1 &&
                    props.info.status.is_end !== 1
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
            options={memberList?.map((i: any) => ({
              label: i.name,
              value: i.id,
            }))}
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
            treeData={classTreeData}
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
                      k.parentId !== props.info?.parentId,
                  )
                : props.parentList
            }
            getPopupContainer={node => node}
            optionFilterProp="label"
            allowClear
          />
        </Form.Item>
        <Form.Item label={t('common.priority')} name="priority">
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                props?.projectId && (
                  <LevelContent
                    onHide={onHide}
                    record={{ project_id: props?.projectId }}
                    onCurrentDetail={onCurrentDetail}
                  />
                )
              )
            }}
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
          </PopConfirm>
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
            options={selectIterate?.list
              ?.filter((k: any) => k.status === 1)
              ?.map((i: any) => ({
                label: i.name,
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
            options={selectAllStaffData}
          />
        </Form.Item>
      </FormWrapDemand>
      {fieldList?.list && (
        <>
          {!isShowFields && fieldList?.list?.length > 0 && (
            <ShowLabel onClick={() => setIsShowFields(true)}>
              {t('newlyAdd.open')}
            </ShowLabel>
          )}
          <FormWrapDemand
            layout="vertical"
            form={form1}
            style={{ display: isShowFields ? 'block' : 'none' }}
          >
            {fieldList?.list?.map((i: any) => (
              <div style={{ display: 'flex' }} key={i.content}>
                <Form.Item label={i.name} name={i.content}>
                  {getTypeComponent({
                    ...i.type,
                    ...{ remarks: i.remarks },
                  })}
                </Form.Item>
              </div>
            ))}
          </FormWrapDemand>
          {isShowFields && fieldList?.list?.length > 0 && (
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
