import { Modal } from 'antd'
import styled from '@emotion/styled'
import posterImg from '@/assets/poster.png'

const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 24,
  fontSize: 14,
  fontWeight: 400,
  span: {
    color: '#646566',
    display: 'inline-block',
    minWidth: 120,
  },
  div: {
    color: '#323233',
  },
})

const PosterWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  img: {
    height: 176,
    width: '100%',
    marginBottom: 24,
    borderRadius: 6,
  },
  div: {
    fontSize: 16,
    color: '#323233',
    fontWeight: 400,
  },
  span: {
    marginTop: 4,
    fontWeight: 400,
    fontSize: 14,
  },
})

interface Props {
  visible: boolean
  onChangeVisible(): void
}

const ProjectInfo = (props: Props) => {
  const infoDetail = {
    id: '1000',
    name: '小河',
    time: '2002-1-1',
    status: '开启',
    permission: '私有',
    demand: '9',
    iteration: '3',
    person: '7',
  }
  return (
    <Modal
      width={420}
      title="项目信息"
      visible={props.visible}
      footer={false}
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <div>
        <PosterWrap>
          <img src={posterImg} alt="" />
          <div>项目名称项目名称项目名称项目名称项目名称</div>
          <span>
            项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述
          </span>
        </PosterWrap>
        <InfoItem>
          <span>项目id</span>
          <div>{infoDetail.id}</div>
        </InfoItem>
        <InfoItem>
          <span>创建人</span>
          <div>{infoDetail.name}</div>
        </InfoItem>
        <InfoItem>
          <span>创建时间</span>
          <div>{infoDetail.time}</div>
        </InfoItem>
        <InfoItem>
          <span>项目状态</span>
          <div>{infoDetail.status}</div>
        </InfoItem>
        <InfoItem>
          <span>权限</span>
          <div>{infoDetail.permission}</div>
        </InfoItem>
        <InfoItem>
          <span>需求</span>
          <div>{infoDetail.demand}</div>
        </InfoItem>
        <InfoItem>
          <span>迭代版本</span>
          <div>{infoDetail.iteration}</div>
        </InfoItem>
        <InfoItem>
          <span>项目成员</span>
          <div>{infoDetail.person}</div>
        </InfoItem>
      </div>
    </Modal>
  )
}

export default ProjectInfo
