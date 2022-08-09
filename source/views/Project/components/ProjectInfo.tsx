/* eslint-disable complexity */
import { Modal } from 'antd'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'

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
  const [t] = useTranslation()
  const { projectInfo } = useModel('project')
  return (
    <Modal
      width={420}
      title={t('project.projectInformation')}
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
          <span>{projectInfo.info || '--'}</span>
        </PosterWrap>
        <InfoItem>
          <span>{t('project.projectId')}</span>
          <div>{projectInfo.id}</div>
        </InfoItem>
        <InfoItem>
          <span>{t('common.createName')}</span>
          <div>{projectInfo.userName || '--'}</div>
        </InfoItem>
        <InfoItem>
          <span>{t('common.createTime')}</span>
          <div>{projectInfo.createTime || '--'}</div>
        </InfoItem>
        <InfoItem>
          <span>{t('project.projectStatus')}</span>
          <div>
            {projectInfo.status === 1 ? t('common.open') : t('common.stop')}
          </div>
        </InfoItem>
        <InfoItem>
          <span>{t('common.permission')}</span>
          <div>
            {projectInfo.isPublic === 1
              ? t('common.publicProject')
              : t('common.privateProject')}
          </div>
        </InfoItem>
        <InfoItem>
          <span>{t('common.demand')}</span>
          <div>{projectInfo.demandCount || 0}</div>
        </InfoItem>
        <InfoItem>
          <span>{t('project.iterateEdition')}</span>
          <div>{projectInfo.iterateCount || 0}</div>
        </InfoItem>
        <InfoItem>
          <span>{t('project.projectMember')}</span>
          <div>{projectInfo.memberCount || 0}</div>
        </InfoItem>
      </div>
    </Modal>
  )
}

export default ProjectInfo
