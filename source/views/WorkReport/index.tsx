import styled from '@emotion/styled'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { setWriteReportModal } from '@store/workReport'
import { useTranslation } from 'react-i18next'
import FormWorkSide from './FormWorkSide'
import ReviewSide from './ReviewSide'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import WriteReport from './FormWorkSide/WriteReport'
import ProjectDetailSide from '../SprintProjectManagement/ProjectDetailSide'
import ProjectDetailSideIteration from '../ProjectManagement/ProjectDetailSide'
import { getParamsData } from '@/tools'
import { useState } from 'react'
import ReportAssistantModal from './Review/components/ReportAssistantModal'
import { Popover } from 'antd'
import IconFont from '@/components/IconFont'
const WorkReportWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
  width: 100%;
`
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

const WorkReport = () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { visible: visibleEdit } = useSelector(
    state => state.workReport.writeReportModal,
  )
  const { language } = useSelector(store => store.global)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams) || {}
  const [reportAssistantModalObj, setReportAssistantModalObj] = useState<{
    visible: boolean
    type: 'user' | 'project'
  }>({
    visible: false,
    type: 'user',
  })

  const [position, setPosition] = useState<any>({ x: null, y: null })
  const { type } = paramsData

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

  return (
    <WorkReportWrap
      id="dropArea"
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
      <HasSideCommonLayout
        hasSide={String(pathname).includes('/Report/Statistics')}
        side={
          <>
            {String(pathname).includes('/Report/Formwork') && <FormWorkSide />}
            {String(pathname).includes('/Report/Review/') && <ReviewSide />}
            {type === 'sprint' && <ProjectDetailSide />}
            {type === 'iteration' && <ProjectDetailSideIteration />}
          </>
        }
      >
        <Outlet />
      </HasSideCommonLayout>
      <WriteReport
        isVisible={visibleEdit}
        onClose={() => dispatch(setWriteReportModal({ visible: false }))}
        title={t('report.list.writeReport')}
      />
      {location.href.includes('/Report/Review/List') ? (
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
      ) : null}
      <ReportAssistantModal
        close={() => {
          setReportAssistantModalObj({
            ...reportAssistantModalObj,
            visible: false,
          })
        }}
        visible={reportAssistantModalObj.visible}
        type={reportAssistantModalObj.type}
      />
    </WorkReportWrap>
  )
}

export default WorkReport
