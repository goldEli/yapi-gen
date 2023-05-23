import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import { DivStyle } from '@/views/PerformanceInsight/Header/Style'
import styled from '@emotion/styled'
import { Dropdown, Radio } from 'antd'
import { useState } from 'react'
const Titile = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  padding-left: 24px;
`
const StatisticsWrap = styled.div`
  display: flex;
  padding: 8px 24px 24px 24px;
  justify-content: space-between;
`
const MainWrap = styled.div`
  width: 108px;
  height: 76px;
  background: var(--neutral-n10);
  border-radius: 6px;
  padding: 12px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const NumWrap = styled.div`
  font-size: 20px;
  font-family: SiYuanMedium;
`
const NameWrap = styled.div`
  font-size: 12px;
  color: var(--neutral-n12);
`
interface Props {
  isVisible: boolean
  title: string
  onClose: () => void
  onConfirm: () => void
  data: Array<{ name: string; value: number }>
}
const Complete = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState<any>({
    title: '请选择迭代',
    value: 'all',
  })
  const [items, setItems] = useState([])
  const onOpenChange = () => {}
  return (
    <CommonModal
      isVisible={props.isVisible}
      title={props.title}
      onClose={() => props.onClose()}
      onConfirm={() => props.onConfirm()}
    >
      <Titile>本次概况统计</Titile>
      <StatisticsWrap>
        {props.data.map(el => (
          <MainWrap key={el.name}>
            <NumWrap>{el.value}</NumWrap>
            <NameWrap>{el.name}</NameWrap>
          </MainWrap>
        ))}
      </StatisticsWrap>
      <div style={{ paddingLeft: '24px' }}>
        <Radio value={1}>将剩余需求和缺陷移入其他迭代中</Radio>
      </div>
      <div style={{ paddingLeft: '24px', marginTop: '8px' }}>
        <Dropdown
          placement="bottomLeft"
          visible={isOpen}
          onVisibleChange={setIsOpen}
          trigger={['click']}
          menu={{ items, onClick: onOpenChange }}
          overlayStyle={{
            width: 120,
            background: 'var(--neutral-white-d1)',
          }}
        >
          <DivStyle onClick={() => setIsOpen(!isOpen)}>
            <div>{value.title}</div>
            <CommonIconFont
              type={isOpen ? 'up' : 'down'}
              size={14}
              color="var(--neutral-n4)"
            />
          </DivStyle>
        </Dropdown>
      </div>
      <div style={{ marginTop: '24px', paddingLeft: '24px' }}>
        <Radio value={2}>移除剩余需求和缺陷</Radio>
      </div>
    </CommonModal>
  )
}
export default Complete
