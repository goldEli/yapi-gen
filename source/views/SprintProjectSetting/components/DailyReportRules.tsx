/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import {
  Form,
  Input,
  Switch,
  Popover,
  Checkbox,
  TimePicker,
  message,
} from 'antd'
import { useTranslation } from 'react-i18next'
import CommonButton from '@/components/CommonButton'
import { throttle } from 'lodash'
import { useEffect, useState } from 'react'
import moment from 'moment'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  getAily_config,
  set_auto_send_config,
  set_create_config,
} from '@/services/dailyAllocation'
import { useSelector } from '@store/index'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
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
  min-width: 310px;
  height: 326px;
  background: var(--auxiliary-b5);
  border-radius: 6px;
  padding: 12px 0 12px 12px;
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
  margin-top: 8px;
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

const DailyReportRules = () => {
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [t] = useTranslation()
  const projectId = useSelector(store => store.project.projectInfo.id)
  const [sendDisabled, setSendDisabled] = useState(true)
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [autoDisabled, setAutoDisabled] = useState(true)
  const [open1, setOpen1] = useState(true)
  const [open2, setOpen2] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState(0)
  const [typeId, setTypeId] = useState(0)
  const plainOptions = () => {
    const arr: any = [
      {
        label: t('formWork.monday'),
        value: 0,
      },
      {
        label: t('formWork.monday'),
        value: 1,
      },
      {
        label: t('formWork.wednesday'),
        value: 2,
      },
      {
        label: t('formWork.thursday'),
        value: 3,
      },
      {
        label: t('formWork.friday'),
        value: 4,
      },
      {
        label: t('formWork.saturday'),
        value: 5,
      },
      {
        label: t('formWork.monday'),
        value: 6,
      },
    ]
    return arr
    // .map((i: any) => {
    //   return {
    //     label: t(`formWork.${i.label??'sunday'}`),
    //     value: i.value,
    //   }
    // })
  }
  const content = () => {
    return (
      <PopoverWrap>
        <Title>XXX 07月25日 项目汇报【IFUN Agile】</Title>
        <Msg>总体进度：20%</Msg>
        <Row>
          <span />
          <span>任务完成度：10/50</span>
        </Row>
        <Row>
          <span />
          <span>昨日任务：新增6个，完成3个</span>
        </Row>
        <Msg>今日截止：3个</Msg>
        <Row>
          <span />
          <span>梳理敏捷测试方案及流程（50%）</span>
        </Row>
        <Row>
          <span />
          <span>对已完成的设计，优化交互流程和视觉方案（10%）</span>
        </Row>
        <Row>
          <span />
          <span>试用版功能回归（20%）</span>
        </Row>
        <Msg>逾期任务：2个</Msg>
        <Row>
          <span />
          <span>[逾1天]敏捷需求列表排序</span>
        </Row>
        <Row>
          <span />
          <span>[逾3天]项目列表缩略图优化</span>
        </Row>
        <Line />
        <Text>【进入项目】</Text>
        <Msg1>数据源自IFUN敏捷系统 Powered By IFUN Agile</Msg1>
      </PopoverWrap>
    )
  }

  const save = async (num: number) => {
    const values1: any = await form1.validateFields().catch(e => e)
    const values2: any = await form2.validateFields().catch(e => e)
    setType(num)

    if (!values1.errorFields && num === 1) {
      open({
        title: '保存提示',
        text: '是否保存本次修改内容',
        onConfirm: async () => {
          const res1 = await set_create_config({
            ...values1,
            id: typeId,
            project_id: projectId,
          })
          if (res1.code === 0) {
            message.success('成功')
          }
          console.log(res1)
        },
      })
    } else if (num === 2) {
      open({
        title: '保存提示',
        text: '是否保存本次修改内容',
        onConfirm: async () => {
          const res2 = await set_auto_send_config({
            ...values2,
            id: typeId,
            project_id: projectId,
          })
          if (res2.code === 0) {
            message.success('成功')
          }
          console.log(res2)
        },
      })
    }
  }

  const onValuesChange = async () => {
    const a = form2.getFieldsValue().is_auto_send === 1

    setSendDisabled(!a)
  }

  const init = async () => {
    const {
      is_auto_generate,
      id,
      is_auto_send,
      is_hand_send,
      config: { group_name, webhook },
    } = await getAily_config(projectId)

    setTypeId(id)
    form1.setFieldsValue({ group_name, webhook, is_auto_generate })
    form2.setFieldsValue({ is_auto_send, is_hand_send })
  }
  const getValueFromEvent = (e: any) => {
    return e.target.checked ? 1 : 2
  }
  const getValueFromEvent2 = (checked: any) => {
    return checked ? 1 : 2
  }

  const getValueProps = (value: any) => {
    return { checked: value === 1 }
  }
  useEffect(() => {
    init()
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
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
        {open1 ? (
          <DailyReportRulesWrap layout="vertical" form={form1}>
            <Form.Item
              label="群名称"
              name="group_name"
              required
              rules={[{ required: true, message: '请输入' }]}
            >
              <InputStyle placeholder="请输入" maxLength={100} allowClear />
            </Form.Item>
            <Form.Item
              label="钉钉webhook地址"
              name="webhook"
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
            <Form.Item
              label="是否自动生成"
              name="is_auto_generate"
              valuePropName="checked"
              className="check-form"
              getValueFromEvent={getValueFromEvent2}
              getValueProps={getValueProps}
            >
              <Switch />
            </Form.Item>
            <Text1>生成条件</Text1>
            <Text1> 条件一：在预计开始日期之后的任务（含当日）</Text1>
            <Text1> 条件二 ：该任务处于进行中或当日已完成 </Text1>
            <Text1>条件三 ：该任务指派了处理人，且任务标题大于4个字符</Text1>
            <Text2>
              <span>生成示例</span>
              <Popover
                placement="rightTop"
                title=""
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
              <CommonButton type="primary" onClick={() => save(1)}>
                保存
              </CommonButton>
            </FooterWrap>
          </DailyReportRulesWrap>
        ) : null}
      </ReportWrap>

      <ReportWrap style={{ marginBottom: 48 }}>
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

        {open2 ? (
          <DailyReportRulesWrap
            layout="vertical"
            form={form2}
            onValuesChange={onValuesChange}
          >
            <Form.Item
              label="自动发送配置"
              name="is_auto_send"
              className="check-form"
              valuePropName="checked"
              getValueFromEvent={getValueFromEvent2}
              getValueProps={getValueProps}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="发送周期"
              name="is_holiday"
              className="checkBox-form"
              valuePropName="checked"
              getValueFromEvent={getValueFromEvent}
              getValueProps={getValueProps}
            >
              <Checkbox disabled={sendDisabled}>
                跟随中国法定节假日自动调整
              </Checkbox>
            </Form.Item>
            <Form.Item
              name="day"
              style={{
                marginBottom: '32px',
              }}
            >
              <Checkbox.Group
                options={plainOptions()}
                disabled={sendDisabled}
              />
            </Form.Item>
            <Form.Item label="发送时间" name="reminder_time">
              <TimePicker
                style={{ width: 320 }}
                format="HH:mm"
                disabled={sendDisabled}
              />
            </Form.Item>
            <Form.Item
              label="手动发送配置"
              name="is_hand_send"
              className="checkBox-form"
              valuePropName="checked"
              getValueFromEvent={getValueFromEvent}
              getValueProps={getValueProps}
            >
              <Checkbox disabled={sendDisabled}>是否允许成员手动发送</Checkbox>
            </Form.Item>
            <FooterWrap>
              <CommonButton type="light" style={{ marginRight: '16px' }}>
                取消
              </CommonButton>

              <CommonButton type="primary" onClick={() => save(2)}>
                保存
              </CommonButton>
            </FooterWrap>
          </DailyReportRulesWrap>
        ) : null}
      </ReportWrap>
      <DeleteConfirmModal />
    </div>
  )
}

export default DailyReportRules
