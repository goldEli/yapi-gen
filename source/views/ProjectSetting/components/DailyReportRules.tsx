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
import { useEffect, useState } from 'react'
import {
  getAily_config,
  set_auto_send_config,
  set_create_config,
  dailyConfigsetProjectConfig,
} from '@/services/dailyAllocation'
import PermissionWrap from '@/components/PermissionWrap'
import moment from 'moment'
import { useSelector } from '@store/index'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { getMessage } from '@/components/Message'

const DailyReportRulesWrap = styled(Form)`
  width: 100%;
  & .ant-form-item {
    padding: 0 32px !important;
  }
  & .ant-form-item-control-input {
    min-height: 18px;
  }
  & .ant-form-item .ant-form-item-label {
    font-size: 14px;
    font-family: SiYuanMedium;
    color: var(--neutral-n1-d1);
    height: 32px;
    line-height: 32px;
    padding: 0;
  }
  & .check-form,
  & .checkBox-form {
    margin-bottom: 0px;
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
  .ant-form-item-label > label {
  }
`
const ReportWrap = styled.div`
  margin: 0 auto;
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
  font-family: SiYuanMedium;
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
    font-family: SiYuanMedium;
  }
  & span:nth-child(2) {
    margin-left: 16px;
    font-size: 14px;
    font-weight: 400;
    font-family: SiYuanRegular;
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
  height: 376px;
  // background: var(--auxiliary-b5);
  border-radius: 6px;
  padding: 12px 0 12px 12px;
`
const Title = styled.div`
  font-size: 14px;
  font-family: SiYuanMedium;
  color: var(--neutral-n1-d1);
`
const Msg = styled.div`
  font-size: 12px;
  font-family: SiYuanRegular;
  color: var(--neutral-n1-d1);
  margin-top: 8px;
  font-family: SiYuanMedium;
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
`
interface CheckBoxGroupType {
  onChange?(val: any): void
  value?: any
  disabled: boolean
}

