/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-handler-names */
import { Form } from 'antd'
import CommonModal from '@/components/CommonModal'
import Editor from '@/components/Editor'
import ChoosePeople from './ChoosePeople'
import RelatedNeed from './RelatedNeed'
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import IconFont from '@/components/IconFont'
import { useEffect, useRef, useState } from 'react'
import { AddWrap } from '@/components/StyleCommon'
import { ProgressWrap } from '@/components/EditDemand'
import { useModel } from '@/models'
import { getReportDetail } from '@/services/daily'

export const LabelTitle = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '24px 0 8px 0',
      }}
    >
      <div
        style={{
          width: '3px',
          height: '16px',

          background: '#2877FF',
          display: 'inline-block',
          marginRight: '8px',
        }}
      />
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '18px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}

const WhiteDay = (props: any) => {
  const { percentShow, percentVal, uploadStatus } = useModel('demand')
  const [form] = Form.useForm()
  const [isShow, setIsShow] = useState(false)
  const [attachList, setAttachList] = useState<any>([])
  const [peopleValue, setPeopleValue] = useState<any>([])
  const [needValue, setNeedValue] = useState<any>([])
  const leftDom = useRef<HTMLInputElement>(null)
  const confirm = async () => {
    const data: any = await form.validateFields()

    props.editConfirm(data)
    form.resetFields()
  }
  const close = () => {
    form.resetFields()
    props.editClose()
  }

  const onChangeAttachment = (result: any, type: string) => {
    if (type === 'add') {
      result.path = result.url
      form.setFieldsValue({
        attachments: [
          ...(form.getFieldValue('attachments') || []),
          ...[result.url],
        ],
      })
      setAttachList([...attachList, ...[result]])
    } else {
      const arr = attachList
      const comResult = arr.filter((i: any) => i.id !== result.uid)
      form.setFieldsValue({
        attachments: comResult.map((i: any) => i.path),
      })
      setAttachList(comResult)
    }
  }
  const onBottom = () => {
    const dom: any = leftDom?.current
    dom.scrollTop = dom.scrollHeight
  }
  const Children = () => {
    return (
      <ProgressWrap
        status={uploadStatus}
        percent={percentVal}
        size="small"
        style={{ display: percentShow ? 'block' : 'none' }}
      />
    )
  }

  const setDefaultValue = async () => {
    const res = await getReportDetail(props.editId)

    form.setFieldsValue({
      info: res.data.info.finish_content,
      info2: res.data.info.plan_content,
    })
    setPeopleValue(
      res.data.copysend_list.map((item: any) => {
        return {
          avatar: item.avatar,
          id: item.user_id,
          name: item.name,
          nickname: '',
          positionName: null,
          roleName: '',
        }
      }),
    )
    setNeedValue(
      res.data.story_list.map((item: any) => {
        return {
          key: item.associate,
          value: item.associate,
          label: item.name,
        }
      }),
    )
    setAttachList(
      res.data.files.map((item: any) => {
        return {
          path: item.associate,
          id: item.id,
        }
      }),
    )
  }
  useEffect(() => {
    if (props.editId) {
      setDefaultValue()
    }
  }, [props.editId])

  return (
    <CommonModal
      width={784}
      title={props.visibleEditText}
      isVisible={props.visibleEdit}
      onClose={close}
      onConfirm={confirm}
      confirmText="提交"
    >
      <div
        style={{
          height: '680px',
          overflow: 'scroll',
        }}
        ref={leftDom}
      >
        <Form form={form} layout="vertical">
          <Form.Item label={<LabelTitle title="今日完成工作" />} name="info">
            <Editor height={240} />
          </Form.Item>
          <Form.Item label={<LabelTitle title="明日计划工作" />} name="info2">
            <Editor height={240} />
          </Form.Item>
          <Form.Item label={<LabelTitle title="抄送人" />} name="people">
            <ChoosePeople initValue={peopleValue} />
          </Form.Item>
          <Form.Item label={<LabelTitle title="附件" />} name="attachments">
            <UploadAttach
              child={isShow ? <Children /> : ''}
              onChangeShow={setIsShow}
              defaultList={attachList}
              onChangeAttachment={onChangeAttachment}
              onBottom={onBottom}
              addWrap={
                <AddWrap
                  style={{
                    marginBottom: '20px',
                  }}
                  hasColor
                >
                  <IconFont type="plus" />
                  <div>添加附件</div>
                </AddWrap>
              }
            />
          </Form.Item>
          <Form.Item label={<LabelTitle title="关联需求" />} name="needs">
            <RelatedNeed initValue={needValue} />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default WhiteDay
