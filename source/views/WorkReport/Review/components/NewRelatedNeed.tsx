/* eslint-disable react/jsx-no-leaked-render */
import CustomSelect from '@/components/CustomSelect'
import IconFont from '@/components/IconFont'
import { getMessage } from '@/components/Message'
import { AddWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Form } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const WrapDiv = styled.div`
  .ant-form-item-row {
    display: flex;
    flex-direction: row !important;
  }
  .ant-form-item-label {
    padding: 0px !important;
    padding-right: 12px !important;
  }
  .ant-form-item {
    margin-bottom: 16px;
  }
  .item {
    display: flex;
    align-items: center;
    .relative {
      padding: 0px 8px;
      height: 32px;
      white-space: nowrap;
      color: var(--primary-d2);
      font-size: 14px;
      font-family: SiYuanRegular;
      margin: 0px 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-radius: 6px 6px 6px 6px;
      &:hover {
        background: var(--hover-d2);
      }
      &:active {
        background: var(--auxiliary-b6);
      }
    }
    .cancel {
      padding: 0px 8px;
      height: 32px;
      white-space: nowrap;
      font-size: 14px;
      font-family: SiYuanRegular;
      color: var(--neutral-n2);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6px 6px 6px 6px;
      &:hover {
        background: var(--auxiliary-b4);
      }
      &:active {
        background: var(--auxiliary-b5);
        color: var(--auxiliary-text-t2-d2);
      }
    }
  }
`

const ShowListWrap = styled.div`
  padding: 8px 0px 0px 0px;
  .li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-family: SiYuanRegular;
    color: var(--neutral-n2);
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 6px 6px 6px 6px;
    .closeIcon {
      display: none;
    }
    &:hover {
      background-color: var(--neutral-n8);
    }
    &:hover .closeIcon {
      display: inline-block;
    }
    .left {
      display: inline-flex;
      align-items: center;
    }
    .dot {
      flex-shrink: 0;
      display: inline-block;
      width: 6px;
      height: 6px;
      background: var(--neutral-n2);
      border-radius: 50%;
      margin-right: 8px;
    }
  }
`
const RelatedWrap = styled.div`
  .ant-select-selector {
    max-width: 626px;
  }
`

const NewRelatedNeed = (props: any) => {
  const [lessForm] = Form.useForm()
  const [t] = useTranslation()
  const [chooseList, setChooseList] = useState<any>([])

  const [show, setShow] = useState<boolean>(false)
  const confirm = async () => {
    const data = await lessForm.validateFields()
    const newData = JSON.parse(JSON.stringify(data))
    const result = newData.needs.map((i: any) => ({
      ...i,
      expected_day: props?.data?.find((s: any) => s.id === i.id)?.expected_day,
      user_schedule_percent: props?.data?.find((s: any) => s.id === i.id)
        ?.user_schedule_percent,
      user_today_task_time: props?.data?.find((s: any) => s.id === i.id)
        ?.user_today_task_time,
      user_total_task_time: props?.data?.find((s: any) => s.id === i.id)
        ?.user_total_task_time,
    }))
    const historyData = JSON.parse(JSON.stringify(chooseList))
    if (!props.canSubmit(result)) {
      return
    }
    props.onChange(historyData.concat(result).map((item: any) => item.value))
    setChooseList(historyData.concat(result))
    setTimeout(() => {
      props?.onFilter?.()
    }, 200)
    setShow(false)
    lessForm.resetFields()
    getMessage({ msg: t('p2.need3') as string, type: 'success' })
  }

  const del = (item: any) => {
    const index = chooseList.findIndex((i: any) => i.key === item.key)
    const newData = JSON.parse(JSON.stringify(chooseList))
    newData.splice(index, 1)
    setChooseList(newData)
    props.onChange(newData.map((k: any) => k.value))
    setTimeout(() => {
      props?.onFilter?.()
    }, 200)
  }

  useEffect(() => {
    setChooseList(
      props?.initValue?.map((k: any) => ({
        label: k.name,
        key: k.id,
        value: k.id,
        expected_day: k.expected_day,
        user_schedule_percent: k.user_schedule_percent,
        user_today_task_time: k.user_today_task_time,
        user_total_task_time: k.user_total_task_time,
      })) ?? [],
    )
    props.onChange(props?.initValue?.map((item: any) => item.id))
  }, [props.initValue])

  return (
    <RelatedWrap>
      <AddWrap
        onClick={() => {
          setShow(true)
        }}
        hasColor
      >
        <IconFont type="plus" />
        <div>{t('p2.RelatedRequirements')}</div>
      </AddWrap>
      <ShowListWrap>
        {chooseList.map((item: any) => (
          <div key={item.key} className="li">
            <div className="left">
              <span className="dot" />
              {props?.isShowOverdue && item.expected_day > 0 ? (
                <span>
                  [{t('report.list.overdue')}
                  {item.expected_day}
                  {t('report.list.day')}]
                </span>
              ) : null}
              <span style={{ marginLeft: 2 }}>
                {item.label ? item.label : '--'}
              </span>
              <span style={{ whiteSpace: 'nowrap' }}>
                {`（${
                  item.user_schedule_percent ? item.user_schedule_percent : 0
                }%  ${item.user_today_task_time ?? 0}h）`}
              </span>
            </div>
            <IconFont
              className="closeIcon"
              style={{ color: 'var(--neutral-n3)' }}
              onClick={() => del(item)}
              type="close"
            />
          </div>
        ))}
      </ShowListWrap>
      {show && (
        <WrapDiv>
          <Form form={lessForm}>
            <Form.Item
              name="needs"
              rules={[
                {
                  required: true,
                  message: (
                    <span
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      {t('p2.need1')}
                    </span>
                  ),
                },
              ]}
            >
              <div className="item">
                <CustomSelect
                  optionFilterProp="label"
                  showSearch
                  labelInValue
                  mode="multiple"
                  onChange={(val: any) => {
                    lessForm.setFieldValue('needs', val)
                  }}
                  placeholder={t('common.pleaseSelect')}
                  options={props?.data?.map((i: any) => ({
                    label: i.name,
                    value: i.id,
                  }))}
                />
                <span className="relative" onClick={confirm}>
                  {t('report.list.relevance')}
                </span>
                <span
                  className="cancel"
                  onClick={() => {
                    setShow(false)
                    lessForm.resetFields()
                  }}
                >
                  {t('common.cancel')}
                </span>
              </div>
            </Form.Item>
          </Form>
        </WrapDiv>
      )}
    </RelatedWrap>
  )
}

export default NewRelatedNeed
