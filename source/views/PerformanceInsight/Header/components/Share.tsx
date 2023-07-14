import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import { copyLink } from '@/tools'
import { useSelector } from '@store/index'
import { Form, Space } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FormWrap,
  MsgText1,
  TitleMsg,
  InputStyle,
  Footer,
  TextAreaStyle,
} from '../Style'

interface PropsType {
  isVisible: boolean
  onConfirm: (form: { email: string; main: string }) => void
  onClose: () => void
  save: boolean
  title: string
}
const Share = (props: PropsType) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const { save } = useSelector(store => store.performanceInsight)
  const onConfirm = async () => {
    await form.validateFields()
    const formValues = form.getFieldsValue()
    props.onConfirm(formValues.name)
  }
  useEffect(() => {
    props.isVisible && form.resetFields()
  }, [props.isVisible])
  // 复制链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    // 看后面这个页面需要的参数合并,具体的某个路径
    // const params = encryptPhp(
    //   JSON.stringify({
    //     id: props.record.project_id,
    //     demandId: props.record.id,
    //   }),
    // )
    // const url = `/ProjectManagement/DemandDetail?data=${params}`
    // text += `${beforeUrl}${url} \n`
    copyLink(text, t('common.copySuccess'), t('common.copyFail'))
  }
  return (
    <CommonModal
      isShowFooter={true}
      isVisible={props.isVisible}
      title={props.title}
      onClose={props.onClose}
    >
      {save ? <MsgText1>{t('common.copySuccess')}</MsgText1> : null}
      <FormWrap form={form} layout="vertical" style={{ padding: '0 24px' }}>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: t('please_enter_a_username_or_email_address'),
            },
          ]}
        >
          <InputStyle
            placeholder={t('please_enter_a_username_or_email_address')}
          />
        </Form.Item>
      </FormWrap>

      <TitleMsg>
        {t('the_recipient_will_receive_the_shared_site_message')}
      </TitleMsg>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: t('please_enter_a_username_or_email_address'),
          },
        ]}
      >
        <TextAreaStyle
          placeholder={t('add_message')}
          autoSize={{ minRows: 8, maxRows: 100 }}
        />
      </Form.Item>
      <Footer>
        <Space size={6} onClick={onCopyLink}>
          <CommonIconFont
            type={'link'}
            size={16}
            color="var(--auxiliary-text-t2-d1)"
          />
          <span
            style={{ color: 'var(--auxiliary-text-t2-d1)', cursor: 'pointer' }}
          >
            {t('copy_title_link')}
          </span>
        </Space>
        <Space size={16}>
          <CommonButton type="light" onClick={() => props?.onClose()}>
            {t('common.cancel')}
          </CommonButton>
          <CommonButton type="primary" onClick={() => onConfirm()}>
            {t('share')}
          </CommonButton>
        </Space>
      </Footer>
    </CommonModal>
  )
}
export default Share
