/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import posterImg from '@/assets/poster.png'
import IconFont from '@/components/IconFont'
import { LevelContent } from '@/components/Level'
import Popconfirm from '@/components/Popconfirm'
import TagComponent from '../../components/TagComponent'
import DemandStatus from '../../components/DemandStatus'
import ParentDemand from '../../components/ParentDemand'
import UploadAttach from '../../components/UploadAttach'
import { useModel } from '@/models'

const WrapLeft = styled.div({
  width: 'calc(100% - 472px)',
})

const InfoItem = styled.div({
  display: 'flex',
  marginTop: 24,
  position: 'relative',
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

const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 26,
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 6,
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

const WrapLeftBox = () => {
  const { demandInfo } = useModel('demand')

  return (
    <WrapLeft>
      <InfoItem>
        <Label>需求状态</Label>
        <DemandStatus />
      </InfoItem>
      <InfoItem>
        <Label>需求描述</Label>
        <TextWrap dangerouslySetInnerHTML={{ __html: demandInfo?.info }} />
      </InfoItem>
      <InfoItem>
        <Label>处理人</Label>
        <TextWrap>{demandInfo?.name}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>创建人</Label>
        <TextWrap>{demandInfo?.userName}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>创建时间</Label>
        <TextWrap>{demandInfo?.createdTime}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>父需求</Label>
        <ParentDemand
          addWrap={
            <AddWrap>
              <IconFont type="plus" />
              <div>添加</div>
            </AddWrap>
          }
        />
      </InfoItem>
      <InfoItem>
        <Label>标签</Label>
        <TagComponent
          addWrap={
            <AddWrap hasDash>
              <IconFont type="plus" />
            </AddWrap>
          }
        />
      </InfoItem>
      <InfoItem>
        <Label>附件</Label>
        <UploadAttach
          addWrap={
            <AddWrap>
              <IconFont type="plus" />
              <div>添加</div>
            </AddWrap>
          }
        />
      </InfoItem>
      <InfoItem>
        <Label>迭代</Label>
        <TextWrap>{demandInfo?.iterateName}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>优先级</Label>
        <Popconfirm
          content={({ onHide }: { onHide(): void }) => {
            return <LevelContent onTap={() => {}} onHide={onHide} />
          }}
        >
          <div
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <IconFont style={{ fontSize: 16 }} type="knockdown" />
            <span style={{ marginLeft: 8 }}>中</span>
          </div>
        </Popconfirm>
      </InfoItem>
      <InfoItem>
        <Label>预计开始</Label>
        <TextWrap>{demandInfo?.expectedStart}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>预计结束</Label>
        <TextWrap>{demandInfo?.expectedEnd}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>抄送人</Label>
        <TextWrap>{demandInfo?.user}</TextWrap>
      </InfoItem>
    </WrapLeft>
  )
}

export default WrapLeftBox
