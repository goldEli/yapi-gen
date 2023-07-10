// 需求设置-工作流

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { Divider, message } from 'antd'
import { createRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CategoryWrap, StepBoxWrap } from '@/components/StyleCommon'
import StepPageOne from './components/StepPageOne'
import StepPageTwo from './components/StepPageTwo'
import { useTranslation } from 'react-i18next'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import {
  Col,
  Col2,
  RowStyle,
  StyleLeft,
  StyleRight,
  Text,
} from '../WorkReport/Formwork/RightWrap'
import { getMessage } from '@/components/Message'

const Wrap = styled.div({
  padding: 16,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const SetTitleWrap = styled.div({
  margin: '8px 24px 20px 8px',

  display: 'flex',
  alignItems: 'center',
  fontSize: 12,
})

const BackWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: 'var(--primary-d2)',
  fontWeight: 400,
  cursor: 'pointer',
})

const ContentWrap = styled.div({
  borderRadius: 6,
  background: 'white',
  width: '100%',
  height: 'calc(100% - 35px)',
  padding: 24,
  overflow: 'auto',
  position: 'relative',
})

const LabelWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 24,
  span: {
    // marginLeft: 8,
    fontFamily: 'SiYuanMedium',
    fontSize: 14,
    color: 'var(--neutral-n1-d1)',
  },
  '.provider': {
    height: 16,
    width: 3,
    background: 'var(--primary-d2)',
  },
})

const StepWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '24px 0',
})

const SetBreadcrumb = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useSelector(store => store.project)
  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0

  const onBack = () => {
    navigate(-1)
  }

  const onToSet = () => {
    const params = encryptPhp(
      JSON.stringify({
        type: activeTabs,
        id: projectInfo.id,
        pageIdx: 'main',
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
  }

  return (
    <SetTitleWrap>
      <MyBreadcrumb setName={'配置工作流'} />
      {/* <BackWrap onClick={onBack}>
        <IconFont type="return" style={{ fontSize: 16, marginRight: 6 }} />
        <span>{t('newlyAdd.back')}</span>
      </BackWrap>
      <Divider type="vertical" style={{ background: 'var(--neutral-n4)' }} />
      <div
        style={{ color: 'var(--neutral-n1-d1)', cursor: 'pointer' }}
        onClick={onToSet}
      >
        {t('newlyAdd.demandSet')}
      </div>
      <IconFont
        type="right"
        style={{ color: 'var(--neutral-n1-d1)', margin: '0 4px' }}
      />
      <div style={{ color: 'var(--neutral-n3)' }}>
        {t('newlyAdd.workflowSet')}
      </div> */}
    </SetTitleWrap>
  )
}

const Workflow = () => {
  const [t] = useTranslation()
  const { colorList, projectInfo } = useSelector(store => store.project)
  const { currentMenu } = useSelector(store => store.user)
  const [step, setStep] = useState(1)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem = {} } = paramsData
  // console.log('categoryItem------=', categoryItem)
  const ChildRef: any = createRef()
  // 计算当前选中下是否有项目管理权限
  const resultAuth =
    currentMenu?.children?.filter(
      (i: any) => i.url === '/ProjectManagement/Project',
    )?.length > 0 || true

  const onChangeStep = (val: number) => {
    if (step === val) {
      return
    }
    if (!ChildRef?.current?.list?.length && val === 2) {
      getMessage({ msg: t('newlyAdd.onlyDemandStatus'), type: 'warning' })
    } else {
      setStep(val)
      if (val === 2) {
        ChildRef?.current?.onSave()
      }
    }
  }

  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth={
        resultAuth ? 'b/project/story_config' : '/ProjectManagement/Project'
      }
      permission={
        resultAuth
          ? isLength
            ? ['0']
            : projectInfo?.projectPermissions?.map((i: any) => i.identity)
          : currentMenu?.children?.map((i: any) => i.url)
      }
    >
      <Wrap>
        <SetBreadcrumb />

        <ContentWrap>
          <LabelWrap>
            <span>{t('newlyAdd.workflowSet')}</span>
            <CategoryWrap color={categoryItem.color} bgColor={''}>
              <>
                <img
                  src={categoryItem.attachmentPath}
                  style={{ width: 20, marginRight: 4 }}
                />
                {categoryItem.name}
              </>
            </CategoryWrap>
          </LabelWrap>
          <RowStyle>
            <Col onClick={() => onChangeStep(1)}>
              <StyleLeft bgc={step === 1} />
              <Text bgc={step === 1}>编辑模板</Text>
              <StyleRight bgc={step === 1} />
            </Col>
            <Col
              style={{ transform: 'translate(-20px, 0px)' }}
              onClick={() => onChangeStep(2)}
            >
              <StyleLeft bgc={step === 2} />
              <Text bgc={step === 2}>权限配置</Text>
              <StyleRight bgc={step === 2} />
            </Col>
          </RowStyle>
          {/* <StepWrap>
            <StepBoxWrap
              style={{ cursor: 'pointer' }}
              active={step === 1}
              onClick={() => onChangeStep(1)}
            >
              <div className="border">
                <div className="circle">1</div>
              </div>
              <span>{t('newlyAdd.definitionStatus')}</span>
            </StepBoxWrap>
            <div
              style={{
                width: 160,
                height: 1,
                background: 'var(--neutral-n6-d2)',
                margin: '0 8px',
              }}
            />
            <StepBoxWrap
              style={{ cursor: 'pointer' }}
              active={step === 2}
              onClick={() => onChangeStep(2)}
            >
              <div className="border">
                <div className="circle">2</div>
              </div>
              <span>{t('newlyAdd.reviewSet')}</span>
            </StepBoxWrap>
          </StepWrap> */}
          {step === 1 ? (
            <StepPageOne onRef={ChildRef} onChangeStep={onChangeStep} />
          ) : (
            <StepPageTwo />
          )}
        </ContentWrap>
      </Wrap>
    </PermissionWrap>
  )
}

export default Workflow
