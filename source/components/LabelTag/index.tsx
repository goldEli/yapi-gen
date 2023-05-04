import styled from '@emotion/styled'
import yellowTag from '/yellow_tag.png'
import blueTag from '/blue_tag.png'

type ItemType = {
  label: string
  color: string
  state: number
}
interface LabelPropType {
  options: Array<ItemType>
  state: number
}

const LabelWrap = styled.span<{ zh: boolean }>`
  display: inline-block;
  width: ${(props: any) => (props.zh ? '35px' : '50px')};
  height: 20px;
  box-sizing: border-box;
  background-image: ${(props: any) =>
    props.theme === 1
      ? `url(${yellowTag})`
      : props.theme === 2
      ? `url(${blueTag})`
      : ''};
  background-size: cover;
  font-size: 12px;
  line-height: 20px;
  font-family: MiSans-Regular, MiSans;
  text-align: center;
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
  padding-left: 2px;
  color: ${(props: any) => props.color};
  white-space: nowrap;
`

const LabelTag = (props: LabelPropType) => {
  const { options, state } = props
  const labelItem = options.find((k: ItemType) => k.state === state)

  return (
    <LabelWrap
      color={labelItem?.color}
      theme={labelItem?.state}
      zh={localStorage.getItem('language') === 'zh'}
    >
      {labelItem?.label}
    </LabelWrap>
  )
}

export default LabelTag
