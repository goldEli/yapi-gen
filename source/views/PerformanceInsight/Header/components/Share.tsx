import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import { copyLink } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
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
    copyLink(text, '复制成功！', '复制失败！')
  }
  return (
    <CommonModal
      isShowFooter={true}
      isVisible={props.isVisible}
      title={props.title}
      onClose={props.onClose}
    >
      {save ? (
        <MsgText1>当前视图未保存，分享时将为您保存为“视图”</MsgText1>
      ) : null}
      <FormWrap form={form} layout="vertical" style={{ padding: '0 24px' }}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入用户名或邮箱地址' }]}
        >
          <InputStyle placeholder="请输入用户名或邮箱地址" />
        </Form.Item>
      </FormWrap>

      <TitleMsg>接收人将会收到分享的站内消息</TitleMsg>
      <Form.Item
        name="name"
        rules={[{ required: true, message: '请输入用户名或邮箱地址' }]}
      >
        <TextAreaStyle
          placeholder="添加消息"
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
            复制链接
          </span>
        </Space>
        <Space size={16}>
          <CommonButton type="light" onClick={() => props?.onClose()}>
            {t('common.cancel')}
          </CommonButton>
          <CommonButton type="primary" onClick={() => onConfirm()}>
            分享
          </CommonButton>
        </Space>
      </Footer>
    </CommonModal>
  )
}
export default Share
