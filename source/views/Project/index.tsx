import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'
import { Button, Drawer, Space } from 'antd'
import IconFont from '@/components/IconFont'
import RichEditor from '@/components/RichEditor'
import { useState } from 'react'

const ProjectWrap = styled.div`
  position: relative;
`

const DivWrap = styled.div`
  color: var(--light-red);
`

const Project = () => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <ProjectWrap>
      project
      <Space size={16}>
        <CommonButton type="primary" icon="plus" iconPlacement="right">
          primary
        </CommonButton>
        <CommonButton type="light">light</CommonButton>
        <CommonButton type="secondary">secondary</CommonButton>
        <CommonButton type="danger">danger</CommonButton>
        <CommonButton type="primaryText">primaryText</CommonButton>
        <CommonButton type="secondaryText" icon="plus">
          121221
        </CommonButton>
        <CommonButton type="icon" icon="plus" />
      </Space>
      <RichEditor />
      <Button onClick={() => setIsVisible(true)}>抽屉</Button>
      <Drawer
        onClose={() => setIsVisible(false)}
        open={isVisible}
        maskClosable={false}
        mask={false}
      >
        232323
      </Drawer>
      <DivWrap>111</DivWrap>
      {/* <Editor /> */}
    </ProjectWrap>
  )
}

export default Project
