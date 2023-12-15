// 项目设置-项目信息

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { Form, Input, Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { editProject } from '@store/create-propject'
import { TableActionItem } from '@/components/StyleCommon'
import { useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  deleteProject,
  openProject,
  stopProject,
  suspendProject,
} from '@/services/project'
import { getMessage } from '@/components/Message'
import { getProjectInfoStore } from '@store/project/project.thunk'
import { useNavigate } from 'react-router-dom'
import { get } from 'lodash'

const Wrap = styled.div({
  background: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
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
    marginTop: '4px',
  },
})

const Line = styled.div`
  flex: 1;
`

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: 'max-content',
  padding: '0 8px',
  height: 22,
  borderRadius: 2,
  div: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    marginRight: 8,
  },
  span: {
    color: 'var(--neutral-n1-d1)',
    fontSize: 14,
    fontWeight: 400,
  },
})

const OperationWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
`

const DeleteWrap = styled.div`
  display: flex;
  flex-direction: column;
  .title {
    margin-bottom: 4px;
    color: var(--neutral-n1-d1);
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .sub {
    color: var(--neutral-n3);
    font-size: 12px;
  }
  .projectName {
    margin: 0 8px;
    border-radius: 2px;
    height: 20px;
    padding: 0 8px;
    color: #ff5c5e;
    background: rgba(255, 92, 94, 0.1);
    width: max-content;
  }
`

const ProjectInfo = () => {
  const asyncSetTtile = useSetTitle()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const { userInfo, loginInfo } = useSelector(store => store.user)
  const { language } = useSelector(store => store.global)
  asyncSetTtile(`${t('title.a1')}【${projectInfo.name}】`)
  localStorage.setItem('memberId', projectInfo.id)
  const [form] = Form.useForm()

  // 当前操作的数据
  const [operationDetail, setOperationDetail] = useState<any>({})
  // 开始、关闭、暂停的弹窗状态
  const [isStatusState, setIsStatusState] = useState(false)
  // 是否删除项目
  const [isDelete, setIsDelete] = useState(false)

  const hasEdit = getIsPermission(
    userInfo?.company_permissions,
    'b/project/update',
  )

  const hasDelete = getIsPermission(
    userInfo?.company_permissions,
    'b/project/delete',
  )

  // 项目状态颜色
  const statusArr = [
    {
      id: 1,
      name: t('inProgress'),
      color: '#43BA9A',
      bg: 'rgba(67,186,154,0.1)',
    },
    {
      id: 2,
      name: t('completed'),
      color: '#A176FB',
      bg: 'rgba(161,118,251,0.1)',
    },
    {
      id: 3,
      name: t('paused'),
      color: '#FA9746',
      bg: 'rgba(250,151,70,0.1)',
    },
    {
      id: 4,
      name: t('hasNotStarted'),
      color: '#6688FF',
      bg: 'rgba(102,136,255,0.1)',
    },
  ]

  // 操作更多 例-开始等
  const onChangeOperation = (type: string, item: any, e?: any) => {
    if (e) {
      e.stopPropagation()
    }
    setOperationDetail({ ...item, ...{ clickType: type } })
    // item.status 1-开启 2-结束 3-已暂停 4-未开启
    if (type === 'delete') {
      setIsDelete(true)
    } else {
      // 结束、已暂停状态，则开始项目
      setIsStatusState(true)
    }
  }

  // 删除确认
  const onDeleteConfirm = async () => {
    await form.validateFields()
    if (form.getFieldsValue()?.name !== operationDetail?.name) {
      getMessage({
        type: 'warning',
        msg: t('theNameEnteredMustMatchTheNameOfTheDeletedProject'),
      })
      return
    }
    try {
      await deleteProject({ id: operationDetail.id })
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      setIsDelete(false)
      setOperationDetail({})
      navigate('/Project')
    } catch (error) {
      //
    }
  }

  // 操作项目
  const onOperationProject = async () => {
    // 关闭
    if (operationDetail?.clickType === 'close') {
      await stopProject({ id: operationDetail.id })
      getMessage({
        msg: t('common.endSuccess'),
        type: 'success',
      })
    } else if (operationDetail.status === 1) {
      await suspendProject({ id: operationDetail.id })
      getMessage({
        msg: t('common.pausedSuccess'),
        type: 'success',
      })
    } else {
      await openProject({ id: operationDetail.id })
      getMessage({
        msg: t('common.openSuccess'),
        type: 'success',
      })
    }

    setOperationDetail({})
    setIsStatusState(false)
    dispatch(getProjectInfoStore({ projectId: operationDetail?.id }))
  }

  // 项目负责人或者是超管
  const isRolePermission =
    loginInfo?.is_company_super_admin !== 1 &&
    projectInfo.leaderId !== userInfo?.id

  console.log(projectInfo)

  return (
    <Wrap>
      {/* 删除项目 */}
      <DeleteConfirm
        // text={t('mark.delP')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
        title={t('deleteItem')}
        width={528}
        hasIcon={false}
        okText={t('delete')}
        isRed
      >
        <DeleteWrap>
          <div className="title">
            {t('deleteAndName')}
            <div className="projectName">{projectInfo?.name}</div>
            {language === 'zh' ? '吗？' : '?'}
          </div>
          <div className="sub">
            {t('afterDeletioncommaItCannotBeRestoredPleaseOperateWithCaution')}
          </div>
          <Form form={form} style={{ marginTop: 24 }} layout="vertical">
            <Form.Item
              label={t('entryName')}
              name="name"
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <Input
                placeholder={t('pleaseEnterTheCurrentProjectName')}
                autoComplete="off"
              />
            </Form.Item>
          </Form>
        </DeleteWrap>
      </DeleteConfirm>
      {/* 关闭或者和是开启、暂停项目 */}
      <DeleteConfirm
        title={t('p2.toast')}
        text={
          operationDetail?.clickType === 'close'
            ? t('mark.endP')
            : operationDetail?.status === 1
            ? t('mark.suspendP')
            : t('mark.startP')
        }
        isVisible={isStatusState}
        onChangeVisible={() => setIsStatusState(!isStatusState)}
        onConfirm={onOperationProject}
      />
      <InfoLeft>
        <Title>{t('v2_1_1.projectInformation')}</Title>
        <CardGroup size={32}>
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
              <div>{t('project.projectStatus')}：</div>
              <span>
                {projectInfo.status === 1 ? t('common.open') : t('common.stop')}
              </span>
            </InfoItem>
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
              <div>{t('serial_number')}：</div>
              <span>{projectInfo.prefix || '--'}</span>
            </InfoItem>
            <InfoItem>
              <div>{t('project_completion_time')}：</div>
              <span>{projectInfo.stopTime || '--'}</span>
            </InfoItem>
          </Line>
        </div>
        <Title
          style={{
            margin: '48px 0 16px 0',
          }}
        >
          {t('projectOperations')}
        </Title>
        <OperationWrap>
          <StatusWrap
            style={{
              background: statusArr?.filter(
                (i: any) => i.id === projectInfo?.status,
              )[0]?.bg,
            }}
          >
            <div
              style={{
                background: statusArr?.filter(
                  (i: any) => i.id === projectInfo?.status,
                )[0]?.color,
              }}
            />
            <span>
              {
                statusArr?.filter((i: any) => i.id === projectInfo?.status)[0]
                  ?.name
              }
            </span>
          </StatusWrap>
          <Tooltip
            title={
              isRolePermission
                ? t('onlyTheProjectLeaderCanPausestartTheProject')
                : null
            }
          >
            <TableActionItem
              isDisable={isRolePermission}
              onClick={e => {
                e.stopPropagation()
                isRolePermission ? void 0 : onChangeOperation('', projectInfo)
              }}
            >
              {projectInfo?.status === 1
                ? t('suspendProject')
                : t('openProject')}
            </TableActionItem>
          </Tooltip>
          <Tooltip
            title={
              isRolePermission
                ? t('onlyTheProjectLeaderCanCloseTheProject')
                : [4, 2].includes(projectInfo?.status)
                ? t('theProjectCannotBeClosedInTheState')
                : null
            }
          >
            <TableActionItem
              isDisable={
                isRolePermission || [4, 2].includes(projectInfo?.status)
              }
              onClick={e => {
                e.stopPropagation()
                isRolePermission || [4, 2].includes(projectInfo?.status)
                  ? void 0
                  : onChangeOperation('close', projectInfo)
              }}
            >
              {t('closeProject')}
            </TableActionItem>
          </Tooltip>
          <TableActionItem
            isDisable={
              projectInfo?.team_id === 0 ? hasEdit : projectInfo?.isTeam
            }
            onClick={e => {
              e.stopPropagation()
              !(projectInfo?.team_id === 0 ? hasEdit : projectInfo?.isTeam) &&
                dispatch(editProject({ visible: true, id: projectInfo?.id }))
            }}
          >
            {t('editProject')}
          </TableActionItem>
          <TableActionItem
            isDisable={hasDelete}
            onClick={e => {
              e.stopPropagation()
              hasDelete ? void 0 : onChangeOperation('delete', projectInfo)
            }}
          >
            <span style={{ color: '#FF5C5E' }}>{t('deleteItem')}</span>
          </TableActionItem>
        </OperationWrap>
      </InfoRight>
    </Wrap>
  )
}

export default ProjectInfo
