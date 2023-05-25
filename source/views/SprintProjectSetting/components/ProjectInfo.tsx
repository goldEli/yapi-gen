// 项目设置-项目信息

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { Space } from 'antd'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { getProjectInfo } from '@/services/project'
import { setProjectInfo } from '@store/project'
import { editProject } from '@store/create-propject'
import CategoryDropdown from '@/components/CategoryDropdown'
const Wrap = styled.div({
  background: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 0 24px 24px',
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
  fontFamily: 'SiYuanMedium',
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
  background: 'var(--hover-d2)',
  div: {
    fontSize: 28,
    color: 'var(--neutral-n1-d1)',
    fontFamily: 'SiYuanMedium',
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
  const [value, setValue] = useState<string | undefined>('')
  return (
    <Wrap>
      <div style={{ width: '400px' }}>
        <CategoryDropdown
          onClearCallback={() => {
            setValue('')
          }}
          value={value}
          onChangeCallBack={data => {
            console.log(data)
            setValue(data.name)
          }}
          projectId={605}
          is_select={2}
        ></CategoryDropdown>
      </div>

      <InfoLeft>
        <Title>{t('v2_1_1.projectInformation')}</Title>
        <CardGroup size={32}>
          <CardItem>
            <div>{projectInfo.demandCount || 0}</div>
            <span>事务</span>
          </CardItem>
          <CardItem>
            <div>{projectInfo.iterateCount || 0}</div>
            <span>冲刺</span>
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
                fontFamily: 'SiYuanMedium',
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
              dispatch(editProject({ id: projectInfo.id }))
            }}
            style={{
              marginLeft: 24,
              cursor: 'pointer',
            }}
            type="edit"
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
            <InfoItem>
              <div>{t('project_leader')}：</div>
              <span>{projectInfo.leaderName || '--'}</span>
            </InfoItem>
            <InfoItem>
              <div>{t('project.projectStatus')}：</div>
              <span>
                {projectInfo.status === 1 ? t('common.open') : t('common.stop')}
              </span>
            </InfoItem>
            <InfoItem>
              <div>{t('project_type')}：</div>
              <span>
                {projectInfo.permissionType === 1
                  ? t('enterprise_project')
                  : t('teamwork')}
              </span>
            </InfoItem>
          </Line>
          <Line>
            <InfoItem>
              <div>{t('new_p1.a8')}：</div>
              <span>{projectInfo.userName || '--'}</span>
            </InfoItem>
            <InfoItem>
              <div>{t('project_creation_time')}：</div>
              <span>{projectInfo.createTime || '--'}</span>
            </InfoItem>
            <InfoItem>
              <div>{t('project_belong')}：</div>
              <span>{projectInfo.affiliation || '--'}</span>
            </InfoItem>
          </Line>
          <Line>
            <InfoItem>
              <div>{t('keyboard')}：</div>
              <span>{projectInfo.prefix || '--'}</span>
            </InfoItem>
            <InfoItem>
              <div>{t('project_completion_time')}：</div>
              <span>{projectInfo.stopTime || '--'}</span>
            </InfoItem>
          </Line>
        </div>
      </InfoRight>
    </Wrap>
  )
}

export default ProjectInfo
