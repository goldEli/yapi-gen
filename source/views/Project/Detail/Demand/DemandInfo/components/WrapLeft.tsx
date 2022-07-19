import styled from '@emotion/styled'
import { Divider, Space } from 'antd'
import posterImg from '@/assets/poster.png'
import IconFont from '@/components/IconFont'
import { LevelContent } from '@/components/Level'
import Popconfirm from '@/components/Popconfirm'

const WrapLeft = styled.div({
  width: 'calc(100% - 472px)',
})

const InfoItem = styled.div({
  display: 'flex',
  marginTop: 24,
})

const Label = styled.div({
  color: '#646566',
  fontSize: 14,
  fontWeight: 400,
  minWidth: 120,
  height: 22,
  lineHeight: '22px',
})

const TextWrap = styled.div({
  color: '#323233',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  img: {
    maxWidth: '20%',
  },
})

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  borderRadius: 6,
  padding: '0 12px',
  fontSize: 14,
  border: '1px solid #EBEDF0',
  color: '#969799',
})

const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 26,
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 4,
    width: 'fit-content',
    '.anticon': {
      fontSize: 16,
      alignItems: 'center',
      svg: {
        margin: 0,
      },
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  ({ hasColor, hasDash }) => ({
    padding: hasColor || hasDash ? '0 4px' : 0,
    color: hasColor ? '#2877FF' : '#969799',
    border: hasColor
      ? '1px solid #2877FF'
      : hasDash
      ? '1px dashed #969799'
      : '1px solid white',
    '.anticon > svg': {
      color: hasColor ? '#2877FF' : '#969799',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
  }),
)

const statusList = [
  { name: '规划中' },
  { name: '实现中' },
  { name: '已实现' },
  { name: '已关闭' },
]

export default () => {
  return (
    <WrapLeft>
      <InfoItem>
        <Label>需求状态</Label>
        <div style={{ display: 'flex', width: '100%' }}>
          {statusList.map(i => (
            <div style={{ display: 'flex' }}>
              <StatusWrap>{i.name}</StatusWrap>
            </div>
          ))}
        </div>
      </InfoItem>
      <InfoItem>
        <Label>需求描述</Label>
        <TextWrap>
          需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容需求描述内容容需求描述内容需求描述内容需求描述内容需求描述内容...
          <img src={posterImg} alt="" />
          1. 需求描述示例文案占位 2. 需求描述示例文案占位 3.
          需求描述示例文案占位
        </TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>处理人</Label>
        <TextWrap>张三</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>创建人</Label>
        <TextWrap>里斯</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>创建时间</Label>
        <TextWrap>2022-02-12</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>父需求</Label>
        <TextWrap>
          <AddWrap>
            <IconFont type="plus" />
            <div>添加</div>
          </AddWrap>
        </TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>标签</Label>
        <AddWrap hasDash>
          <IconFont type="plus" />
        </AddWrap>
      </InfoItem>
      <InfoItem>
        <Label>附件</Label>
        <AddWrap>
          <IconFont type="plus" />
          <div>添加</div>
        </AddWrap>
      </InfoItem>
      <InfoItem>
        <Label>迭代</Label>
        <TextWrap>敏捷V2.0</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>优先级</Label>
        <Popconfirm
          content={({ onHide }: { onHide: () => void }) => {
            return <LevelContent tap={() => {}} hide={onHide}></LevelContent>
          }}
        >
          <IconFont type="knockdown" />
          <span style={{ marginLeft: 8 }}>中</span>
        </Popconfirm>
      </InfoItem>
      <InfoItem>
        <Label>预计开始</Label>
        <TextWrap>2022-02-12</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>预计结束</Label>
        <TextWrap>2022-02-12</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>抄送人</Label>
        <TextWrap>撒啊</TextWrap>
      </InfoItem>
    </WrapLeft>
  )
}
