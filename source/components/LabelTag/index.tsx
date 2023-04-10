import styled from '@emotion/styled'

type ItemType = {
  label: string
  color: string
  background: string
  state: number
}
interface LabelPropType {
  options: Array<ItemType>
  state: number
}

const LabelWrap = styled.span`
  display: inline-block;
  width: 30px;
  height: 20px;
  box-sizing: border-box;
  background: ${(props: any) => props.theme};
  font-size: 12px;
  line-height: 20px;
  font-family: MiSans-Regular, MiSans;
  text-align: center;
  color: ${(props: any) => props.color};
  padding-right: 4px;
  position: relative;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  &::after {
    content: '';
    width: 0px;
    height: 0px;
    border: 10px solid transparent;
    border-right-color: ${(props: any) => props.theme};
    position: absolute;
    top: 0px;
    right: 30px;
  }
`

const LabelTag = (props: LabelPropType) => {
  const { options, state } = props
  const labelItem = options.find((k: ItemType) => k.state === state)
  return (
    <LabelWrap theme={labelItem?.background} color={labelItem?.color}>
      {labelItem?.label}
    </LabelWrap>
  )
}

export default LabelTag
