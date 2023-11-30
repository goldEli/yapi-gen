// 需求设置-工作流

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { createRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CategoryWrap } from '@/components/StyleCommon'
import StepPageOne from './components/StepPageOne'
import StepPageTwo from './components/StepPageTwo'
import { useTranslation } from 'react-i18next'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import { getMessage } from '@/components/Message'
import {
  RowStyle,
  Col,
  StyleLeft,
  StyleRight,
  Text,
} from '../Layout/Report/Formwork/RightWrap'

const Wrap = styled.div({
  padding: 16,
  height: '100%',
  width: 'calc(100% - 220px)',
  display: 'flex',
  flexDirection: 'column',
})

const ContentWrap = styled.div({
  borderRadius: 6,
  background: 'white',
  width: '100%',
  height: 'calc(100% - 35px)',
  padding: '4px 16px 0px 8px',
  overflow: 'auto',
  position: 'relative',
})

const LabelWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 24,
  span: {
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

const Workflow = () => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const [step, setStep] = useState(1)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)

  const { categoryItem } = paramsData
  const ChildRef: any = createRef()

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
      auth="b/project/story_config"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <Wrap>
        <ContentWrap>
          <LabelWrap>
            <span>{t('newlyAdd.workflowSet')}</span>
            <CategoryWrap color={categoryItem?.color} bgColor={''}>
              <>
                <img
                  src={categoryItem?.attachmentPath}
                  style={{ width: 20, marginRight: 4 }}
                />
                {categoryItem?.name}
              </>
            </CategoryWrap>
          </LabelWrap>
          <RowStyle>
            <Col onClick={() => onChangeStep(1)}>
              <StyleLeft bgc={step === 1} />
              <Text bgc={step === 1}>{t('sprintProject.editTemplate')}</Text>
              <StyleRight bgc={step === 1} />
            </Col>
            <Col
              style={{ transform: 'translate(-20px, 0px)' }}
              onClick={() => onChangeStep(2)}
            >
              <StyleLeft bgc={step === 2} />
              <Text bgc={step === 2}>{t('sprintProject.rightsProfile')}</Text>
              <StyleRight bgc={step === 2} />
            </Col>
          </RowStyle>
          {step === 1 ? (
            <StepPageOne onRef={ChildRef} onChangeStep={onChangeStep} />
          ) : (
            <StepPageTwo onCancel={()=>setStep(1)}/>
          )}
        </ContentWrap>
      </Wrap>
    </PermissionWrap>
  )
}

export default Workflow
