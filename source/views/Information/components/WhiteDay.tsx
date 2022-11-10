/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-handler-names */
import { Form } from 'antd'
import CommonModal from '@/components/CommonModal'
import Editor from '@/components/Editor'
import ChoosePeople from './ChoosePeople'
import RelatedNeed from './RelatedNeed'
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import IconFont from '@/components/IconFont'
import { AddWrap, ProgressWrapUpload } from '@/components/StyleCommon'
import { useEffect, useRef, useState } from 'react'
import { useModel } from '@/models'
import { getReportDetail } from '@/services/daily'
import { t } from 'i18next'

export const LabelTitle = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* <div
        style={{
          width: '3px',
          height: '16px',

          background: '#2877FF',
          display: 'inline-block',
          marginRight: '8px',
        }}
      /> */}
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}

const WhiteDay = (props: any) => {
  const texts: any = [
    '',
    { name: t('p2.title.t1d'), name2: t('p2.title.t1t') },
    { name: t('p2.title.t2d'), name2: t('p2.title.t2t') },
    { name: t('p2.title.t3d'), name2: t('p2.title.t3t') },
  ]
  const { percentShow, percentVal, uploadStatus } = useModel('demand')
  const [form] = Form.useForm()
  const [isShow, setIsShow] = useState(false)
  const [attachList, setAttachList] = useState<any>([])
  const [peopleValue, setPeopleValue] = useState<any>([])
  const [needValue, setNeedValue] = useState<any>([])
  const [title, setTitle] = useState<any>([])
  const leftDom = useRef<HTMLInputElement>(null)

  const close = () => {
    form.resetFields()
    props.editClose()
    setAttachList([])
    setPeopleValue([])
    setNeedValue([])
  }

  const confirm = async () => {
    const data: any = await form.validateFields()

    props.editConfirm(data, props.editId)
    close()
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

      setAttachList((oldAttachList: any) => oldAttachList.concat([result]))
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
      <ProgressWrapUpload
        status={uploadStatus}
        percent={percentVal}
        size="small"
        style={{ display: percentShow ? 'block' : 'none', width: '50%' }}
      />
    )
  }

  const setDefaultValue = async () => {
    const res = await getReportDetail(props.editId)
    setTitle(res.data.info.name)
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
          value: Number(item.associate),
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
    if (props.editId && props.visibleEdit) {
      setDefaultValue()
    }
  }, [props.editId, props.visibleEdit])

  return (
    <CommonModal
      width={784}
      title={props.editId ? title : props.visibleEditText}
      isVisible={props.visibleEdit}
      onClose={close}
      onConfirm={confirm}
      confirmText={t('newlyAdd.submit')}
    >
      <div
        style={{
          height: '600px',
          overflow: 'scroll',
          paddingRight: '4px',
        }}
        ref={leftDom}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={<LabelTitle title={texts[props.type]?.name} />}
            name="info"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Editor height={240} />
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={texts[props.type]?.name2} />}
            name="info2"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Editor height={240} />
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('common.copySend')} />}
            name="people"
          >
            <ChoosePeople initValue={peopleValue} />
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('common.attachment')} />}
            name="attachments"
          >
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
                  <div>{t('p2.addAdjunct') as unknown as string}</div>
                </AddWrap>
              }
            />
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('p2.managingDemand')} />}
            name="needs"
          >
            <RelatedNeed initValue={needValue} />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default WhiteDay
