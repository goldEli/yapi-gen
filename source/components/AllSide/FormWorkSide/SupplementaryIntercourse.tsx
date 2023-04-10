import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
interface Props {
  isVisible: boolean
  onClose(): void
  onConfirm(): void
  title: string
}
const ItemList = styled.div`
  margin: 0 auto;
  width: 592px;
  height: 64px;
  background-color: var(--neutral-white-d5);
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--neutral-n6-d2);
  padding: 0 12px;
  border-radius: 6px;
  align-items: center;
  margin-bottom: 16px;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
`
const Btn = styled.div`
  min-width: 60px;
  height: 32px;
  border-radius: 6px;
  text-align: center;
  line-height: 32px;
  color: var(--neutral-n2);
  font-size: 14px;
  background-color: var(--hover-d2);
`
const Text = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
`
const SupplementaryIntercourse = (props: Props) => {
  const a = [
    {
      title: '123',
    },
    {
      title: '345',
    },
  ]
  return (
    <CommonModal
      width={640}
      title={props.title}
      isVisible={props.isVisible}
      onClose={props.onClose}
      onConfirm={props.onConfirm}
      confirmText=""
    >
      {a.map(item => (
        <ItemList key={item.title}>
          <Text>{item.title}</Text>
          <Btn onClick={() => 123}>补交</Btn>
        </ItemList>
      ))}
    </CommonModal>
  )
}

export default SupplementaryIntercourse
