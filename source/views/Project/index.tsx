import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'
import { Space } from 'antd'
import IconFont from '@/components/IconFont'

const ProjectWrap = styled.div`
  position: relative;
`

const Project = () => {
  return (
    <ProjectWrap>
      project
      <Space size={16}>
        <CommonButton
          type="primary"
          iconNode={<IconFont type="plus" />}
          iconPlacement="right"
        >
          primary
        </CommonButton>
        <CommonButton type="light">light</CommonButton>
        <CommonButton type="secondary">secondary</CommonButton>
        <CommonButton type="danger">danger</CommonButton>
        <CommonButton type="primaryText">primaryText</CommonButton>
        <CommonButton type="secondaryText" iconNode={<IconFont type="plus" />}>
          121221
        </CommonButton>
      </Space>
    </ProjectWrap>
  )
}

export default Project
