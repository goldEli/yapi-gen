/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Form, Input, Switch, Popover, Checkbox, TimePicker } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonButton from '@/components/CommonButton'
import { throttle } from 'lodash'
import { useEffect, useState } from 'react'
import moment from 'moment'
const DailyReportRulesWrap = styled(Form)`
  width: 100%;
  & .ant-form-item {
    padding: 0 32px !important;
  }
  & .ant-form-item .ant-form-item-label {
    font-size: 14px;
    font-family: SiYuanRegular;
    color: var(--neutral-n1-d1);
    height: 32px;
    line-height: 32px;
    padding: 0;
  }
  & .check-form,
  & .checkBox-form {
    margin-bottom: 8px;
  }
  & .check-form .ant-row {
    min-width: 100%;
    flex-direction: row;
    flex-wrap: initial;
    display: flex;
    align-items: center;
    height: 22px;
  }
  & .ant-form-item-label {
    min-width: 100px;
  }
`
const ReportWrap = styled.div`
  margin: 0 124px;
  width: 992px;
  height: auto;
  background: var(--neutral-white-d4);
  border-radius: 12px;
  border: 1px solid var(--neutral-n6-d1);
  margin-bottom: 24px;
`
const HeaderWrap = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  padding: 32px;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  font-size: 16px;
  font-family: SiYuanRegular;
  color: var(--neutral-n1-d1);
  &:hover {
    background: var(--hover-d2);
    cursor: pointer;
  }
`
const InputStyle = styled(Input)`
  width: 100%;
  height: 32ps;
`
const Text1 = styled.div`
  padding: 0 32px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
`
const Text2 = styled.div`
  display: flex;
  padding: 32px 32px 0 32px;
  & span {
    font-size: 14px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanRegular;
  }
  & span:nth-child(2) {
    margin-left: 16px;
    font-size: 14px;
    font-weight: 400;
    color: var(--auxiliary-text-t2-d2);
  }
  & span:nth-child(2):hover {
    cursor: pointer;
  }
`
const FooterWrap = styled.div`
  display: flex;
  margin: 20px 32px 20px 32px;
  justify-content: flex-end;
`
const PopoverWrap = styled.div`
  width: 310px;
  height: 326px;
  background: var(--auxiliary-b5);
  border-radius: 6px;
  padding: 12px;
`
const Title = styled.div`
  font-size: 14px;
  font-family: SiYuanRegular;
  color: var(--neutral-n1-d1);
`
const Msg = styled.div`
  font-size: 12px;
  font-family: SiYuanRegular;
  color: var(--neutral-n1-d1);
`
const Msg1 = styled.div`
  color: var(--neutral-n3);
  font-size: 10px;
  height: 32px;
  line-height: 32px;
`
const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  & span:nth-child(1) {
    display: inline-block;
    width: 4px;
    height: 4px;
    background: var(--neutral-n2);
    border-radius: 50%;
    margin-right: 8px;
  }
  & span:nth-child(2) {
    font-size: 12px;
    color: var(--neutral-n2);
  }
`
const Line = styled.div`
  width: 286px;
  border-bottom: 1px solid var(--neutral-n6-d1);
  margin: 8px 0;
`
const Text = styled.div`
  color: var(--primary-d1);
  &:hover {
    cursor: pointer;
  }
`
interface CheckBoxGroupType {
  onChange?(val: any): void
  value?: any
  disabled: boolean
}
const CheckBoxGroup = (props: CheckBoxGroupType) => {
  const [t]: any = useTranslation()
  const onChange = throttle(
    (value: boolean, el1: { value: boolean; key: number }) => {
      const filterVal = props?.value.map(
        (item: { value: boolean; key: number }) => ({
          ...item,
          value: el1.key === item.key ? value : item.value,
        }),
      )
      props.onChange?.(filterVal)
    },
    500,
  )
  return (
    <>
      {props.value?.map(
        (el: { value: boolean; key: number; label: string }) => (
          <Checkbox
            disabled={props.disabled}
            key={el.key}
            onChange={e => onChange(e.target.checked, el)}
            checked={el.value}
          >
            {t(`formWork.${el.label}`)}
          </Checkbox>
        ),
      )}
    </>
  )
}

