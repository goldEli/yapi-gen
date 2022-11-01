/* eslint-disable no-negated-condition */
import IconFont from '@/components/IconFont'
import { AddWrap } from '@/components/StyleCommon'
import { getDemandList, getProjectList } from '@/services/daily'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, Select } from 'antd'
import { useEffect, useState } from 'react'
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
  const [projectId, setProjectId] = useState<any>(null)
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
  }

  const del = (item: any) => {
    const index = chooseList.findIndex((i: any) => i.key === item.key)
    const newData = structuredClone(chooseList)
    newData.splice(index, 1)
    setChooseList(newData)
    props.onChange(newData)
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

  const onSelect = async (i: any) => {
    lessForm.setFieldsValue({
      needs: [],
    })
    setShowNeed(false)

    getNeedList(i.value)
  }

  return (
    <div>
      <AddWrap onClick={() => setShow(true)} hasColor>
        <IconFont type="plus" />
        <div>关联需求</div>
      </AddWrap>
      {!show ? (
        <div>
          {chooseList.map((item: any) => (
            <InnerLine key={item.key}>
              <span>{item.label}</span>
              <IconFont
                onClick={() => del(item)}
                data-close
                className={rightText}
                type="close"
              />
            </InnerLine>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: '#F2F2F4',
            borderRadius: '6px 6px 6px 6px',
            padding: '24px',
          }}
        >
          <Form form={lessForm} layout="vertical">
            <Form.Item
              name="project"
              label="选择项目"
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <Select
                onSelect={onSelect}
                labelInValue
                placeholder="Please select favourite colors"
              >
                {projectList.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
              name="needs"
              label="管理需求"
            >
              <Select
                disabled={showNeed}
                showSearch
                labelInValue
                mode="multiple"
                placeholder="Please select favourite colors"
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
              }}
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#2877FF',
                cursor: 'pointer',
              }}
            >
              取消
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
              完成
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default RelatedNeed
