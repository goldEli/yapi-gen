/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable no-negated-condition */
import CommonButton from '@/components/CommonButton'
import styled from '@emotion/styled'
import { Input, message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import PermissionConfig from './PermissionConfig'
import EditWork from './EditWork'
import PreviewDialog from '@/components/FormWork/PreviewDialog'
import { useDispatch, useSelector } from '@store/index'
import { setActiveItem, setEditSave, setTemplateName } from '@store/formWork'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  deleteTemplate,
  upDateTemplate,
  createTemplate,
} from '@/services/formwork'
import { getTemplateList, templateDetail } from '@store/formWork/thunk'
import { useTranslation } from 'react-i18next'
import NewLoadingTransition from '@/components/NewLoadingTransition'
const RightFormWorkStyle = styled.div`
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  padding-right: 24px;
`
const Title = styled.div`
  padding: 24px;
  color: var(--neutral-n1-d1);
  font-size: 16px;
  font-family: SiYuanMedium;
`
const HeaderOperate = styled.div`
  padding-left: 24px;
  height: 32px;
  display: flex;
  justify-content: space-between;
`
export const RowStyle = styled.div`
  position: relative;
  display: flex;
`
export const Col2 = styled.div`
  max-width: 200px;
  height: 32px;
  display: flex;
  position: absolute;
  right: -147px;
  &:hover {
    cursor: pointer;
  }
`
export const Col = styled.div`
  max-width: 200px;
  height: 32px;
  display: flex;
  &:hover {
    cursor: pointer;
  }
`
export const Text = styled.div<{ bgc: any }>(
  {
    padding: '0 24px 0 0',
    minWidth: '99px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '14px',
    fontFamily: 'SiYuanMedium',
  },
  ({ bgc }) => ({
    backgroundColor: bgc ? 'var(--function-tag5)' : 'var(--neutral-n8)',
    color: bgc ? 'var(--primary-d1)' : 'var(--neutral-n2)',
  }),
)
export const StyleRight = styled.div<{ bgc?: any }>(
  {
    width: 0,
    height: 0,
    border: '16px solid transparent',
    lineHeight: 0,
    fontSize: 0,
  },
  ({ bgc }) => ({
    borderColor: bgc
      ? ' transparent transparent  transparent  var(--function-tag5)'
      : ' transparent transparent  transparent  var(--neutral-n8) ',
  }),
)
export const StyleLeft = styled.div<{ bgc?: any }>(
  {
    width: 0,
    height: 0,
    border: '16px solid transparent',
    lineHeight: 0,
    fontSize: 0,
  },
  ({ bgc }) => ({
    borderColor: bgc
      ? 'var(--function-tag5)  var(--function-tag5)  var(--function-tag5)  transparent'
      : 'var(--neutral-n8)  var(--neutral-n8)  var(--neutral-n8)  transparent',
  }),
)
export const BtnRight = styled.div`
  display: flex;
`
export const EditFormWorkBox = styled.div`
  margin: 20px 0 20px 24px;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
const EditFormWorkStyle = styled(Input)({
  border: 'none',
  marginBottom: '14px',
  color: 'var(--neutral-n1-d1)',
  fontFamily: 'SiYuanMedium',
  '&::placeholder': {
    fontSize: '18px',
    color: 'var(--neutral-n4)',
  },
})
const BtnRow = styled.div`
  align-items: center;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-end;
