import React from 'react'
import CommonModal2 from '../CommonModal2'
import styled from '@emotion/styled'
import { Checkbox, Form, Input, Select } from 'antd'
import { LabelTitle } from '@/views/WorkReport/Review/components/style'
import { Editor } from '@xyfe/uikit'
import { uploadFile } from '../AddWorkItem/CreateWorkItemLeft'
import CommonButton from '../CommonButton'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { changeFreedVisibleVisible } from '@store/feedback'
const { Option } = Select
const ModalFooter = styled.div({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 80,

  padding: '0 20px 0 24px',
})

const Wrap = styled.div`
  width: 100%;
  background-image: url('/feedback.png');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`
const LessWrap = styled.div`
  position: relative;
  width: 784px;
  height: 640px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  padding: 40px 24px 80px 24px;
`

const Footer = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
`
const SystemFeedback = () => {
  const dispatch = useDispatch()
  const freedVisible = useSelector(store => store.freed.freedVisible)
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const onConfirm = () => {}
  const onValidator = (rule: any, value: any) => {
    if (
      (value === '<p><br></p>' ||
        value === '<p></p>' ||
        value?.trim() === '' ||
        !value) &&
      rule?.required
    ) {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }
    return Promise.resolve()
  }

  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <CommonModal2
      noFooter
      bodyStyle={{
        height: '100vh',
        minWidth: '1400px',
      }}
      onConfirm={onConfirm}
      onClose={() => {
        dispatch(changeFreedVisibleVisible(false))
      }}
      width="100vw"
      dex={50}
      isShowMask={false}
      isVisible={freedVisible}
      // title={isEditId ? t('edit_item') : t('common.createProject')}
    >
      <Wrap>
        <LessWrap>
          <div
            style={{
              textAlign: 'center',
              fontFamily: 'SiYuanMedium',
              height: '28px',
              fontSize: '20px',
              color: '#323233',
              lineHeight: '28px',
            }}
          >
            Agile的成长，离不开您的建议
          </div>
          <Form form={form} layout="vertical">
            <Form.Item
              label={<LabelTitle>建议类型</LabelTitle>}
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Select placeholder="我想..." allowClear>
                <Option value="male">提供改进建议</Option>
                <Option value="female">提供功能缺陷</Option>
                <Option value="other">提出其他问题</Option>
              </Select>
            </Form.Item>
            <Form.Item
              style={{
                marginBottom: '30px',
              }}
              label={
                <LabelTitle>我们将会非常重视您的想法，感谢您的帮助*</LabelTitle>
              }
              name="content"
              rules={[
                {
                  validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
                  required: true,
                  message: (
                    <div
                      style={{
                        margin: '5px 0',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      味甜希仁
                    </div>
                  ),
                  whitespace: true,
                  validator: onValidator,
                },
              ]}
            >
              <Editor
                upload={uploadFile}
                getSuggestions={() => []}
                placeholder="请输入内容"
              />
            </Form.Item>
          </Form>
          <Footer>
            <Checkbox onChange={onChange}>我希望可以尽快联系我</Checkbox>
            <div
              style={{
                display: 'flex',
                gap: '16px',
              }}
            >
              <CommonButton
                onClick={() => dispatch(changeFreedVisibleVisible(false))}
                type="light"
              >
                {t('common.cancel')}
              </CommonButton>

              <CommonButton type="primary">{t('common.confirm')}</CommonButton>
            </div>
          </Footer>
        </LessWrap>
      </Wrap>
    </CommonModal2>
  )
}

export default SystemFeedback