const DailyReportRules = () => {
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [form3] = Form.useForm()
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const projectId = useSelector(store => store.project.projectInfo.id)
  const [sendDisabled, setSendDisabled] = useState(true)
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [open1, setOpen1] = useState(true)
  const [open2, setOpen2] = useState(true)
  const [open3, setOpen3] = useState(true)
  const [typeId, setTypeId] = useState(0)
  const [formAll, setFormAll] = useState<any>({})

  const plainOptions = () => {
    const arr: any = [
      {
        label: t('formWork.monday'),
        value: 0,
      },
      {
        label: t('formWork.tuesday'),
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
        label: t('formWork.sunday'),
        value: 6,
      },
    ]
    return arr
  }
  const content = () => {
    return (
      <PopoverWrap>
        <Title>{t('msg21')}</Title>
        <Msg>
          {t('msg22')} <span style={{ marginLeft: 8 }}>{t('spent')}：30h</span>
        </Msg>
        <Row>
          <span />
          <span>{t('msg23')}</span>
        </Row>
        <Msg>{t('msg25')}</Msg>
        <Row>
          <span />
          <span>{t('msg26')}</span>
        </Row>
        <Row>
          <span />
          <span>{t('msg27')}</span>
        </Row>
        <Row>
          <span />
          <span>{t('msg28')}</span>
        </Row>
        <Msg>{t('msg29')}</Msg>
        <Row>
          <span />
          <span>{t('msg30')}</span>
        </Row>
        <Row>
          <span />
          <span>{t('msg31')}</span>
        </Row>
        <Line />
        <Msg>{t('question')}</Msg>
        <Row>
          <span />
          <span>{t('noneToday')}</span>
        </Row>
        <Line />
        <Text>{t('msg32')}</Text>
        <Msg1>{t('msg33')}</Msg1>
      </PopoverWrap>
    )
  }
  // 还原代码
  const cancel = (num: number) => {
    const {
      group_name,
      webhook,
      is_auto_generate,
      is_auto_send,
      is_hand_send,
      reminder_time,
      day,
      is_holiday,
      projectConfigWebhook,
      projectConfigGroupName,
    } = formAll
    if (num === 1) {
      form1.setFieldsValue({ group_name, webhook, is_auto_generate })
    } else if (num === 3) {
      form3.setFieldsValue({ projectConfigWebhook, projectConfigGroupName })
    } else {
      is_auto_send === 2 ? setSendDisabled(true) : setSendDisabled(false)
      form2.setFieldsValue({
        is_auto_send,
        is_hand_send,
        day,
        is_holiday,
        reminder_time: moment(reminder_time, 'HH:mm'),
      })
    }
  }
  const save = async (num: number) => {
    const values1: any =
      num === 1 && (await form1.validateFields().catch(e => e))
    const values2: any = num === 2 && (await form2.getFieldsValue())
    const values3: any =
      num === 3 && (await form3.validateFields().catch(e => e))
    if (!values1.errorFields && num === 1) {
      open({
        title: t('msg19'),
        text: t('msg20'),
        onConfirm: async () => {
          const res1 = await set_create_config({
            ...values1,
            id: typeId,
            project_id: projectId,
          })
          if (res1.code === 0) {
            getMessage({ msg: t('common.saveSuccess'), type: 'success' })
          }
        },
      })
    } else if (num === 2) {
      const state = form2.getFieldsValue().is_auto_send === 1
      const days = form2.getFieldsValue().day
      if (days.length < 1) {
        return getMessage({ msg: '发送周期必选', type: 'error' })
      }
      if (state) {
        open({
          title: t('msg19'),
          text: t('msg20'),
          onConfirm: async () => {
            const res2 = await set_auto_send_config({
              ...values2,
              id: typeId,
              project_id: projectId,
            })
            if (res2.code === 0) {
              getMessage({ msg: t('common.saveSuccess'), type: 'success' })
            }
          },
        })
      } else {
        open({
          title: t('msg19'),
          text: t('msg18'),
          onConfirm: async () => {
            const res2 = await set_auto_send_config({
              ...values2,
              id: typeId,
              project_id: projectId,
            })
            if (res2.code === 0) {
              getMessage({ msg: t('common.saveSuccess'), type: 'success' })
            }
          },
        })
      }
    } else if (!values3.errorFields && num === 3) {
      const group_name = form3.getFieldsValue().projectConfigGroupName
      const webhook = form3.getFieldsValue().projectConfigWebhook
      open({
        title: t('msg19'),
        text: t('msg20'),
        onConfirm: async () => {
          const res1 = await dailyConfigsetProjectConfig({
            group_name,
            webhook,
            id: typeId,
            project_id: projectId,
          })
          if (res1.code === 0) {
            getMessage({ msg: t('common.saveSuccess'), type: 'success' })
          }
        },
      })
    }
  }

  const onValuesChange = async () => {
    const values: any = await form1.validateFields().catch(e => e)
    values.errorFields?.length === 0 &&
      form1.setFieldValue('is_auto_generate', 1)
    const state = form2.getFieldsValue().is_auto_send === 1
    setSendDisabled(!state)
  }
  const init = async () => {
    const {
      group_name,
      webhook,
      is_auto_generate,
      is_auto_send,
      is_hand_send,
      reminder_time,
      day,
      is_holiday,
      id,
      projectConfigWebhook,
      projectConfigGroupName,
    } = await getAily_config(projectId)
    setFormAll({
      group_name,
      webhook,
      is_auto_generate,
      is_auto_send,
      is_hand_send,
      reminder_time,
      day,
      is_holiday,
      projectConfigWebhook,
      projectConfigGroupName,
    })
    setTypeId(id)
    form1.setFieldsValue({ group_name, webhook, is_auto_generate })
    is_auto_send === 2 ? setSendDisabled(true) : setSendDisabled(false)
    form2.setFieldsValue({
      is_auto_send,
      is_hand_send,
      day,
      is_holiday,
      reminder_time: moment(reminder_time, 'HH:mm'),
    })
    form3.setFieldsValue({
      projectConfigWebhook,
      projectConfigGroupName,
    })
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
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: '24px 0 0',
      }}
    >
      <PermissionWrap
        auth="b/project/daily_config"
        permission={projectInfo?.projectPermissions?.map(
          (i: any) => i.identity,
        )}
      >
        <ReportWrap>
          <HeaderWrap onClick={() => setOpen1(!open1)}>
            <span>{t('rb')}</span>
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
            <DailyReportRulesWrap
              layout="vertical"
              form={form1}
              onValuesChange={onValuesChange}
            >
              <Form.Item
                style={{ marginTop: 16 }}
                label={t('qm')}
                name="group_name"
                required
                validateFirst
                rules={[
                  { required: true, message: t('q') },
                  {
                    validator: (_, value: string) =>
                      value?.trim()
                        ? Promise.resolve()
                        : Promise.reject(new Error(t('groupError'))),
                  },
                ]}
              >
                <InputStyle placeholder={t('q')} maxLength={100} allowClear />
              </Form.Item>
              <Form.Item
                label={t('dd')}
                name="webhook"
                required
                rules={[
                  {
                    required: true,
                    message: t('p1'),
                    // eslint-disable-next-line
                    pattern: /https:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/,
                  },
                ]}
              >
                <InputStyle placeholder={t('q')} allowClear />
              </Form.Item>
              <Form.Item
                label={t('sc')}
                name="is_auto_generate"
                valuePropName="checked"
                className="check-form"
                getValueFromEvent={getValueFromEvent2}
                getValueProps={getValueProps}
              >
                <Switch />
              </Form.Item>
              <Text1>{t('msg1')}</Text1>
              <Text1> {t('msg2')}</Text1>
              <Text1> {t('msg3')} </Text1>
              <Text1>{t('msg4')}</Text1>
              <Text2>
                <span>{t('msg5')}</span>
                <Popover
                  placement="rightTop"
                  title=""
                  content={content}
                  trigger="click"
                >
                  <span>{t('msg6')}</span>
                </Popover>
              </Text2>
              <Text1>{t('msg7')}</Text1>
              <Text1>{t('msg8')}</Text1>
              <Text1>{t('msg9')}</Text1>
              <Text1>{t('msg10')}</Text1>
              <FooterWrap>
                <CommonButton
                  type="light"
                  style={{ marginRight: '16px' }}
                  onClick={() => cancel(1)}
                >
                  {t('common.cancel')}
                </CommonButton>
                <CommonButton type="primary" onClick={() => save(1)}>
                  {t('formWork.save2')}
                </CommonButton>
              </FooterWrap>
            </DailyReportRulesWrap>
          ) : null}
        </ReportWrap>

        <ReportWrap style={{ marginBottom: 48 }}>
          <HeaderWrap onClick={() => setOpen3(!open3)}>
            <span>{t('xmsc')}</span>
            <IconFont
              type={open1 ? 'up' : 'down'}
              style={{
                color: ' var(--auxiliary-text-t2-d1)',
                fontSize: '8',
                cursor: 'pointer',
              }}
            />
          </HeaderWrap>
          {open3 ? (
            <DailyReportRulesWrap
              layout="vertical"
              form={form3}
              onValuesChange={onValuesChange}
            >
              <Form.Item
                style={{ marginTop: 16 }}
                label={t('qm')}
                name="projectConfigGroupName"
                required
                validateFirst
                rules={[
                  { required: true, message: t('q') },
                  {
                    validator: (_, value: string) =>
                      value?.trim()
                        ? Promise.resolve()
                        : Promise.reject(new Error(t('groupError'))),
                  },
                ]}
              >
                <InputStyle placeholder={t('q')} maxLength={100} allowClear />
              </Form.Item>
              <Form.Item
                label={t('dd')}
                name="projectConfigWebhook"
                required
                rules={[
                  {
                    required: true,
                    message: t('p1'),
                    // eslint-disable-next-line
                    pattern: /https:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/,
                  },
                ]}
              >
                <InputStyle placeholder={t('q')} allowClear />
              </Form.Item>
              <FooterWrap>
                <CommonButton
                  type="light"
                  style={{ marginRight: '16px' }}
                  onClick={() => cancel(3)}
                >
                  {t('common.cancel')}
                </CommonButton>
                <CommonButton type="primary" onClick={() => save(3)}>
                  {t('formWork.save2')}
                </CommonButton>
              </FooterWrap>
            </DailyReportRulesWrap>
          ) : null}
        </ReportWrap>
        <DeleteConfirmModal />
      </PermissionWrap>
    </div>
  )
}

export default DailyReportRules