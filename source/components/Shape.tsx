/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Select, Button, Form, Input } from 'antd'
import { useModel } from '@/models'

const { Option } = Select
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

const Left = styled.div`
  width: 120px;
  min-height: 316px;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;

  align-items: center;
  border-right: 1px solid #ebedf0;
`
const Right = styled.div`
  box-sizing: border-box;
  padding-left: 24px;
  width: 354px;
  min-height: 316px;
`
const Contain = styled.div`
  position: relative;
  width: 475px;
  min-height: 316px;
  display: flex;
`
const StyledShape = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  min-width: 60px;
  height: 25px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  margin-bottom: 16px;
  text-align: center;
  &:hover {
    border: 1px solid rgba(40, 119, 255, 1);
    color: rgba(40, 119, 255, 1);
  }
`
const FormWrap = styled.div`
  margin-top: 48px;
  box-sizing: border-box;
  padding-right: 24px;
`
const ButtonFooter = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  flex-direction: row-reverse;
  box-sizing: border-box;
  padding-right: 24px;
`
const Close = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
`

type ShapeProps = {
  record: any
  hide(): void
  tap(value: any): void
  row?: any
}

export const ShapeContent = (props: ShapeProps) => {
  const [t] = useTranslation()
  const {
    record: {
      id: myid,
      project_id: projectId,
      status: { id: activeID, can_changes: statusList },
    },
    hide,
    tap,
  } = props

  const [form] = Form.useForm()
  const { getProjectMember } = useModel('mine')
  const [optionsList, setOptionsList] = useState([])

  const init = async () => {
    const res = await getProjectMember(projectId)
    setOptionsList(res.data)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const arr = optionsList?.filter((k: any) => props.row?.dealName?.split(',')?.some((j: any) => k.name === j))
    form.setFieldsValue({
      username: arr?.map((k: any) => k.id),
    })
  }, [optionsList, props?.row])

  const onClear = () => {
    hide()
    form.resetFields()
  }

  const [active, setActive] = useState(activeID)
  const activeContent
    = statusList?.filter((i: any) => i.id === active)[0]?.content !== '规划中'
  const hasDealName = props.row?.dealName === '--'
  const confirm = async () => {
    const res = await form.validateFields()
    const value = {
      projectId,
      demandId: myid,
      statusId: active,
      userIds: res.username,
      content: res.password,
    }
    tap(value)
    onClear()
  }

  return (
    <Contain>
      <Left>
        {statusList.map((item: any) => (
          <div onClick={() => setActive(item.id)} key={item.id}>
            <StyledShape
              style={{
                color: item.id === active ? '#2877ff' : '#969799',
                border:
                  item.id === active
                    ? '1px solid #2877ff'
                    : '1px solid #EBEDF0',
              }}
            >
              {item.content_txt}
            </StyledShape>
            {/* {item.content} */}
          </div>
        ))}
      </Left>
      <Right>
        <FormWrap>
          <Form form={form}>
            <Form.Item
              labelCol={{ span: 5 }}
              label={t('common.dealName')}
              name="username"
              rules={[
                {
                  required: activeContent || !activeContent && !hasDealName,
                  message: '',
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder={t('common.pleaseSelect')}
                allowClear
                options={optionsList?.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 5 }}
              label={t('common.comment')}
              name="password"
            >
              <Input.TextArea
                maxLength={200}
                style={{ maxHeight: '132px', minHeight: '132px' }}
                placeholder={t('project.pleaseComment')}
              />
            </Form.Item>
          </Form>
        </FormWrap>

        <ButtonFooter>
          <Button
            onClick={confirm}
            style={{ marginLeft: '16px' }}
            type="primary"
          >
            {t('common.circulation')}
          </Button>
          <Button onClick={() => onClear()}>{t('common.cancel')}</Button>
        </ButtonFooter>
      </Right>
      <Close onClick={() => onClear()}>
        <IconFont type="close" style={{ fontSize: 16, cursor: 'pointer' }} />
      </Close>
    </Contain>
  )
}
