/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */

import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import Addperson from './Addperson'
import Title from './Title'
import FormMain from './FormMain'
import { Form, Radio } from 'antd'
import CommonButton from '@/components/CommonButton'
import { useDispatch, useSelector } from '@store/index'
import { setDisposeSave } from '@store/formWork'
import DeleteConfirm from '@/components/DeleteConfirm'
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
  '.ant-picker': {
    width: '320px',
  },
})
const BtnRow = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-end;
`
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
interface PropsType {
  back(): void
}
const PermissionConfig = (props: PropsType) => {
  const dispatch = useDispatch()
  // 汇报内容是否展开
  const [report, setReport] = useState(true)
  const [fillIn, setFillIn] = useState(true)
  // 每天 day ,每周 week , 每月 month , 不重复doNot
  const [type, setType] = useState<string>('day')
  const [form] = Form.useForm()
  const { disposeSave } = useSelector(store => store.formWork)
  const [save, setSave] = useState(disposeSave)
  const [delIsVisible, setDelIsVisible] = useState(false)
  const back = () => {
    if (disposeSave) {
      props.back()
    } else {
      setDelIsVisible(true)
    }
  }
  useEffect(() => {
    console.log(disposeSave, 'DisposeSave')
    setSave(disposeSave)
  }, [disposeSave])
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
          <Addperson data={person} title="谁可以写" isShow={true} state="1" />
          {/* 汇报对象*/}
          <Addperson data={person} title="汇报对象" isShow={false} state="2" />
          {/* 谁可以看 */}
          <Addperson data={person} title="谁可以看" isShow={false} state="3" />
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
          <Radio.Group
            style={{ margin: '8px 0 16px 0' }}
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <Radio value={'day'}>每天</Radio>
            <Radio value={'week'}>每周</Radio>
            <Radio value={'month'}>每月</Radio>
            <Radio value={'doNot'}>不重复</Radio>
          </Radio.Group>
          <DayFormBox form={form}>
            <FormMain type={type} />
          </DayFormBox>
        </div>
      ) : null}
      {/* 底部保存 */}
      <BtnRow>
        <CommonButton type="light" onClick={() => back()}>
          上一步
        </CommonButton>
        {save ? (
          <CommonButton type="primary" style={{ margin: '0 0px 0 16px' }}>
            已保存
          </CommonButton>
        ) : (
          <CommonButton
            type="primary"
            onClick={() => {
              dispatch(setDisposeSave(true))
            }}
            style={{ margin: '0 0px 0 16px' }}
          >
            保存
          </CommonButton>
        )}
      </BtnRow>
      {/* 未保存的弹窗 */}
      <DeleteConfirm
        title={'保存提示'}
        text="【模版名称】还未保存，是否保存编辑内容？"
        isVisible={delIsVisible}
        onConfirm={() => setDelIsVisible(false)}
        notCancel
      />
    </PermissionConfigStyle>
  )
}
export default PermissionConfig