`
const RightFormWork = () => {
  const [t] = useTranslation()
  const [isActive, setIsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const [delIsVisible, setDelIsVisible] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const {
    editSave,
    activeItem,
    reportContent,
    templateContentConfigs,
    fillingRequirements,
    err,
    templateName,
    errMsg,
  } = useSelector(store => store.formWork)
  const getTemplateDetail = async () => {
    setIsSpinning(true)
    await dispatch(templateDetail({ id: activeItem.id }))
    setIsSpinning(false)
  }
  useEffect(() => {
    if (activeItem) {
      setValue(activeItem.name)
      activeItem?.id && getTemplateDetail()
    }
  }, [activeItem])
  // 删除模板
  const deleteActiveItem = async () => {
    setDelIsVisible(false)
    if (!activeItem?.id) {
      const res = await dispatch(getTemplateList())
      return
    }
    await deleteTemplate({ id: activeItem?.id })
    const res = await dispatch(getTemplateList())
    res.payload?.length >= 1 &&
      dispatch(
        setActiveItem({ id: res.payload[0].id, name: res.payload[0].name }),
      )
    message.success(t('formWork.message2'))
  }
  const getVerifyParams = (parmas: any) => {
    // 谁可以写是必填的
    if (parmas.is_all_write !== 1) {
      const list = parmas.template_configs.filter(
        (el: any) => el.user_type === 1,
      )
      if (list?.length < 1) {
        message.warning(t('formWork.message1'))
        return false
      }
    }
    if (
      parmas.submit_cycle === 1 ||
      parmas.submit_cycle === 2 ||
      parmas.submit_cycle === 3
    ) {
      if (
        (parmas.submit_cycle === 1 || parmas.submit_cycle === 3) &&
        parmas.requirement?.start_time?.day_type ===
          parmas.requirement?.end_time?.day_type
      ) {
        if (
          parmas.requirement?.start_time?.time >
          parmas.requirement?.end_time?.time
        ) {
          message.warning(t('formWork.msg10'))
          return false
        }
      }
      if (!parmas.requirement.start_time) {
        message.warning(t('formWork.msg10'))
        return false
      } else if (!parmas.requirement.end_time) {
        message.warning(t('formWork.message4'))
        return false
      } else if (!parmas.reminder_time) {
        message.warning(t('formWork.message5'))
        return false
      }
    }
    if (parmas.submit_cycle === 4) {
      if (!parmas.requirement.end_time) {
        message.warning(t('formWork.message4'))
        return false
      } else if (!parmas.reminder_time) {
        message.warning(t('formWork.message5'))
        return false
      }
    }
    return true
  }
  const saveApi = async () => {
    const config = reportContent?.template_configs
      ?.filter((el: any) => el.target_value)
      ?.filter((item: any) => item.target_value.key !== 'all')
    let parmas: any = {}
    parmas = {
      submit_cycle: fillingRequirements?.submit_cycle,
      auto_reminder: fillingRequirements?.auto_reminder ? 1 : 2,
      reminder_time: fillingRequirements?.reminder_time,
      is_supply: fillingRequirements?.is_supply ? 1 : 2,
      is_cycle_limit: fillingRequirements?.is_cycle_limit ? 1 : 2,
      is_submitter_edit: fillingRequirements?.is_submitter_edit ? 1 : 2,
      hand_scope:
        fillingRequirements?.hand_scope?.key || fillingRequirements?.hand_scope,
      is_all_view: reportContent?.is_all_view,
      is_all_write: reportContent?.is_all_write,
      template_content_configs: templateContentConfigs,
      template_configs: config,
      id: activeItem?.id,
    }
    parmas.name = templateName || activeItem.name
    parmas.requirement = {
      day:
        fillingRequirements.submit_cycle === 1
          ? fillingRequirements?.day
              .filter((el: { value: boolean }) => el.value)
              .map((el: { key: number }) => el.key)
          : [],
      end_time:
        fillingRequirements.submit_cycle === 4
          ? fillingRequirements?.end_time / 1000
          : fillingRequirements?.end_time,
      start_time: fillingRequirements?.start_time,
      is_holiday: fillingRequirements?.is_holiday ? 1 : 2,
    }
    if (!getVerifyParams(parmas)) {
      return
    }
    if (!err) {
      message.warning(errMsg)
      return
    }
    if (activeItem?.id) {
      await upDateTemplate(parmas)
      message.success(t('formWork.message6'))
      await dispatch(getTemplateList())
    } else {
      const res = await createTemplate(parmas)
      await dispatch(getTemplateList())
      dispatch(setActiveItem({ id: res.data.id, name: res.data.name }))
      message.success(t('formWork.message7'))
    }
    dispatch(setEditSave(true))
  }
  useEffect(() => {
    setIsActive(0)
    return () => {
      dispatch(setEditSave(true))
    }
  }, [activeItem])
  const getBtn = () => {
    // 编辑的情况0和1都应该有
    if (editSave && activeItem?.id) {
      return <CommonButton type="primary">{t('formWork.save1')}</CommonButton>
    } else if (!editSave && activeItem?.id) {
      return (
        <CommonButton type="primary" onClick={() => saveApi()}>
          {t('formWork.save2')}
        </CommonButton>
      )
    } else if (!editSave && !activeItem?.id && isActive === 1) {
      return (
        <CommonButton type="primary" onClick={() => saveApi()}>
          {t('formWork.save2')}
        </CommonButton>
      )
    } else if (editSave && !activeItem?.id && isActive === 1) {
      return <CommonButton type="primary"> {t('formWork.save1')}</CommonButton>
    }
  }
  return (
    <Spin
      spinning={isSpinning}
      indicator={<NewLoadingTransition />}
      style={{
        width: '100%',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
      }}
    >
      <RightFormWorkStyle>
        <Title>{t('formWork.t1')}</Title>
        <HeaderOperate>
          <RowStyle>
            <Col onClick={() => setIsActive(0)}>
              <StyleLeft bgc={isActive === 0} />
              <Text bgc={isActive === 0}>{t('formWork.t2')}</Text>
              <StyleRight bgc={isActive === 0} />
            </Col>
            <Col2 onClick={() => setIsActive(1)}>
              <StyleLeft bgc={isActive === 1} />
              <Text bgc={isActive === 1}>{t('formWork.t4')}</Text>
              <StyleRight bgc={isActive === 1} />
            </Col2>
          </RowStyle>
          <BtnRight>
            <CommonButton type="light" onClick={() => setIsVisible(true)}>
              {t('formWork.t5')}
            </CommonButton>
            <CommonButton
              type="light"
              onClick={() => setDelIsVisible(true)}
              style={{ margin: '0 0px 0 16px' }}
            >
              {t('formWork.t6')}
            </CommonButton>
          </BtnRight>
        </HeaderOperate>
        {/* 编辑 */}
        {isActive === 0 ? (
          <EditFormWorkBox>
            <EditFormWorkStyle
              placeholder={t('formWork.t7')}
              value={value}
              maxLength={50}
              onInput={(e: any) => {
                dispatch(setEditSave(false))
                setValue(e.target.value)
                dispatch(setTemplateName(e.target.value))
              }}
            ></EditFormWorkStyle>
          </EditFormWorkBox>
        ) : null}
        {/* 编辑模板 */}
        {isActive === 0 ? (
          <EditWork value={value} back={() => setIsActive(1)} />
        ) : (
          <PermissionConfig back={() => setIsActive(0)} />
        )}
        {/* 底部保存 */}
        <BtnRow>
          {isActive === 0 ? (
            <CommonButton
              type="light"
              onClick={() => setIsActive(1)}
              style={{ marginRight: '16px' }}
            >
              {t('formWork.t8')}
            </CommonButton>
          ) : (
            <CommonButton
              type="light"
              onClick={() => setIsActive(0)}
              style={{ marginRight: '16px' }}
            >
              {t('formWork.t9')}
            </CommonButton>
          )}
          <>{getBtn()}</>
        </BtnRow>
        {/* 预览 */}
        <PreviewDialog
          dataList={[]}
          type={'formWork'}
          title={activeItem?.name}
          onClose={() => setIsVisible(false)}
          onConfirm={() => setIsVisible(false)}
          isVisible={isVisible}
        />
        {/* 删除模板 */}
        <DeleteConfirm
          title={t('formWork.t10')}
          text={t('formWork.t11')}
          isVisible={delIsVisible}
          onConfirm={deleteActiveItem}
          onChangeVisible={() => setDelIsVisible(false)}
        />
      </RightFormWorkStyle>
    </Spin>
  )
}
export default RightFormWork
