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
}

const EditDemandRIght = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const { demandInfo } = useModel('demand')
  const { userInfo } = useModel('user')
  const { selectAllStaffData, memberList, fieldList } = useModel('project')
  const { selectIterate } = useModel('iterate')
  const [schedule, setSchedule] = useState(0)
  const [isShowFields, setIsShowFields] = useState(false)
  const [priorityDetail, setPriorityDetail] = useState<any>({})
  const [classTreeData, setClassTreeData] = useState<any>([])

  // 处理人相关的下拉
  const getCommonUser = (arr: any, memberArr: any) => {
    let res: any[] = []
    if (arr.length) {
      res = memberArr?.filter((i: any) => arr.some((k: any) => k.id === i.id))
    }
    return res.length ? res.map((i: any) => i.id) : []
  }

  useEffect(() => {
    if (props.treeArr?.length > 0) {
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
    }
  }, [props.treeArr])

  // 需求详情返回后给标签及附件数组赋值
  useEffect(() => {
    if (demandInfo?.id) {
      setSchedule(demandInfo?.schedule)
      const form1Obj: any = {}
      for (const key in demandInfo?.customField) {
        form1Obj[key] =
          demandInfo?.customField[key]?.attr === 'date'
            ? demandInfo?.customField[key]?.value
              ? moment(demandInfo?.customField[key]?.value)
              : ''
            : demandInfo?.customField[key]?.value
      }
      form1.setFieldsValue(form1Obj)
      setPriorityDetail(demandInfo.priority)
      if (demandInfo?.expectedStart) {
        form.setFieldsValue({
          startTime: moment(demandInfo.expectedStart || 0),
        })
      }

      if (demandInfo?.expectedEnd) {
        form.setFieldsValue({
          endTime: moment(demandInfo.expectedStart || 0),
        })
      }
      form.setFieldsValue({
        copySendIds: getCommonUser(
          demandInfo?.copySend?.map((i: any) => i.copysend),
          selectAllStaffData,
        ),
        attachments: demandInfo?.attachment.map((i: any) => i.attachment.path),
        userIds: getCommonUser(
          demandInfo?.user?.map((i: any) => i.user),
          memberList,
        ),

        iterateId: selectIterate?.list
          ?.filter((k: any) => k.status === 1)
          ?.filter((i: any) => i.id === demandInfo?.iterateId).length
          ? demandInfo?.iterateId
          : null,
        parentId: props.parentList?.filter(
          (i: any) => i.value === demandInfo?.parentId,
        ).length
          ? demandInfo?.parentId
          : null,
        class:
          demandInfo.class === 0 ||
          JSON.stringify(
            props.treeArr?.find((j: any) => j.id === demandInfo.class),
          ) !== '{}'
            ? demandInfo.class
            : null,
      })
    }
  }, [demandInfo])

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
    return { ...values, ...{ customField: customValues } }
  }

  // 清空右侧参数
  const onReset = () => {
    form.resetFields()
    form1.resetFields()
  }

  useImperativeHandle(props.onRef, () => {
    return {
      confirm: onConfirm,
      reset: onReset,
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
                    demandInfo?.user
                      ?.map((i: any) => i.user.id)
                      ?.includes(userInfo?.id) &&
                    demandInfo.status.is_start !== 1 &&
                    demandInfo.status.is_end !== 1
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
                      k.parentId !== demandInfo?.parentId,
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
