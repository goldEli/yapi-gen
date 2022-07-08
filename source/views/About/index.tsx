import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'

const Wrap = styled.div({
  color: '#f60',
})

const StyledButton = styled(Button)`
  color: red;
  font-size: 20px;
`

const About = () => {
  return (
    <Wrap>
      关于页面
      <Link to="/">
        <StyledButton>去首页</StyledButton>
      </Link>
    </Wrap>
  )
}

export default About
