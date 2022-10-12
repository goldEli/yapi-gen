/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import Pop from '@/components/Popconfirm'
import styled from '@emotion/styled'
import { Divider, Form, Input, message, Select, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { getShapeLeft } from '@/services/project/shape'
import { ShapeContent } from '@/components/Shape'
import { updateDemandStatus } from '@/services/mine'

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  borderRadius: 6,
  padding: '0 12px',
  fontSize: 14,
  border: '1px solid #EBEDF0',
  color: '#969799',
  cursor: 'pointer',
})

const DemandStatus = styled.div({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  width: 362,
  '.ant-form-item': {
    margin: '16px 0 0 0',
  },
})

const PopoverFooter = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  marginTop: 36,
  justifyContent: 'flex-end',
})

interface Props {
  hide?(): void
  active?: any
}

const DemandBox = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const { memberList } = useModel('project')
  const { getDemandInfo, demandInfo, setIsRefreshComment } = useModel('demand')
  const statusList = demandInfo?.status?.can_changes
  const activeContent
    = statusList?.filter((i: any) => i.id === props.active)[0]?.content
    !== '规划中'
  const hasDealName = demandInfo?.user?.length

  const onClear = () => {
    props.hide?.()
    form.resetFields()
  }

  const onChangeStatus = async (value: any) => {
    value.statusId = props.active
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getDemandInfo({ projectId, id: demandId })
      onClear()
    } catch (error) {

      //
    }
  }

  const confirm = async () => {
    await form.validateFields()
    const res = form.getFieldsValue()
    const value = {
      projectId,
      demandId,
      userIds: res.username,
      content: res.content,
    }
    onChangeStatus(value)
    setTimeout(() => {
      setIsRefreshComment(true)
    }, 100)
  }

  return (
    <DemandStatus title="">
      <div
        onClick={() => props.hide?.()}
        style={{ textAlign: 'right', color: '#323233', cursor: 'pointer' }}
      >
        <IconFont type="close" />
      </div>
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item
          label={t('common.dealName')}
          name="username"
          rules={[
            {
              required: activeContent || !activeContent && hasDealName,
              message: '',
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder={t('common.pleaseSelect')}
            allowClear
            optionFilterProp="label"
            options={memberList?.map((i: any) => ({
              label: i.name,
              value: i.id,
            }))}
          />
        </Form.Item>
        <Form.Item label={t('common.comment')} name="content">
          <Input.TextArea
            autoSize={{ minRows: 5, maxRows: 5 }}
            placeholder={t('project.pleaseComment')}
          />
        </Form.Item>
      </Form>
      <PopoverFooter size={16}>
        <Button onClick={onClear}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={confirm}>
          {t('common.confirm')}
        </Button>
      </PopoverFooter>
    </DemandStatus>
  )
}

const DemandStatusBox = (props: any) => {
  const [t] = useTranslation()
  const { demandInfo } = useModel('demand')
  const statusList = demandInfo?.status?.can_changes_category_status
  const [active, setActive] = useState(0)
  const { projectInfo } = useModel('project')
  const [leftList, setLeftList] = useState([])
  const isCanEdit
    = projectInfo.projectPermissions?.length > 0
    || projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const onChangeIdx = (id: any) => {
    if (demandInfo?.isExamine) {
      message.warning('该需求正在审核中，现在不能流转操作')
    } else {
      setActive(id)
    }
  }
  const init = async () => {
    const res2 = await getShapeLeft({
      id: props.pid,
      nId: props.sid,
    })
    setLeftList(res2)
  }
  const updateStatus = async (res1: any) => {
    const res = await updateDemandStatus(res1)

    if (res.code === 0) {
      message.success(t('common.circulationSuccess'))
    }
  }
  useEffect(() => {
    init()
  }, [])

  // console.log(demandInfo, '====')

  return (
    <>
      {leftList?.map((i: any, index: number) => (
        <Pop
          content={({ onHide }: { onHide(): void }) => {
            return (
              <ShapeContent
                active={demandInfo.status.status}
                sid={props.sid}
                fromId={demandInfo?.status?.id}
                noleft
                tap={(value: any) => updateStatus(value)}
                hide={onHide}
                record={i}
                row={i}
              />
            )
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StatusWrap
              onClick={() => onChangeIdx(i.id)}
              style={{
                color: i.id === demandInfo?.status?.id ? '#2877ff' : '#969799',
                border:
                  i.id === demandInfo?.status?.id
                    ? '1px solid #2877ff'
                    : '1px solid #EBEDF0',
                cursor: isCanEdit ? 'pointer' : 'inherit',
              }}
            >
              {i.status.content}
            </StatusWrap>
            <Divider
              style={{
                width: 48,
                margin: '0 8px',
                minWidth: 'auto',
                display: index === statusList?.length - 1 ? 'none' : 'block',
              }}
              dashed
            />
          </div>
        </Pop>
      ))}
    </>
  )
}

export default DemandStatusBox
