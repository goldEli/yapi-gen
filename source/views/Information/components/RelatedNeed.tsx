import IconFont from '@/components/IconFont'
import { AddWrap } from '@/components/StyleCommon'
import { getDemandList, getProjectList } from '@/services/daily'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, message, Select } from 'antd'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useTranslation } from 'react-i18next'

const { Option } = Select

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
  color: #969799;
  &:hover {
    color: #2877ff;
  }
`
const WrapDiv = styled.div`
  .ant-form-item-row {
    display: flex;
    flex-direction: row !important;
    /* align-items: center; */
  }
  .ant-form-item-label {
    padding: 0px !important;
    padding-right: 12px !important;
  }
  .ant-form-item {
    margin-bottom: 16px;
  }
`
const list = [
  {
    title: '普通会员',
    id: 1,
  },
  {
    title: '飞机',
    id: 2,
  },
  {
    title: '大炮',
    id: 30,
  },
  {
    title: '坦克',
    id: 5,
  },
  {
    title: '直升机',
    id: 3,
  },
  {
    title: '战斗机',
    id: 4,
  },
]
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
    const newData = structuredClone(data)
    const historyData = structuredClone(chooseList)
    if (historyData.length >= 1) {
      props.onChange(
        historyData.concat(newData.needs).map((item: any) => item.value),
      )
      setChooseList(historyData.concat(newData.needs))
    } else {
      props.onChange(newData.needs.map((item: any) => item.value))
      setChooseList(newData.needs)
    }

    setShow(false)
    setShowNeed(true)
    lessForm.resetFields()
    message.success(t('p2.need3'))
  }

  const del = (item: any) => {
    const index = chooseList.findIndex((i: any) => i.key === item.key)
    const newData = structuredClone(chooseList)
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

    // console.log(res)

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
          props.onBootom()
        }}
        hasColor
      >
        <IconFont type="plus" />
        <div>{t('p2.RelatedRequirements')}</div>
      </AddWrap>
      {show ? (
        <WrapDiv
          style={{
            background: '#F2F2F4',
            borderRadius: '6px 6px 6px 6px',
            padding: '24px',
          }}
        >
          <Form form={lessForm}>
            <Form.Item
              rules={[{ required: true, message: t('p2.need1') }]}
              name="project"
              label={t('common.chooseProject')}
            >
              <Select
                onSelect={onSelect}
                labelInValue
                placeholder={t('common.pleaseSelect')}
              >
                {projectList.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: t('p2.need2') }]}
              name="needs"
              label={t('p2.managingDemand')}
            >
              <Select
                disabled={showNeed}
                showSearch
                labelInValue
                mode="multiple"
                placeholder={t('common.pleaseSelect')}
              >
                {demandList.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
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
                fontWeight: 'bold',
                color: '#2877FF',
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
                fontWeight: 'bold',
                color: '#2877FF',
                cursor: 'pointer',
              }}
            >
              {t('container.finish')}
            </span>
          </div>
        </WrapDiv>
      ) : (
        <div>
          {chooseList.map((item: any) => (
            <InnerLine key={item.key}>
              <span>
                【{item.value}】{item.label}
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
