/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { useState } from 'react'
import Addperson from './Addperson'
import Title from './Title'
import DayForm from './DayForm'
import { Form } from 'antd'
const PermissionConfigStyle = styled.div`
  padding: 0 24px;
`
const TitleText = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
`
const DayFormBox = styled(Form)({
  '.ant-form-item': {
    marginBottom: 0,
  },
  '.ant-row': {
    display: 'block',
  },
})

const person = [
  {
    label: 'zcm88888888888888888888888',
    id: 1,
  },
  {
    label: 'zcm1',
    id: 2,
  },
  {
    label: 'zcm1',
    id: 3,
  },
  {
    label: 'zcm4',
    id: 4,
  },
  {
    label: 'zcm4',
    id: 5,
  },
  {
    label: 'zcm4',
    id: 6,
  },
  {
    label: 'zcm4',
    id: 7,
  },
  {
    label: 'zcm4',
    id: 8,
  },
]
const PermissionConfig = () => {
  // 汇报内容是否展开
  const [report, setReport] = useState(true)
  const [fillIn, setFillIn] = useState(true)
  // 每周和每月样式一致，每天和不重复都不一样
  // 每天 day ,每周 week , 每月 month , 不重复DoNot
  const [type, setType] = useState()
  const [form] = Form.useForm()

  return (
    <PermissionConfigStyle>
      {/* 汇报内容 */}
      <Title
        headerTitle="汇报内容"
        onChange={(val: boolean) => setReport(val)}
      />
      {report ? (
        <>
          {/* 谁可以写 */}
          <Addperson data={person} title="谁可以写" isShow={true} />
          {/* 汇报对象*/}
          <Addperson data={person} title="汇报对象" isShow={false} />
          {/* 谁可以看 */}
          <Addperson data={person} title="谁可以看" isShow={false} />
        </>
      ) : null}
      {/* 填写要求 */}
      <Title
        headerTitle="填写要求"
        msg="将直接填写要求统计提交情况"
        onChange={(val: boolean) => setFillIn(val)}
      />
      {fillIn ? (
        <div style={{ marginLeft: '24px' }}>
          <TitleText>填写周期</TitleText>
          <DayFormBox form={form}>
            <DayForm />
          </DayFormBox>
        </div>
      ) : null}
    </PermissionConfigStyle>
  )
}
export default PermissionConfig
