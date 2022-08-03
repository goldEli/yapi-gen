import { Modal } from 'antd'
import styled from '@emotion/styled'
import { useModel } from '@/models'

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
  const { projectInfo } = useModel('project')
  return (
    <Modal
      width={420}
      title="项目信息"
      visible={props.visible}
      footer={false}
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px' }}
      maskClosable={false}
      destroyOnClose
    >
      <div>
        <PosterWrap>
          <img src={projectInfo.cover} alt="" />
          <div>{projectInfo.name}</div>
          <span>{projectInfo.info}</span>
        </PosterWrap>
        <InfoItem>
          <span>项目id</span>
          <div>{projectInfo.id}</div>
        </InfoItem>
        <InfoItem>
          <span>创建人</span>
          <div>{projectInfo.userName}</div>
        </InfoItem>
        <InfoItem>
          <span>创建时间</span>
          <div>{projectInfo.createTime}</div>
        </InfoItem>
        <InfoItem>
          <span>项目状态</span>
          <div>{projectInfo.status === 1 ? '开启' : '结束'}</div>
        </InfoItem>
        <InfoItem>
          <span>权限</span>
          <div>{projectInfo.isPublic === 1 ? '公开项目' : '私有项目'}</div>
        </InfoItem>
        <InfoItem>
          <span>需求</span>
          <div>{projectInfo.demandCount}</div>
        </InfoItem>
        <InfoItem>
          <span>迭代版本</span>
          <div>{projectInfo.iterateCount}</div>
        </InfoItem>
        <InfoItem>
          <span>项目成员</span>
          <div>{projectInfo.memberCount}</div>
        </InfoItem>
      </div>
    </Modal>
  )
}

export default ProjectInfo
