/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import Addperson from './Addperson'
import Title from './Title'
import FormMain from './FormMain'
import { Form, Radio } from 'antd'
import { useDispatch, useSelector } from '@store/index'
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
  const [delIsVisible, setDelIsVisible] = useState(false)
  // 全员看
  const [isAllView, setIsAllView] = useState(2)
  // 全员写
  const [isAllWrite, setIsAllWrite] = useState(2)
  const [templateConfigs, setTemplateConfigs] = useState<any>([])
  const onChangeValues = (values: any) => {
    setIsAllWrite(2)
    setIsAllView(2)
    values.forEach((item: any) => {
      if (item.user_type === 1 && item.key === 'all') {
        // 全员写
        setIsAllWrite(1)
      } else if (item.user_type === 3 && item.key === 'all') {
        // 全员看
        setIsAllView(1)
      }
    })
    // 部门的数据重新set 组装成员的数据 需要截取掉之前拼接的字符窜
    const setData =
      values
        ?.filter((el: any) => String(el?.id)?.includes('department_id_'))
        ?.map((el: any) => ({
          target_id: Number(el.id.slice(14)),
          user_type: el.user_type,
          target_type: el.target_type,
        })) || []
    // 团队的数据
    const setData1 =
      values
        ?.filter(
          (el: any) => !String(el?.id)?.includes('department_id_') && el?.id,
        )
        ?.map((el: any) => ({
          target_id: el.id,
          user_type: el.user_type,
          target_type: el.target_type,
        })) || []
    // 最终的大数组
    setTemplateConfigs([...setData, ...setData1])
  }
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
          <Addperson
            onChangeValues={val => onChangeValues(val)}
            data={person}
            title="谁可以写"
            isShow={true}
            state={1}
          />
          {/* 汇报对象*/}
          <Addperson
            onChangeValues={val => onChangeValues(val)}
            data={person}
            title="汇报对象"
            isShow={false}
            state={2}
          />
          {/* 谁可以看 */}
          <Addperson
            onChangeValues={val => onChangeValues(val)}
            data={person}
            title="谁可以看"
            isShow={false}
            state={3}
          />
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
            <FormMain
              type={type}
              backValues={(s: any, e: any, r: any) =>
                form?.setFieldsValue({
                  start_time: s,
                  end_time: e,
                  reminder_time: r,
                })
              }
            />
          </DayFormBox>
          {/* <div onClick={() => console.log(form?.getFieldsValue(), 999)}>123</div> */}
        </div>
      ) : null}

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
