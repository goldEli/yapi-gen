/* eslint-disable react/jsx-handler-names */
import styled from '@emotion/styled'
import { Form } from 'antd'
import MoreSelect from '@/components/MoreSelect'
import moment from 'moment'
import RangePicker from '@/components/RangePicker'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import Tabs from '@/components/Tabs'
import CommonButton from '@/components/CommonButton'
import { useState } from 'react'
import Export from '@/components/Export'
const WorkHoursHeaderWrap = styled.div`
  padding: 20px 0px 20px 0;
  margin-left: 24px;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
const FormStyle = styled(Form)`
  display: flex;
  justify-content: space-between;
  .ant-form-item {
    margin: 0;
  }
`
const LeftWrap = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
`
const PersonWrap = styled.div`
  margin: 16px 0 28px 24px;
  background: var(--auxiliary-b5);
  border-radius: 6px;
  height: 32px;
  width: 339px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  color: var(--neutral-n2);
`
const WorkHoursHeader = () => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState<any>()
  const confirm = () => {
    console.log(123)
  }
  const onChangeTime = (dates: any) => {
    console.log(dates, 'dates')
    if (dates) {
      const a = [
        moment(dates[0]).unix()
          ? moment(dates[0]).format('YYYY-MM-DD')
          : '1970-01-01',
        moment(dates[1]).unix() === 1893427200
          ? '2030-01-01'
          : moment(dates[1]).format('YYYY-MM-DD'),
      ]
      console.log(a)
      form.setFieldsValue({
        time: [
          moment(dates[0]).unix()
            ? moment(dates[0]).format('YYYY-MM-DD')
            : '1970-01-01',
          moment(dates[1]).unix() === 1893427200
            ? '2030-01-01'
            : moment(dates[1]).format('YYYY-MM-DD'),
        ],
      })
    } else {
      form.setFieldsValue({
        time: null,
      })
    }
  }
  const tabsValue = [
    {
      id: '1',
      text: `${t('new1')}`,
    },
    {
      id: '4',
      text: t('notification'),
    },

    {
      id: '2',
      text: t('atmy'),
    },
    {
      id: '3',
      text: t('all'),
    },
  ]
  const onGetExportApi = () => {
    alert(123)
  }
  return (
    <>
      <WorkHoursHeaderWrap>
        <FormStyle name="basic" form={form} initialValues={{ remember: true }}>
          <LeftWrap>
            <SelectWrapBedeck key="1">
              <span style={{ margin: '0 16px', fontSize: '14px' }}>人员</span>
              <Form.Item name={'ad'}>
                <MoreSelect
                  onConfirm={confirm}
                  options={[
                    {
                      label: t('notChecked'),
                      value: 0,
                      id: 0,
                    },
                    {
                      label: t('itIsChecked'),
                      value: 1,
                      id: 1,
                    },
                  ]}
                />
              </Form.Item>
            </SelectWrapBedeck>
            <SelectWrapBedeck style={{ marginLeft: 16 }}>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>时间</span>
              <Form.Item name={'time'}>
                <RangePicker
                  isShowQuick
                  onChange={dates => onChangeTime(dates)}
                />
              </Form.Item>
            </SelectWrapBedeck>
            <Form.Item name={'c'} style={{ margin: '0 16px' }}>
              <Tabs
                tabsValue={tabsValue}
                onChange={id =>
                  form.setFieldsValue({
                    c: id,
                  })
                }
              />
            </Form.Item>
            <Form.Item name={'d'}>
              <Tabs
                tabsValue={tabsValue}
                onChange={id =>
                  form.setFieldsValue({
                    d: id,
                  })
                }
              />
            </Form.Item>
          </LeftWrap>
          <CommonButton type="primary" onClick={() => setOpen(true)}>
            导出记录
          </CommonButton>
        </FormStyle>
      </WorkHoursHeaderWrap>
      <PersonWrap>
        <span>上报人数:12</span>
        <span>上报人数:12</span>
        <span>上报人数:12</span>
      </PersonWrap>
      {/* 导出 */}
      <Export
        time={`${time?.startTime} ~ ${time?.endTime}`}
        title={t('performance.exportTitle')}
        isVisible={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          alert(123), setOpen(false), onGetExportApi()
        }}
        personData={[]}
      />
    </>
  )
}
export default WorkHoursHeader
