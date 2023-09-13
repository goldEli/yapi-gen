import React, { useEffect, useState } from 'react'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import { ProjectWrap } from './style'
import ProjectDetailSide from './ProjectDetailSide'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { saveInputKey } from '@store/view'
import { getParamsData } from '@/tools'
import { setActiveCategory } from '@store/category/index'
import { setCategoryList } from '@store/category'
import { Popover } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import ReportAssistantModal from '@/views/WorkReport/Review/components/ReportAssistantModal'
interface IProps {}

const RobotButton = styled.div`
  position: fixed;
  z-index: 99;
  bottom: 100px;
  right: 40px;
  cursor: pointer;
  user-select: none;
  .popover_yang {
    left: -115px !important;
  }
`

const MenuItem = styled.div`
  height: 40px;
  font-size: 14px;
  color: var(--neutral-n2);
  display: flex;
  align-items: center;
  padding: 0px 16px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: var(--hover-d3);
    color: var(--neutral-n1-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

const Project: React.FC<IProps> = props => {
  const path = [
    '/SprintProjectManagement/KanBan',
    '/SprintProjectManagement/SprintReport',
    '/SprintProjectManagement/Sprint',
    '/SprintProjectManagement/Affair',
    '/SprintProjectManagement/Setting',
    '/SprintProjectManagement/DemandSetting',
    '/SprintProjectManagement/WorkFlow',
    '/SprintProjectManagement/SprintProjectDetail',
    '/SprintProjectManagement/WorkHours',
  ]
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useSelector(store => store.project)
  const [isShowPage, setIsShowPage] = useState(false)
  const [reportAssistantModalObj, setReportAssistantModalObj] = useState<{
    visible: boolean
    type: 'user' | 'project'
  }>({
    visible: false,
    type: 'user',
  })
  const [t] = useTranslation()
  const [position, setPosition] = useState<any>({ x: null, y: null })
  const { language } = useSelector(store => store.global)

  const content = (
    <div style={{ padding: '4px 0px' }}>
      <MenuItem
        onClick={() =>
          setReportAssistantModalObj({
            visible: true,
            type: 'project',
          })
        }
      >
        <IconFont
          style={{
            fontSize: 16,
            color: 'var(--neutral-n3) !important',
            marginRight: 8,
          }}
          type="folder-open-nor"
        />
        <span>{t('projectDaily')}</span>
      </MenuItem>
      <MenuItem
        onClick={() =>
          setReportAssistantModalObj({
            visible: true,
            type: 'user',
          })
        }
      >
        <IconFont
          style={{
            fontSize: 16,
            marginRight: 8,
            color: 'var(--neutral-n3) !important',
          }}
          type="user"
        />
        <span>{t('singleDaily')}</span>
      </MenuItem>
    </div>
  )

  let paramsData: any
  if (
    !(
      String(location.pathname).includes(
        '/ProjectManagement/SiteNotifications',
      ) ||
      String(location.pathname) === '/SprintProjectManagement/Project' ||
      String(location.pathname) === '/SprintProjectManagement'
    )
  ) {
    paramsData = getParamsData(searchParams)
  }
  useEffect(() => {
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (projectInfo?.isPublic === 2 && !projectInfo?.isMember) {
      navigate('/PrivatePermission')
    } else {
      setIsShowPage(true)
    }
  }, [paramsData, projectInfo])
  useEffect(() => {
    dispatch(saveInputKey(''))
  }, [location.pathname])
  useEffect(() => {
    dispatch(setActiveCategory({}))
    dispatch(setCategoryList([]))
  }, [])
  return (
    <ProjectWrap
      onDrop={(event: any) => {
        event.preventDefault()
        // 更新机器人按钮的位置
        const robotButton: any = document.querySelector('#robotButton')
        const rect = document.body?.getBoundingClientRect()
        let x = event.clientX - 56
        let y = event.clientY - 54
        if (x > rect?.width - 56) {
          x = rect?.width - 112
        }
        if (x <= 0) {
          x = 0
        }
        if (y > rect?.height - 54) {
          y = rect?.height - 108
        }
        setPosition({ x, y })
        if (robotButton) {
          document.body.removeChild(robotButton)
          document.body.appendChild(robotButton)
        }
      }}
      onDragOver={(event: any) => {
        event.preventDefault()
      }}
    >
      {isShowPage ? (
        <>
          {path.includes(location.pathname) && (
            <HasSideCommonLayout side={<ProjectDetailSide />}>
              <Outlet />
            </HasSideCommonLayout>
          )}
          {!path.includes(location.pathname) && <Outlet />}
          <RobotButton
            id="robotButton"
            draggable="true"
            onDragStart={(event: any) => {
              event.dataTransfer.effectAllowed = 'move'
            }}
            style={{
              left: position.x,
              top: position.y,
              // eslint-disable-next-line no-undefined
              bottom: position.x ? undefined : 200,
              // eslint-disable-next-line no-undefined
              right: position.x ? undefined : 50,
            }}
          >
            <Popover
              placement="left"
              content={content}
              trigger="click"
              getPopupContainer={(node: any) => node.parentNode}
              overlayClassName="popover_yang"
            >
              <img
                height={108}
                src={
                  language === 'zh'
                    ? 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/RobotButton.png'
                    : 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/RobotButtonEn.png'
                }
              />
            </Popover>
          </RobotButton>
          <ReportAssistantModal
            projectId={projectInfo.id}
            close={() => {
              setReportAssistantModalObj({
                ...reportAssistantModalObj,
                visible: false,
              })
            }}
            visible={reportAssistantModalObj.visible}
            type={reportAssistantModalObj.type}
          />
        </>
      ) : null}
    </ProjectWrap>
  )
}
export default Project