const DailyReportRules = () => {
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [t] = useTranslation()
  const [sendDisabled, setSendDisabled] = useState(true)
  const [autoDisabled, setAutoDisabled] = useState(true)
  const [open1, setOpen1] = useState(true)
  const [open2, setOpen2] = useState(true)
  const content = () => {
    return (
      <PopoverWrap>
        <Title>杨春平 07月25日 项目汇报【IFUN Agile】</Title>
        <Msg>总体进度：20%</Msg>
        <Row>
          <span />
          <span>1111111</span>
        </Row>
        <Row>
          <span />
          <span>1111111</span>
        </Row>
        <Line />
        <Text>【进入项目】</Text>
        <Msg1>数据源自IFUN敏捷系统 Powered By IFUN Agile</Msg1>
      </PopoverWrap>
    )
  }

  const save = async () => {
    const values: any = await form1.validateFields().catch(e => e)
    console.log(values)
    // if (!values.errorFields) {}
  }

  const onValuesChange = async () => {
    const a = form2.getFieldsValue().s
    const values: any = await form1.validateFields().catch(e => e)
    console.log(values)
    if (values.errorFields.length) {
      form1.setFieldsValue({ adv: false })
      setAutoDisabled(true)
    } else {
      form1.setFieldsValue({ adv: true })
      setAutoDisabled(false)
    }
    setSendDisabled(!a)
  }

  useEffect(() => {
    form1.setFieldsValue({ adv: false })
    form2.setFieldsValue({
      '5': true,
      '6': [
        {
          label: 'monday',
          value: true,
        },
        {
          label: 'monday',
          value: true,
        },
        {
          label: 'wednesday',
          value: true,
        },
        {
          label: 'thursday',
          value: true,
        },
        {
          label: 'friday',
          value: true,
        },
        {
          label: 'saturday',
          value: false,
        },
        {
          label: 'sunday',
          value: false,
        },
      ],
      q: moment('18:28:00', 'HH:mm'),
    })
  }, [])
  const SwitchWrap = (props: any) => {
    return (
      <Switch
        checked={props.value}
        onChange={(val: boolean) => props.onChange(val)}
      />
    )
  }
  const CheckboxWrap = (props: any) => {
    return (
      <Checkbox
        checked={props.value}
        onChange={val => props.onChange(val.target.checked)}
        disabled={props.disabled}
      >
        {props.text}
      </Checkbox>
    )
    return <Switch />
  }
  return (
    <>
      <ReportWrap>
        <HeaderWrap onClick={() => setOpen1(!open1)}>
          <span>日报生成配置</span>
          <IconFont
            type={open1 ? 'up' : 'down'}
            style={{
              color: ' var(--auxiliary-text-t2-d1)',
              fontSize: '8',
              cursor: 'pointer',
            }}
          />
        </HeaderWrap>
        {open1 && (
          <DailyReportRulesWrap
            layout="vertical"
            form={form1}
            onValuesChange={onValuesChange}
          >
            <Form.Item
              label="群名称"
              name="a"
              required
              rules={[{ required: true, message: '请输入' }]}
            >
              <InputStyle placeholder="请输入" maxLength={100} allowClear />
            </Form.Item>
            <Form.Item
              label="钉钉webhook地址"
              name="b"
              required
              rules={[
                {
                  required: true,
                  message: '请输入',
                  // eslint-disable-next-line
                  pattern: /https:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/,
                },
              ]}
            >
              <InputStyle placeholder="请输入" allowClear />
            </Form.Item>
            {form1.getFieldsValue().adv}
            <Form.Item label="是否自动生成" name="adv" className="check-form">
              <SwitchWrap />
            </Form.Item>
            <Text1>生成条件</Text1>
            <Text1> 条件一：在预计开始日期之后的任务（含当日）</Text1>
            <Text1> 条件二 ：该任务处于进行中或当日已完成 </Text1>
            <Text1>条件三 ：该任务指派了处理人，且任务标题大于4个字符</Text1>
            <Text2>
              <span>生成示例</span>
              <Popover
                placement="rightTop"
                title={''}
                content={content}
                trigger="click"
              >
                <span>查看示例图</span>
              </Popover>
            </Text2>
            <Text1>生成规则：</Text1>
            <Text1>
              总体进度：根据每事务的完成状态自动统计完成度（例如50个任务完成了10个，就是20%){' '}
            </Text1>
            <Text1>
              {' '}
              今日截至：根据当日任务状态统计 进行中或当日已完成的任务标题{' '}
            </Text1>
            <Text1>逾期任务：根据当日与预计结束日期进行冲减</Text1>
            <FooterWrap>
              <CommonButton type="light" style={{ marginRight: '16px' }}>
                取消
              </CommonButton>
              <CommonButton
                isDisable={autoDisabled}
                type="primary"
                onClick={save}
              >
                保存
              </CommonButton>
            </FooterWrap>
          </DailyReportRulesWrap>
        )}
      </ReportWrap>

      <ReportWrap>
        <HeaderWrap onClick={() => setOpen2(!open2)}>
          <span>自动发送配置</span>
          <IconFont
            type={open2 ? 'up' : 'down'}
            style={{
              color: ' var(--auxiliary-text-t2-d1)',
              fontSize: '8',
              cursor: 'pointer',
            }}
          />
        </HeaderWrap>

        {open2 && (
          <DailyReportRulesWrap
            layout="vertical"
            form={form2}
            onValuesChange={onValuesChange}
          >
            <Form.Item label="自动发送配置" name="s" className="check-form">
              <Switch />
            </Form.Item>
            <Form.Item label="发送周期" name="5" className="checkBox-form">
              <CheckboxWrap
                disabled={sendDisabled}
                text={'跟随中国法定节假日自动调整'}
              />
            </Form.Item>
            <Form.Item
              name="6"
              style={{
                marginBottom: '32px',
              }}
            >
              <CheckBoxGroup disabled={sendDisabled} />
            </Form.Item>
            <Form.Item label={'发送时间'} name="q">
              <TimePicker
                style={{ width: 320 }}
                format={'HH:mm'}
                disabled={sendDisabled}
              />
            </Form.Item>
            <Form.Item label="手动发送配置" name="8" className="checkBox-form">
              <Checkbox disabled={sendDisabled}>是否允许成员手动发送</Checkbox>
            </Form.Item>
            <FooterWrap>
              <CommonButton type="light" style={{ marginRight: '16px' }}>
                取消
              </CommonButton>

              <CommonButton
                type="primary"
                onClick={save}
                isDisable={sendDisabled}
              >
                保存
              </CommonButton>
            </FooterWrap>
          </DailyReportRulesWrap>
        )}
      </ReportWrap>
    </>
  )
}

export default DailyReportRules
