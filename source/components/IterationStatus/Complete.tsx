import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { Input, Popover, Radio, RadioChangeEvent, Space } from 'antd'
import { SetStateAction, useEffect, useState } from 'react'
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
const Content = styled.div`
  width: 480px;
  height: 168px;
  overflowy: auto;
`
const TitleText = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
  height: 32px;
  line-height: 32px;
  padding-left: 16px;
`
const ItemName = styled.div`
  padding-left: 16px;
  line-height: 32px;
  height: 32px;
  font-size: 14px;
  color: var(--neutral-n2);
  &:hover {
    cursor: pointer;
    background-color: var(--hover-d3);
    color: var(--neutral-n1-d1);
  }
`
const Name = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
`
const InputStyle = styled(Input)({
  width: '480px',
})
const PopoverStyle = styled(Popover)({
  marginTop: '8px',
})
interface Props {
  isVisible: boolean
  title: string
  onClose: () => void
  onConfirm: () => void
  data: Array<{ name: string; value: number }>
}
const Complete = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(1)
  const [popoverValue, setPopoverValue] = useState<{
    name: string
    value: number
  }>({
    name: '',
    value: 0,
  })
  const a = [
    {
      type: 'no',
      data: [
        {
          name: '123',
          value: 1,
        },
      ],
    },
    {
      type: 'yes',
      data: [
        {
          name: '456',
          value: 2,
        },
      ],
    },
  ]
  const activeItem = (item: { name: string; value: number }) => {
    setIsOpen(false)
    setPopoverValue(item)
  }
  const content = () => {
    return (
      <Content>
        {a.map(el => (
          <>
            <TitleText key={el.type}>{el.type}</TitleText>
            {el.data.map(item => (
              <ItemName onClick={() => activeItem(item)} key={item.name}>
                {item.name}
              </ItemName>
            ))}
          </>
        ))}
      </Content>
    )
  }
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }
  return (
    <CommonModal
      width={528}
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
      <div style={{ paddingLeft: '24px', height: 150 }}>
        <Radio.Group
          onChange={(e: RadioChangeEvent) => onChange(e)}
          value={value}
        >
          <Space direction="vertical" size={24}>
            <div>
              <Radio value={1}>
                <Name>将剩余需求和缺陷移入其他迭代中</Name>
              </Radio>
              {value === 1 && (
                <PopoverStyle
                  placement="bottomRight"
                  title={''}
                  visible={isOpen}
                  onVisibleChange={setIsOpen}
                  content={content}
                  trigger="[click]"
                >
                  <InputStyle
                    type="text"
                    value={popoverValue.name}
                    placeholder={'请选择'}
                    suffix={
                      <CommonIconFont
                        type={isOpen ? 'up' : 'down'}
                        size={14}
                        color="var(--neutral-n4)"
                      />
                    }
                  />
                </PopoverStyle>
              )}
            </div>
            <Radio value={2}>
              <Name>移除剩余需求和缺陷</Name>
            </Radio>
          </Space>
        </Radio.Group>
      </div>
    </CommonModal>
  )
}
export default Complete
