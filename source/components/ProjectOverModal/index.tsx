/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
import { confirmProjectHand, getHandProjectMember } from '@/services/handover'
import { useSelector } from '@store/index'
import { Form, message, Select } from 'antd'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import CommonModal from '../CommonModal'
import { PinkWrap, Wrap } from './style'

const { Option } = Select

const HandOverModal = (props: any) => {
  const { projectInfo } = useSelector(store => store.project)
  const [form] = Form.useForm()
  const [list, setList] = useState([])

  const init = async () => {
    const res = await getHandProjectMember(props.id.id, projectInfo.id)
    setList(res)
  }
  useEffect(() => {
    if (props.visible) {
      init()
    }
  }, [props.visible])
  const onConfirm = async () => {
    const res = await form.validateFields()

    if (res) {
      const newObj = []
      for (const key in res) {
        newObj.push({
          project_id: Number(key),
          handover_user_id: res[key],
        })
      }

      const res1 = await confirmProjectHand({
        id: props.id.id,
        data: newObj,
        project_id: projectInfo.id,
      })

      if (res1.code === 0) {
        message.success(t('succeed') as string)
        form.resetFields()
        props.close()
        props.confirm()
      }
    }
  }
  return (
    <CommonModal
      title={t('quitAndHandover')}
      onClose={props.close}
      isVisible={props.visible}
      onConfirm={onConfirm}
    >
      <Wrap>
        <PinkWrap>
          {t('please_specify_the_recipient_of_the_project') as string}
        </PinkWrap>
        <Form form={form}>
          {list.map((i: any) => (
            <Form.Item
              rules={[{ required: true, message: '' }]}
              key={i.id}
              name={i.id}
              label={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    style={{
                      width: '30px',
                      height: '30px',
                      objectFit: 'cover',
                      marginRight: '8px',
                      borderRadius: '6px',
                    }}
                    src={i.cover}
                    alt=""
                  />
                  <span
                    style={{
                      textAlign: 'left',
                      display: 'inline-block',
                      width: '191px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {i.name}
                  </span>
                </div>
              }
            >
              <Select
                style={{
                  width: '184px',
                  marginLeft: '48px',
                }}
                placeholder={t('pleaseSelectTheHandoverPerson') as string}
                allowClear
              >
                {i.members.map((k: any) => (
                  <Option key={k.user_id} value={k.user_id}>
                    {k.user_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ))}
        </Form>
      </Wrap>
    </CommonModal>
  )
}

export default HandOverModal
