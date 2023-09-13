import React, { useEffect, useState } from 'react'
import CommonModal2 from '../CommonModal2'
import styled from '@emotion/styled'
import { Checkbox, Form, Input, Select } from 'antd'
import { LabelTitle } from '@/views/WorkReport/Review/components/style'
import { Editor } from 'ifunuikit'
import { uploadFile } from '../AddWorkItem/CreateWorkItemLeft'
import CommonButton from '../CommonButton'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { changeFreedVisibleVisible } from '@store/feedback'
import { sendFeedback } from '@/services/sysNotice'
import { getMessage } from '../Message'

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
  background-image: url('https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/feedback.jpg');
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

  background: var(--neutral-white-d1);
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
  const [first, setFirst] = useState(false)
  const [t] = useTranslation()
  const [form] = Form.useForm()

  const onConfirm = async () => {
    const res = await form.validateFields()

    const data = await sendFeedback({ ...res, quickly_reply: first ? 1 : 2 })

    if (data.code === 0) {
      getMessage({
        msg: t('submit_successfully') as string,
        type: 'success',
      })
      form.resetFields()
      dispatch(changeFreedVisibleVisible(false))
    }
  }
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
    setFirst(e.target.checked)
  }
  useEffect(() => {
    if (freedVisible) {
      setFirst(false)
    }
  }, [freedVisible])

  return (
    <CommonModal2
      noFooter
      bodyStyle={{
        height: '100vh',
        minWidth: '1400px',
      }}
      onConfirm={() => onConfirm()}
      onClose={() => {
        dispatch(changeFreedVisibleVisible(false))
      }}
      width="100vw"
      dex={143}
      isShowMask={false}
      isVisible={freedVisible}
      // title={isEditId ? t('edit_item') : t('common.createProject')}
    >
      <Wrap
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <LessWrap>
          <div
            style={{
              textAlign: 'center',
              fontFamily: 'SiYuanMedium',
              height: '28px',
              fontSize: '20px',
              color: 'var(--neutral-n1-d1)',
              lineHeight: '28px',
            }}
          >
            {t('agile_growth_suggestion')}
          </div>
          <Form form={form} layout="vertical">
            <Form.Item
              label={<LabelTitle>{t('suggestion_type')}</LabelTitle>}
              name="type"
              rules={[{ required: true, message: t('common.selectType') }]}
            >
              <Select placeholder={t('i_want_to')} allowClear>
                <Option value={1}>{t('provide_improvement_suggestion')}</Option>
                <Option value={2}>{t('provide_bug_report')}</Option>
                <Option value={9}>{t('raise_other_issues')}</Option>
              </Select>
            </Form.Item>

            <Form.Item
              style={{
                marginBottom: '30px',
              }}
              label={<LabelTitle>{t('we_value_your_ideas')}</LabelTitle>}
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
                      {t('enter_content2')}
                    </div>
                  ),
                  whitespace: true,
                  validator: onValidator,
                },
              ]}
            >
              <Editor
                height="366px"
                maxHeight="340px"
                upload={uploadFile}
                getSuggestions={() => []}
                placeholder={t('enter_content2')}
              />
            </Form.Item>
          </Form>
          <Footer>
            <Checkbox onChange={onChange} value={first}>
              {t('i_hope_to_be_contacted_soon')}
            </Checkbox>
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

              <CommonButton onClick={onConfirm} type="primary">
                {t('send')}
              </CommonButton>
            </div>
          </Footer>
        </LessWrap>
      </Wrap>
    </CommonModal2>
  )
}

export default SystemFeedback
