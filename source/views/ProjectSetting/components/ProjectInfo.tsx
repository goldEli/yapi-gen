/* eslint-disable react/jsx-no-leaked-render */
// 项目设置-项目信息

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { editProject } from '@store/create-propject'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { getMessage } from '@/components/Message'
import { deleteProject } from '@/services/project'
import { useNavigate } from 'react-router-dom'

const Wrap = styled.div({
  background: 'white',
  height: '100%',
  width: '784px',
  margin: '0 auto',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  padding: '64px 0px 24px 0px',
})

const InfoLeft = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
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
  marginBottom: 24,
  flexDirection: 'column',
  div: {
    minWidth: 184,
    color: 'var(--neutral-n3)',
    fontSize: 14,
    fontWeight: 400,
  },
  span: {
    color: 'var(--neutral-n1-d1)',
    fontSize: 14,
    fontWeight: 400,
    marginTop: 8,
  },
})

const CardGroup = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  marginTop: 16,
  justifyContent: 'space-between',
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
    marginTop: '4px',
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
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const hasDelete = getIsPermission(
    userInfo?.company_permissions,
    'b/project/delete',
  )
  const onDel = () => {
    // 删除确认
    open({
      title: t('deleteConfirmation'),
      text: t('mark.delP'),
      onConfirm() {
        onDeleteConfirm()
        return Promise.resolve()
      },
    })
  }
  const onDeleteConfirm = async () => {
    try {
      await deleteProject({ id: projectInfo.id })
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      navigate('/Project')
      // eslint-disable-next-line no-inline-comments
    } catch (error) {
      /* empty */
    }
  }

  return (
    <Wrap>
      <DeleteConfirmModal />
      <InfoLeft>
        <Title>{t('v2_1_1.projectInformation')}</Title>
        <CardGroup size={32}>
          <CardItem>
            <div>{projectInfo.memberCount || 0}</div>
            <span>{t('project.projectMember')}</span>
          </CardItem>
          <CardItem>
            <div>{projectInfo.demandCount || 0}</div>
            <span>{t('common.demand')}</span>
          </CardItem>
          <CardItem>
            <div>{projectInfo.bug_count || 0}</div>
            <span>{t('sprintProject.defect')}</span>
          </CardItem>
          <CardItem>
            <div>{projectInfo.iterateCount || 0}</div>
            <span>{t('project.iterateEdition')}</span>
          </CardItem>
        </CardGroup>
      </InfoLeft>
      <InfoRight>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
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
            {!hasDelete && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'var(--auxiliary-text-t3)',
                  paddingRight: 24,
                }}
                onClick={onDel}
              >
                <ClickIcon
                  hidden={getIsPermission(
                    userInfo?.company_permissions,
                    'b/project/update',
                  )}
                  style={{
                    marginRight: 8,
                    color: 'var(--auxiliary-text-t3)',
                  }}
                  type="delete"
                />
                删除
              </div>
            )}
            {(projectInfo.permissionType === 1 || projectInfo.isTeam) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'var(--auxiliary-text-t2-d2)',
                }}
                onClick={() => {
                  dispatch(editProject({ visible: true, id: projectInfo.id }))
                }}
              >
                <ClickIcon
                  hidden={getIsPermission(
                    userInfo?.company_permissions,
                    'b/project/update',
                  )}
                  style={{
                    marginRight: 8,
                    color: 'var(--auxiliary-text-t2-d2)',
                  }}
                  type="edit"
                />
                编辑
              </div>
            )}
          </div>
        </div>
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
              <div
                style={{
                  alignSelf: 'start',
                }}
              >
                {t('project_belong')}：
              </div>
              <span>{projectInfo.affiliation || '--'}</span>
            </InfoItem>
          </Line>
          <Line>
            <InfoItem>
              <div>{t('new_p1.a8')}：</div>
              <span>{projectInfo.userName || '--'}</span>
            </InfoItem>
            <InfoItem>
              <div>{t('serial_number')}：</div>
              <span>{projectInfo.prefix || '--'}</span>
            </InfoItem>
          </Line>
          <Line>
            <InfoItem>
              <div>{t('project.projectStatus')}：</div>
              <span>
                {projectInfo.status === 1 ? t('common.open') : t('common.stop')}
              </span>
            </InfoItem>
            <InfoItem>
              <div>{t('project_creation_time')}：</div>
              <span>{projectInfo.createTime || '--'}</span>
            </InfoItem>
          </Line>
          <Line>
            <InfoItem>
              <div>{t('project_type')}：</div>
              <span>
                {projectInfo.permissionType === 1
                  ? t('enterprise_project', {
                      type:
                        projectInfo.projectType === 1
                          ? t('sprintProject.iteration')
                          : t('sprintProject.sprint'),
                    })
                  : t('teamwork', {
                      type:
                        projectInfo.projectType === 1
                          ? t('sprintProject.iteration')
                          : t('sprintProject.sprint'),
                    })}
              </span>
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
