import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Radio } from 'antd'
import { useSelector, useDispatch } from '@store/index'
import { updateHomeSetting } from '@/services/sprint'
import { getMessage } from '@/components/Message'
import { setProjectInfo } from '@store/project/index'
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
  const dispatch = useDispatch()
  const { projectInfo } = useSelector(state => state.project)
  const urls = [
    { url: '/SprintProjectManagement/Affair', name: '事务列表' },
    { url: '/SprintProjectManagement/Sprint', name: '冲刺' },
    { url: '/SprintProjectManagement/KanBan', name: 'Kanban' },
    { url: '/Report/PerformanceInsight', name: '报表' },
  ]

  const onChange = async (e: any) => {
    setValue(e.target.value)
    try {
      await updateHomeSetting({
        id: projectInfo.id,
        default_home_menu: e.target.value,
      })
      getMessage({ msg: '配置成功', type: 'success' })
      dispatch(
        setProjectInfo({ ...projectInfo, defaultHomeMenu: e.target.value }),
      )
    } catch (error) {
      //
    }
  }
  useEffect(() => {
    // console.log(111, projectInfo)
    if (!projectInfo.defaultHomeMenu) {
      setValue('/SprintProjectManagement/Affair')
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
