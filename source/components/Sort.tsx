/* eslint-disable complexity */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'

const Arrow = styled.span`
  display: flex;
  flex-direction: column;
  visibility: hidden;
`
const Wrap = styled.div<{ show: boolean }>`
  height: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
  ${Arrow} {
    visibility: ${({ show }) => show ? 'visible' : 'hidden'};
  }
  &:hover {
    ${Arrow} {
      visibility: visible;
    }
  }
`
const Text = styled.span`
  margin-right: 8px;
`
let num = 0
const Sort = (props: any) => {
  const { nowKey, fixedKey, onChangeKey, order } = props

  return (
    <Wrap
      onClick={() => {
        num++
        if (num % 3 === 0) {
          onChangeKey('', num % 3)
        } else {
          onChangeKey(fixedKey, num % 3)
        }
      }}
      show={nowKey === fixedKey}
    >
      <Text
        style={{
          color: nowKey === fixedKey ? '#2877ff' : '',
          lineHeight: '14px',
        }}
      >
        {props.children}
      </Text>
      <Arrow>
        <IconFont
          type="tableUp"
          style={{
            color:
              order === 1 && nowKey === fixedKey ? 'rgba(40, 119, 255, 1)' : '',
            fontSize: 8,
          }}
        />
        <IconFont
          type="tableDown"
          style={{
            color:
              order === 2 && nowKey === fixedKey ? 'rgba(40, 119, 255, 1)' : '',
            fontSize: 8,
          }}
        />
      </Arrow>
    </Wrap>
  )
}

export default Sort
