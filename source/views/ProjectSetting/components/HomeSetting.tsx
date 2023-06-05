import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Radio } from 'antd'
import { useSelector } from '@store/index'
import { updateHomeSetting } from '@/services/sprint'
import { getMessage } from '@/components/Message'
const Wrap = styled.div`
  padding-left: 24px;
`
const Title = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
`
const SubTitle = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-top: 4px;
`
const RadioWrap = styled.div`
  margin-top: 16px;
  .ant-radio-wrapper {
    color: var(--neutral-n1-d1) !important;
    font-size: var(--font14) !important;
  }
`
interface IProps {}
const HomeSetting: React.FC<IProps> = props => {
  const [value, setValue] = useState('')
  const { projectInfo } = useSelector(state => state.project)
  const urls = [
    { url: '/ProjectManagement/Demand', name: '需求' },
    { url: '/ProjectManagement/Iteration', name: '迭代' },
    { url: '/ProjectManagement/KanBan', name: 'Kanban' },
    { url: '/ProjectManagement/IterationReport', name: '报表' },
    { url: '/ProjectManagement/Defect', name: '缺陷' },
  ]
  console.log(projectInfo)
  const onChange = async (e: any) => {
    setValue(e.target.value)
    try {
      await updateHomeSetting({
        id: projectInfo.id,
        default_home_menu: e.target.value,
      })
      getMessage({ msg: '配置成功', type: 'success' })
    } catch (error) {
      //
    }
  }
  useEffect(() => {
    console.log(projectInfo.defaultHomeMenu)
    if (!projectInfo.defaultHomeMenu) {
      return
    }
    setValue(projectInfo.defaultHomeMenu)
  }, [])
  return (
    <Wrap>
      <Title>项目首页配置</Title>
      <SubTitle>定义项目默认首页位置</SubTitle>
      <RadioWrap>
        <Radio.Group onChange={onChange} value={value}>
          {urls.map(item => (
            <Radio key={item.url} value={item.url}>
              {item.name}
            </Radio>
          ))}
        </Radio.Group>
      </RadioWrap>
    </Wrap>
  )
}
export default HomeSetting
