// 项目信息

import styled from '@emotion/styled'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'

const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 24,
  fontSize: 12,
  fontWeight: 400,
  span: {
    color: '#969799',
    display: 'inline-block',
    minWidth: 80,
  },
  div: {
    color: '#323233',
  },
})

const PosterWrap = styled.div({
  paddingBottom: '16px',
  borderBottom: '1px solid #ECEDEF',
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
    <CommonModal
      title={t('project.projectInformation')}
      isVisible={props.visible}
      onClose={props.onChangeVisible}
      isShowFooter
    >
      <div
        style={{ maxHeight: 544, overflow: 'auto', padding: '0 16px 86px 0' }}
      >
        <PosterWrap>
          <img src={projectInfo.cover} alt="" />
          <div
            style={{
              fontSize: '18px',

              fontWeight: 'bold',
              color: '#323233',
            }}
          >
            {projectInfo.name}
          </div>
          <span>{projectInfo.info || '--'}</span>
        </PosterWrap>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              marginRight: '50px',
            }}
          >
            <InfoItem>
              <span>{t('project.projectId')}</span>
              <div>{projectInfo.id}</div>
            </InfoItem>
            <InfoItem>
              <span>{t('common.createName')}</span>
              <div>{projectInfo.userName || '--'}</div>
            </InfoItem>
            <InfoItem>
              <span>{t('project.projectStatus')}</span>
              <div>
                {projectInfo.status === 1 ? t('common.open') : t('common.stop')}
              </div>
            </InfoItem>
            <InfoItem>
              <span>{t('common.demand')}</span>
              <div>{projectInfo.demandCount || 0}</div>
            </InfoItem>
          </div>
          <div
            style={{
              flex: 1,
            }}
          >
            <InfoItem>
              <span>{t('common.createTime')}</span>
              <div>{projectInfo.createTime || '--'}</div>
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
              <span>{t('project.iterateEdition')}</span>
              <div>{projectInfo.iterateCount || 0}</div>
            </InfoItem>
            <InfoItem>
              <span>{t('project.projectMember')}</span>
              <div>{projectInfo.memberCount || 0}</div>
            </InfoItem>
          </div>
        </div>
      </div>
    </CommonModal>
  )
}

export default ProjectInfo
