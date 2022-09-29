/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Select, Button, Form, Input, Timeline } from 'antd'
import { useModel } from '@/models'

const { Option } = Select
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'

const Left = styled.div`
  width: 120px;
  min-height: 400px;
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
  min-height: 400px;
  /* overflow-y: scroll; */
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
const ExcessiveBox = styled.div`
  display: flex;

  height: 22px;
`
const StyledShape2 = styled.div`
  width: 52px;
  height: 22px;
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  border: 1px solid #ebedf0;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #969799;
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledShape3 = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #969799;
  line-height: 20px;
`
const AuditBox = styled.div``
const LineBox = styled.div``

const LineBoxTitle2 = styled.div`
  margin-right: 40px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #323233;
  line-height: 22px;
`
const LineBoxTitle3 = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #969799;
  line-height: 20px;
`
const ArrorBox = styled.div`
  display: flex;
`

const arror = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #a4acf5;
  border-radius: 16px 16px 16px 16px;
  font-size: 14px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
`
const arrorText = css`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #323233;
  line-height: 20px;
`
const symbol = css`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 0px 0px 0px 0px;
  top: 8px;
  right: -25px;
`
const ArrorItem = styled.div`
  position: relative;
  height: 56px;
  display: flex;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 32px;
  &:nth-last-child(1) {
    .${symbol} {
      visibility: hidden;
    }
  }
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
        {[1, 2, 3, 4, 5].map((item: any) => (
          <div onClick={() => setActive(item)} key={item}>
            <StyledShape
              style={{
                color: item === active ? '#2877ff' : '#969799',
                border:
                  item === active ? '1px solid #2877ff' : '1px solid #EBEDF0',
              }}
            >
              {item}
            </StyledShape>
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
        <ExcessiveBox>
          <StyledShape2>实现中</StyledShape2>
          <StyledShape2
            style={{ color: '#2877FF', border: '1px solid #2877FF' }}
          >
            已实现
          </StyledShape2>
          <StyledShape3>该流转状态需要审核</StyledShape3>
        </ExcessiveBox>

        <AuditBox>
          <div
            style={{
              width: '56px',
              height: '22px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#323233',
              lineHeight: '22px',
              marginBottom: '16px',
            }}
          >
            审核流程
          </div>

          <Timeline>
            {[1, 2, 3].map(item2 => (
              <Timeline.Item key={item2}>
                <LineBox>
                  <div style={{ display: 'flex' }}>
                    <LineBoxTitle2>审核人</LineBoxTitle2>
                    <LineBoxTitle3>依次审核</LineBoxTitle3>
                    <StyledShape2
                      style={{ color: '#43BA9A', border: '1px solid #43BA9A' }}
                    >
                      已实现
                    </StyledShape2>
                  </div>

                  <ArrorBox>
                    {[1, 2, 3].map(item => (
                      <ArrorItem key={item}>
                        <span className={arror}>张</span>
                        <span className={arrorText}>张三</span>
                        <span className={symbol}>&</span>
                      </ArrorItem>
                    ))}
                  </ArrorBox>
                </LineBox>
              </Timeline.Item>
            ))}
          </Timeline>
        </AuditBox>
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
