/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
/* eslint-disable max-len */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { Space } from 'antd'
import EditProject from '@/views/Project/components/EditProject'
import { useState } from 'react'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'

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

const ClickIcon = styled(IconFont)({
  color: '#323233',
  fontSize: 16,
  marginLeft: 8,
  '&: hover': {
    color: '#2877ff',
  },
})

const ProjectInfo = () => {
  const [t] = useTranslation()
  const [visible, setVisible] = useState(false)
  const { projectInfo, getProjectInfo } = useModel('project')
  const { userInfo } = useModel('user')

  const onUpdate = () => {
    getProjectInfo({ projectId: projectInfo.id })
  }

  return (
    <div style={{ padding: 16, height: '100%' }}>
      {visible
        ? (
            <EditProject
              visible={visible}
              onChangeVisible={() => setVisible(!visible)}
              details={projectInfo}
              onUpdate={onUpdate}
            />
          )
        : null}

      <Wrap>
        <InfoLeft>
          <img src={projectInfo.cover} alt="" />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <OmitText width={340}>{projectInfo.name}</OmitText>
            <ClickIcon
              hidden={getIsPermission(
                userInfo?.company_permissions,
                'b/project/update',
              )}
              onClick={() => setVisible(true)}
              style={{
                marginLeft: 24,
                cursor: 'pointer',
              }}
              type="edit-square"
            />
          </div>
          <SubText>{projectInfo.info || '--'}</SubText>
        </InfoLeft>
        <InfoRight>
          <InfoItem>
            <div>{t('project.projectId')}</div>
            <span>{projectInfo.id}</span>
          </InfoItem>
          <InfoItem>
            <div>{t('common.createName')}：</div>
            <span>{projectInfo.userName || '--'}</span>
          </InfoItem>
          <InfoItem>
            <div>{t('common.createTime')}：</div>
            <span>{projectInfo.createTime || '--'}</span>
          </InfoItem>
          <InfoItem>
            <div>{t('common.endTime')}：</div>
            <span>{projectInfo.endTime || '--'}</span>
          </InfoItem>
          <InfoItem>
            <div>{t('project.projectStatus')}：</div>
            <span>
              {projectInfo.status === 1 ? t('common.open') : t('common.stop')}
            </span>
          </InfoItem>
          <InfoItem>
            <div>{t('common.permission')}：</div>
            <span>
              {projectInfo.isPublic === 1
                ? t('project.companyOpen')
                : t('common.privateProject')}
            </span>
          </InfoItem>
          <CardGroup size={24}>
            <CardItem>
              <div>{projectInfo.demandCount || 0}</div>
              <span>{t('common.demand')}</span>
            </CardItem>
            <CardItem>
              <div>{projectInfo.iterateCount || 0}</div>
              <span>{t('project.iterateEdition')}</span>
            </CardItem>
            <CardItem>
              <div>{projectInfo.memberCount || 0}</div>
              <span>{t('project.projectMember')}</span>
            </CardItem>
          </CardGroup>
        </InfoRight>
      </Wrap>
    </div>
  )
}

export default ProjectInfo
