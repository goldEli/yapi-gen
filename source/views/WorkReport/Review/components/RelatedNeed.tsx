/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
// 写日志中的关联需求

/* eslint-disable react/jsx-no-leaked-render */
import CustomSelect from '@/components/CustomSelect'
import IconFont from '@/components/IconFont'
import { getMessage } from '@/components/Message'
import { AddWrap } from '@/components/StyleCommon'
import { getDemandList, getProjectList } from '@/services/daily'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, message, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const InnerLine = styled.div`
  &:hover {
    [data-close] {
      visibility: visible;
    }
  }
`

const rightText = css`
  cursor: pointer;
  box-sizing: border-box;
  visibility: hidden;
  font-size: 16px;
  margin-left: 30px;
  color: var(--neutral-n3);
  &:hover {
    color: var(--primary-d2);
  }
`
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
`

const RelatedNeed = (props: any) => {
  const [lessForm] = Form.useForm()
  const [t] = useTranslation()
  const [chooseList, setChooseList] = useState<any>([])
  const [projectList, setProjectList] = useState<any>([])
  const [demandList, setDemandList] = useState<any>([])
  const [show, setShow] = useState<boolean>(false)
  const [showNeed, setShowNeed] = useState<boolean>(true)

  const confirm = async () => {
    const data = await lessForm.validateFields()
    const newData = JSON.parse(JSON.stringify(data))
    const result = newData.needs.map((i: any) => ({
      ...i,
      ...{
        story_prefix_key: demandList?.filter((k: any) => k.id === i.value)[0]
          ?.story_prefix_key,
      },
    }))
    const historyData = JSON.parse(JSON.stringify(chooseList))
    if (historyData.length >= 1) {
      props.onChange(historyData.concat(result).map((item: any) => item.value))
      setChooseList(historyData.concat(result))
    } else {
      props.onChange(result.map((item: any) => item.value))
      setChooseList(result)
    }

    setShow(false)
    setShowNeed(true)
    lessForm.resetFields()
    getMessage({ msg: t('p2.need3') as string, type: 'success' })
  }

  const del = (item: any) => {
    const index = chooseList.findIndex((i: any) => i.key === item.key)
    const newData = JSON.parse(JSON.stringify(chooseList))
    newData.splice(index, 1)
    setChooseList(newData)
    props.onChange(newData.map((k: any) => k.value))
  }

  const init = async () => {
    const res = await getProjectList()
    setProjectList(res)
  }
  const getNeedList = async (value: any) => {
    const res = await getDemandList(value)
    setDemandList(res.data)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    setChooseList(props.initValue)
    props.onChange(props.initValue.map((item: any) => item.value))
  }, [props.initValue])

  const onSelect = async (i: any) => {
    lessForm.setFieldsValue({
      needs: [],
    })
    setShowNeed(false)

    getNeedList(i.value)
  }

  return (
    <div>
      <AddWrap
        onClick={() => {
          setShow(true)
          props?.onBootom()
        }}
        hasColor
      >
        <IconFont type="plus" />
        <div>{t('p2.RelatedRequirements')}</div>
      </AddWrap>
      {show && (
        <WrapDiv
          style={{
            background: 'var(--neutral-n7)',
            borderRadius: '6px 6px 6px 6px',
            padding: '24px',
          }}
        >
          <Form form={lessForm}>
            <Form.Item
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
              name="project"
              label={t('common.chooseProject')}
            >
              <CustomSelect
                optionFilterProp="label"
                showSearch
                onSelect={onSelect}
                labelInValue
                placeholder={t('common.pleaseSelect')}
                options={projectList.map((i: any) => ({
                  label: i.title,
                  value: i.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: (
                    <span
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      {t('p2.need2')}
                    </span>
                  ),
                },
              ]}
              name="needs"
              label={t('p2.managingDemand')}
            >
              <CustomSelect
                disabled={showNeed}
                optionFilterProp="label"
                showSearch
                labelInValue
                mode="multiple"
                placeholder={t('common.pleaseSelect')}
                options={demandList.map((i: any) => ({
                  label: i.name,
                  value: i.id,
                }))}
              />
            </Form.Item>
          </Form>
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <span
              onClick={() => {
                setShowNeed(true)
                setShow(false)
                lessForm.resetFields()
              }}
              style={{
                fontSize: '14px',
                fontFamily: 'SiYuanMedium',
                color: 'var( --primary-d2)',
                cursor: 'pointer',
              }}
            >
              {t('common.cancel')}
            </span>
            <span
              onClick={confirm}
              style={{
                marginLeft: '24px',
                fontSize: '14px',
                fontFamily: 'SiYuanMedium',
                color: 'var( --primary-d2)',
                cursor: 'pointer',
              }}
            >
              {t('container.finish')}
            </span>
          </div>
        </WrapDiv>
      )}
      {!show && (
        <div>
          {chooseList.map((item: any) => (
            <InnerLine key={item.key}>
              <span>
                【{item.story_prefix_key}】{item.label}
              </span>
              <IconFont
                onClick={() => del(item)}
                data-close
                className={rightText}
                type="close"
              />
            </InnerLine>
          ))}
        </div>
      )}
    </div>
  )
}

export default RelatedNeed
