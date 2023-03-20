// 项目设置-项目信息

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { Space } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { getProjectInfo } from '@/services/project'
import { setProjectInfo } from '@store/project'
import { editProject } from '@store/create-propject'

const Wrap = styled.div({
  background: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  marginTop: 24,
})

const InfoLeft = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: 396,
  fontSize: 16,
  color: 'black',
  marginBottom: 40,
  img: {
    width: '100%',
    height: 186,
    borderRadius: 6,
    marginBottom: 24,
  },
})

const SubText = styled.div({
  marginTop: 4,
  color: 'var( --neutral-n2)',
  fontSize: 14,
  lineHeight: '30px',
})

const InfoRight = styled.div({
  display: 'flex',
  flexDirection: 'column',
})
const Title = styled.div({
  fontSize: 14,
  fontWeight: 'bold',
  color: 'var(--neutral-n1-d1)',
  paddingLeft: 10,
  borderLeft: '3px solid var(--primary-d2)',
  lineHeight: '16px',
})
const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 14,
  div: {
    minWidth: 120,
    color: 'var(--neutral-n3)',
    fontSize: 14,
    fontWeight: 400,
  },
  span: {
    color: 'var(--neutral-n1-d1)',
    fontSize: 14,
    fontWeight: 400,
  },
})

const CardGroup = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  marginTop: 16,
})

const CardItem = styled.div({
  height: 80,
  width: 160,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
  background: 'var(--neutral-n7)',
  div: {
    fontSize: 28,
    color: 'var(--neutral-n1-d1)',
    fontWeight: 500,
    lineHeight: '28px',
  },
  span: {
    fontSize: 14,
    color: 'var(--neutral-n3)',
  },
})

const ClickIcon = styled(IconFont)({
  color: 'var(--neutral-n1-d1)',
  fontSize: 20,
  marginLeft: 8,
  '&: hover': {
    color: 'var(--primary-d2)',
  },
})

const Line = styled.div`
  flex: 1;
`
const ProjectInfo = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const { userInfo } = useSelector(store => store.user)
  asyncSetTtile(`${t('title.a1')}【${projectInfo.name}】`)
  localStorage.setItem('memberId', projectInfo.id)
  const dispatch = useDispatch()

  return (
    <Wrap>
      <InfoLeft>
        <Title>{t('v2_1_1.projectInformation')}</Title>
        <CardGroup size={32}>
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
      </InfoLeft>
      <InfoRight>
        <Title
          style={{
            marginBottom: 16,
          }}
        >
          {t('project.projectInformation')}
        </Title>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <OmitText
            width={340}
            tipProps={{
              getPopupContainer: node => node,
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'var(--neutral-n1-d1)',
                lineHeight: '24px',
              }}
            >
              {' '}
              {projectInfo.name}
            </span>
          </OmitText>
          <ClickIcon
            hidden={getIsPermission(
              userInfo?.company_permissions,
              'b/project/update',
            )}
            onClick={() => {
              dispatch(editProject({ visible: true, id: projectInfo.id }))
            }}
            style={{
              marginLeft: 24,
              cursor: 'pointer',
            }}
            type="edit-square"
          />
        </div>
        <SubText>{projectInfo.info || '--'}</SubText>
        <div
          style={{
            display: 'flex',
            marginTop: '24px',
          }}
        >
          <Line>
            {' '}
            <InfoItem>
              <div>{t('project.projectId')}：</div>
              <span>{projectInfo.id}</span>
            </InfoItem>
            <InfoItem>
              <div>{t('common.createName')}：</div>
              <span>{projectInfo.userName || '--'}</span>
            </InfoItem>
          </Line>
          <Line>
            {' '}
            <InfoItem>
              <div>{t('common.createTime')}：</div>
              <span>{projectInfo.createTime || '--'}</span>
            </InfoItem>
            <InfoItem>
              <div>{t('common.endTime')}：</div>
              <span>{projectInfo.endTime || '--'}</span>
            </InfoItem>
          </Line>
          <Line>
            {' '}
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
          </Line>
        </div>
      </InfoRight>
    </Wrap>
  )
}

export default ProjectInfo
