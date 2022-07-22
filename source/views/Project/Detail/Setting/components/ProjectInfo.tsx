/* eslint-disable max-len */
import styled from '@emotion/styled'
import posterImg from '@/assets/poster.png'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { Space } from 'antd'
import EditProject from '@/views/Project/components/EditProject'
import { useState } from 'react'

const Wrap = styled.div({
  padding: 24,
  background: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 6,
  display: 'flex',
})

const InfoLeft = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: 396,
  fontSize: 16,
  color: 'black',
  img: {
    width: '100%',
    height: 186,
    borderRadius: 6,
    marginBottom: 24,
  },
})

const SubText = styled.div({
  marginTop: 10,
  color: '#646566',
  fontSize: 14,
  lineHeight: '30px',
})

const InfoRight = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 55,
})

const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 14,
  div: {
    minWidth: 120,
    color: '#969799',
    fontSize: 14,
    fontWeight: 400,
  },
  span: {
    color: 'black',
    fontSize: 14,
    fontWeight: 400,
  },
})

const CardGroup = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  marginTop: 24,
})

const CardItem = styled.div({
  height: 72,
  width: 158,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
  background: 'rgba(235, 237, 240, 0.6)',
  div: {
    fontSize: 32,
    color: '#2877FF',
    fontWeight: 400,
    lineHeight: '32px',
  },
  span: {
    fontSize: 14,
    color: '#323233',
  },
})

const ProjectInfo = () => {
  const [visible, setVisible] = useState(false)
  return (
    <div style={{ padding: 16 }}>
      <EditProject
        visible={visible}
        onChangeVisible={() => setVisible(!visible)}
      />
      <Wrap>
        <InfoLeft>
          <img src={posterImg} alt="" />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <OmitText width={340}>
              项目名称XXX项目名称XXXXXXXX项目名称XXXXXXXX项目名称XXXXXXXXXXXXX
            </OmitText>
            <IconFont
              onClick={() => setVisible(true)}
              style={{
                marginLeft: 24,
                cursor: 'pointer',
              }}
              type="edit-square"
            />
          </div>
          <SubText>
            为了借助社交产品的流量，让用户主动分享APP中的内容到社交平台来达到拉新和促活的目的，市场上绝大多数APP都有第三方分享的功能，它是内容分发。
          </SubText>
        </InfoLeft>
        <InfoRight>
          <InfoItem>
            <div>项目ID</div>
            <span>1000001</span>
          </InfoItem>
          <InfoItem>
            <div>创建人：</div>
            <span>何飞</span>
          </InfoItem>
          <InfoItem>
            <div>创建时间：</div>
            <span>2022-6-17 15:20</span>
          </InfoItem>
          <InfoItem>
            <div>结束时间：</div>
            <span>2022-6-17 15:20</span>
          </InfoItem>
          <InfoItem>
            <div>项目状态：</div>
            <span>已开启</span>
          </InfoItem>
          <InfoItem>
            <div>权限：</div>
            <span>私有项目</span>
          </InfoItem>
          <CardGroup size={24}>
            <CardItem>
              <div>6</div>
              <span>需求</span>
            </CardItem>
            <CardItem>
              <div>5</div>
              <span>迭代版本</span>
            </CardItem>
            <CardItem>
              <div>20</div>
              <span>项目成员</span>
            </CardItem>
          </CardGroup>
        </InfoRight>
      </Wrap>
    </div>
  )
}

export default ProjectInfo
