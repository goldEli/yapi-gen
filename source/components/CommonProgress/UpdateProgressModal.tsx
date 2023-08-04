import { useState } from 'react'
import CommonModal from '../CommonModal'
import { useTranslation } from 'react-i18next'
import { ProgressContentWrap, ShowProgress } from './style'
import { AddWrap, SliderWrap } from '../StyleCommon'
import { Form, Input, InputNumber } from 'antd'
import UploadAttach from '../UploadAttach'
import IconFont from '../IconFont'

interface ProgressPropsType {
  type?: 'transaction' | 'demand' | 'flaw'
  visible: boolean
  onClose(): void
}

const UpdateProgressModal = (props: ProgressPropsType) => {
  const [t]: any = useTranslation()
  const [form] = Form.useForm()
  const [inputValue, setInputValue] = useState(0)

  const { type, visible, onClose } = props

  const onChange = (newValue: number) => {
    setInputValue(newValue)
  }
  // 选择附件逻辑处理
  const onChangeAttachment = (result: any) => {
    const arr = result.map((i: any) => {
      return {
        name: i.name,
        url: i.url,
        size: i.size,
        ext: i.ext,
        ctime: i.ctime,
      }
    })

    form.setFieldsValue({
      attach: arr,
    })
  }
  const confirm = async () => {}
  return (
    <CommonModal
      width={640}
      title="更新进度"
      isVisible={visible}
      onClose={onClose}
      onConfirm={confirm}
      confirmText="更新"
    >
      <ProgressContentWrap>
        <div className="tips">建议不要低于当前进度</div>
        <ShowProgress>
          <span>当前进度 50%</span>
          <span className="processor">处理人</span>
          <span className="username">狗小浦</span>
        </ShowProgress>
        <div className="progressBox">
          <div>当日进度（2023-07-25）</div>
          <div className="progress">
            <SliderWrap
              value={inputValue}
              className="slider"
              onChange={onChange}
              tooltip={{ formatter: (val: any) => `${val}%` }}
            />
            <InputNumber
              className="inputNumber"
              min={0}
              max={100}
              style={{ margin: '0 16px' }}
              value={inputValue}
              onBlur={(event: any) => {
                onChange(Number(event?.target?.value))
              }}
              onPressEnter={(event: any) => {
                onChange(Number(event?.target?.value))
              }}
            />
          </div>
        </div>
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item label="实际工时花费（h）" name="time">
            <InputNumber
              min={0.0}
              style={{ width: '100%' }}
              placeholder="实际工时"
              step={0.01}
            />
          </Form.Item>
          <Form.Item label="更新说明" name="name">
            <Input.TextArea
              maxLength={600}
              autoSize={{ minRows: 5, maxRows: 5 }}
              placeholder={t('common.pleaseEnter')}
            />
          </Form.Item>
          <Form.Item label="附件" name="attach">
            <UploadAttach
              power
              defaultList={[]}
              onChangeAttachment={(res: any) => {
                onChangeAttachment(res)
              }}
              addWrap={
                <AddWrap hasColor>
                  <IconFont type="plus" />
                  <div>{t('p2.addAdjunct') as unknown as string}</div>
                </AddWrap>
              }
            />
          </Form.Item>
        </Form>
      </ProgressContentWrap>
    </CommonModal>
  )
}

export default UpdateProgressModal
