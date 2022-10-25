/* eslint-disable complexity */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import styled from '@emotion/styled'
import {
  DatePicker,
  Form,
  Input,
  message,
  Progress,
  Select,
  TreeSelect,
} from 'antd'
import { useEffect, useRef, useState, useImperativeHandle } from 'react'
import {
  FormWrapDemand,
  SliderWrap,
  PriorityWrap,
} from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import PopConfirm from '@/components/Popconfirm'
import { LevelContent } from '@/components/Level'
import { useModel } from '@/models'
import { getTypeComponent } from '@/tools'
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
  demandId: any
  demandInfo: any
  projectId: any
  memberList: any
  demandList: any
  parentList: any
  classTreeData: any
  allDemandList: any
  onRefRight: any
  iterateId: any
  isChild: any
  isChildParentId: any
}

const EditRight = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [fieldsForm] = Form.useForm()
  const [schedule, setSchedule] = useState(0)
  const [priorityDetail, setPriorityDetail] = useState<any>({})
  const [isShowFields, setIsShowFields] = useState(false)
  const { userInfo } = useModel('user')
  const { fieldList } = useModel('project')
  const { selectIterate } = useModel('iterate')

  const onReset = () => {
    setPriorityDetail({})
    form.resetFields()
    form.setFieldsValue({
      users: [],
      copysend: [],
    })
    fieldsForm.resetFields()
    setIsShowFields(false)
    setSchedule(0)
  }

  const onConfirm = () => {
    const values = form.getFieldsValue()
    const values1 = fieldsForm.getFieldsValue()
    if (values.startTime) {
      values.expectedStart = moment(values.startTime).format('YYYY-MM-DD')
    }
    if (values.endTime) {
      values.expectedEnd = moment(values.endTime).format('YYYY-MM-DD')
    }
    if (values.priority?.id) {
      values.priority = values.priority?.id
    }
    if (props.iterateId) {
      values.iterateId = props.iterateId
    }
    Object.keys(values1)?.forEach((k: any) => {
      values1[k] = values1[k] ? values1[k] : ''
      const obj = fieldList?.list?.filter((i: any) => k === i.content)[0]
      if (obj?.type?.attr === 'date' && values1[k]) {
        values1[obj.content] = moment(values1[obj.content]).format(
          obj?.type?.value[0] === 'datetime'
            ? 'YYYY-MM-DD hh:mm:ss'
            : 'YYYY-MM-DD',
        )
      } else if (
        obj?.type?.attr === 'select_checkbox'
        || obj?.type?.attr === 'checkbox'
      ) {
        values1[obj.content] = values1[obj.content]?.length
          ? values1[obj.content]
          : []
      }
    })
    values.customField = values1
    return values
  }

  const onCreateNext = () => {
    if (props.isChild) {
      form.setFieldsValue({
        parentId: props.allDemandList?.filter(
          (i: any) => i.value === Number(props?.isChildParentId),
        )[0]?.value,
      })
    }
  }

  useImperativeHandle(props.onRefRight, () => {
    return {
      reset: onReset,
      confirm: onConfirm,
      createNext: onCreateNext,
    }
  })

  const getCommonUser = (arr: any, memberArr: any) => {
    let res: any[] = []
    if (arr.length) {
      res = memberArr?.filter((i: any) => arr.some((k: any) => k.id === i.id))
    }
    return res.length ? res.map((i: any) => i.id) : []
  }

  useEffect(() => {
    if (props.demandInfo) {
      form.setFieldsValue(props.demandInfo)
      setSchedule(props.demandInfo?.schedule)
      if (
        props.classTreeData?.find((j: any) => j.id === props.demandInfo.class)
          ?.length
      ) {
        form.setFieldsValue({
          'class': '',
        })
      }
      const form1Obj: any = {}
      for (const key in props.demandInfo?.customField) {
        form1Obj[key]
          = props.demandInfo?.customField[key]?.attr === 'date'
            ? props.demandInfo?.customField[key]?.value
              ? moment(props.demandInfo?.customField[key]?.value)
              : ''
            : props.demandInfo?.customField[key]?.value
      }
      fieldsForm.setFieldsValue(form1Obj)
      setPriorityDetail(props.demandInfo?.priority)
      if (props.demandInfo?.expectedStart) {
        form.setFieldsValue({
          startTime: moment(props.demandInfo.expectedStart || 0),
        })
      }

      if (props.demandInfo?.expectedEnd) {
        form.setFieldsValue({
          endTime: moment(props.demandInfo.expectedStart || 0),
        })
      }

      const parentArr = props.demandList

      form.setFieldsValue({
        copySendIds: getCommonUser(
          props.demandInfo?.copySend?.map((i: any) => i.copysend),
          props.memberList,
        ),
        attachments: props.demandInfo?.attachment.map(
          (i: any) => i.attachment.path,
        ),
        userIds: getCommonUser(
          props.demandInfo?.user?.map((i: any) => i.user),
          props.memberList,
        ),
        tagIds: props.demandInfo?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      })
      if (
        selectIterate?.list?.filter(
          (i: any) => i.id === props.demandInfo?.iterateId,
        ).length
      ) {
        form.setFieldsValue({
          iterateId: props.demandInfo?.iterateId,
        })
      }
      if (
        parentArr?.filter((i: any) => i.value === props.demandInfo?.parentId)
          .length
      ) {
        form.setFieldsValue({
          parentId: props.demandInfo?.parentId,
        })
      }
    } else {
      form.resetFields()
    }
  }, [props.demandInfo])

  useEffect(() => {
    if (props.allDemandList && props?.isChildParentId && props?.isChild) {
      form.setFieldsValue({
        parentId: props.allDemandList?.filter(
          (i: any) => i.value === Number(props?.isChildParentId),
        )[0]?.value,
      })
    }
  }, [props.allDemandList, props?.isChildParentId, props?.isChild])

  const onChangeSetSchedule = (val: any) => {
    setSchedule(val)
    form.setFieldsValue({
      schedule: val,
    })
  }

  const onCurrentDetail = (item: any) => {
    setPriorityDetail(item)
    form.setFieldsValue({
      priority: item,
    })
  }

  return (
    <RightWrap>
      <FormWrapDemand layout="vertical" form={form}>
        {props?.demandId
          ? <Form.Item label={t('newlyAdd.demandProgress')} name="schedule">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SliderWrap
                  style={{ width: 330 }}
                  value={schedule}
                  tipFormatter={(value: any) => `${value}%`}
                  onChange={value => onChangeSetSchedule(value)}
                  disabled={
                    !(
                      props.demandInfo?.user
                        ?.map((i: any) => i.user.id)
                        ?.includes(userInfo?.id)
                    && props.demandInfo.status.is_start !== 1
                    && props.demandInfo.status.is_end !== 1
                    )
                  }
                />
                <span style={{ color: '#646566', marginLeft: 8, fontSize: 14 }}>
                  {schedule}%
                </span>
              </div>
            </Form.Item>
          : null}
        <Form.Item label={t('common.dealName')} name="userIds">
          <Select
            style={{ width: '100%' }}
            showArrow
            mode="multiple"
            disabled={!props.projectId}
            showSearch
            placeholder={t('common.searchDeal')}
            getPopupContainer={node => node}
            allowClear
            optionFilterProp="label"
            options={props.memberList?.map((i: any) => ({
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
            treeData={props.classTreeData}
            disabled={!props.projectId}
          />
        </Form.Item>
        <Form.Item label={t('common.parentDemand')} name="parentId">
          <Select
            style={{ width: '100%' }}
            showArrow
            showSearch
            placeholder={t('common.pleaseParentDemand')}
            disabled={!props.projectId}
            options={
              props?.demandId
                ? props.parentList?.filter(
                  (k: any) => k.value !== props?.demandId
                      && k.parentId !== props?.demandId
                      && k.parentId !== props.demandInfo?.parentId,
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
                <LevelContent
                  onHide={onHide}
                  record={{ project_id: props.projectId }}
                  onCurrentDetail={onCurrentDetail}
                />
              )
            }}
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
            disabled={!props.projectId}
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
            disabled={!props.projectId}
            options={props.memberList?.map((i: any) => ({
              label: i.name,
              value: i.id,
            }))}
          />
        </Form.Item>
        {fieldList?.list
          ? <>
              {!isShowFields && (
                <ShowLabel onClick={() => setIsShowFields(true)}>
                  {t('newlyAdd.open')}
                </ShowLabel>
              )}
              <FormWrapDemand
                layout="vertical"
                form={fieldsForm}
                style={{ display: isShowFields ? 'block' : 'none' }}
              >
                {fieldList?.list?.map((i: any) => (
                  <div style={{ display: 'flex' }} key={i.content}>
                    <Form.Item label={i.name} name={i.content}>
                      {getTypeComponent(i.type)}
                    </Form.Item>
                  </div>
                ))}
              </FormWrapDemand>
              {isShowFields
                ? <ShowLabel onClick={() => setIsShowFields(false)}>
                    {t('newlyAdd.close')}
                  </ShowLabel>
                : null}
            </>
          : null}
      </FormWrapDemand>
    </RightWrap>
  )
}

export default EditRight
