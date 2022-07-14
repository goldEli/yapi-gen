import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import Demand from './Demand'
import { useSearchParams } from 'react-router-dom'
import Iteration from './Iteration'
import Setting from './Setting'

const Wrap = styled.div({})

export default () => {
  const [searchParams] = useSearchParams()
  const activeType = searchParams.get('type') || 'demand'
  const content = () => {
    if (activeType === 'demand') {
      return <Demand />
    } else if (activeType === 'set') {
      return <Setting />
    } else {
      return <Iteration />
    }
  }
  return (
    <Wrap>
      <CommonOperation activeType={activeType} />
      {content()}
    </Wrap>
  )
}
