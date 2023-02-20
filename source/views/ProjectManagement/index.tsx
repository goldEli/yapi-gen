import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'
import { Button, Drawer, Space } from 'antd'
import IconFont from '@/components/IconFont'
import RichEditor from '@/components/RichEditor'
import { useState } from 'react'
import { useDispatch } from '@store/index'
import { Outlet } from 'react-router-dom'

const ProjectWrap = styled.div`
  position: relative;
`

const DivWrap = styled.div`
  color: var(--light-red);
`

const Project = () => {
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useDispatch()
  return (
    <ProjectWrap>
      {/* <Editor /> */}
      <Outlet />
    </ProjectWrap>
  )
}

export default Project
