/* eslint-disable react/jsx-no-leaked-render */
import CustomSelect from '@/components/CustomSelect'
import IconFont from '@/components/IconFont'
import { getMessage } from '@/components/Message'
import { AddWrap } from '@/components/StyleCommon'
import { getDemandList, getProjectList } from '@/services/daily'
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
      display: inline-block;
      white-space: nowrap;
      color: var(--primary-d2);
      font-size: 14px;
      font-family: SiYuanRegular;
      margin: 0px 24px;
      cursor: pointer;
    }
    .cancel {
      display: inline-block;
      white-space: nowrap;
      font-size: 14px;
      font-family: SiYuanRegular;
      color: var(--neutral-n2);
      cursor: pointer;
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
    }))
    const historyData = JSON.parse(JSON.stringify(chooseList))

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
      })) ?? [],
    )
    props.onChange(props?.initValue?.map((item: any) => item.id))
  }, [props.initValue])

  return (
    <div>
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
              <span>{item.label}</span>
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
                  关联
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
    </div>
  )
}

export default NewRelatedNeed
