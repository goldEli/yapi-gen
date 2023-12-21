/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable no-negated-condition */
import CommonButton from '@/components/CommonButton'
import styled from '@emotion/styled'
import { Input, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import PermissionConfig from './PermissionConfig'
import EditWork from './EditWork'
import { useDispatch, useSelector } from '@store/index'
import {
  setActiveItem,
  setEditSave,
  setTemplateName,
  setTemplateContentConfigs,
  setFillingRequirements,
  setReportContent,
} from '@store/formWork'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  deleteTemplate,
  upDateTemplate,
  createTemplate,
} from '@/services/formwork'
import { getTemplateList, templateDetail } from '@store/formWork/thunk'
import { useTranslation } from 'react-i18next'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { getMessage } from '@/components/Message'
import PreviewDialog from './PreviewDialog'
import { aWeekDataList } from './DataList'

const RightFormWorkStyle = styled.div`
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  background: var(--neutral-white-d1);
  height: calc(100% - 38px);
`

const HeaderOperate = styled.div`
  padding: 20px 24px 0;
  height: 52px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
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
    height: '28px',
    lineHeight: '28px',
    textAlign: 'center',
    fontSize: '14px',
  },
  ({ bgc }) => ({
    backgroundColor: bgc ? 'var(--function-tag5)' : 'var(--neutral-n8)',
    color: bgc ? 'var(--primary-d1)' : 'var(--neutral-n2)',
    fontFamily: bgc ? 'SiYuanMedium' : 'inherit',
  }),
)

export const StyleRight = styled.div<{ bgc?: any }>(
  {
    width: 0,
    height: 0,
    border: '14px solid transparent',
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
    border: '14px solid transparent',
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
`

const EditFormWorkStyle = styled(Input)({
  border: 'none',
  borderRadius: 0,
  borderBottom: '1px solid var(--neutral-n6-d1)',
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
  padding-right: 24px;
`
const RightFormWork = () => {
  const [t] = useTranslation()
  const inputRefDom = useRef<any>(null)
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
    await dispatch(templateDetail({ id: activeItem.id, is_edit: 1 }))
    setIsSpinning(false)
  }
  useEffect(() => {
    activeItem?.name && setValue(activeItem.name)
    activeItem?.id && getTemplateDetail()
  }, [activeItem])

  // 删除模板
  const deleteActiveItem = async () => {
    if (activeItem?.id) {
      await deleteTemplate({ id: activeItem?.id })
    }
    const res = await dispatch(getTemplateList())
    if (res.payload?.length >= 1) {
      dispatch(
        setActiveItem({ id: res?.payload[0]?.id, name: res?.payload[0]?.name }),
      )
    } else {
      // 初始化
      dispatch(setActiveItem({ name: '' }))
      dispatch(setTemplateName(''))
      dispatch(
        setTemplateContentConfigs([
          {
            name: '汇报对象',
            is_required: 1,
            tips: '',
            type: 1,
          },
        ]),
      )
      const claerConfig: any = {
        day: aWeekDataList,
        template_configs: [],
        hand_scope: 1,
        is_all_write: 2,
        is_all_view: 2,
        is_submitter_edit: true,
        is_cycle_limit: true,
        is_supply: true,
        reminder_time: 2 * 60 * 60,
        auto_reminder: true,
        submit_cycle: 1,
        is_holiday: true,
        end_time: {
          day_type: 2,
          time: 0,
        },
        start_time: {
          day_type: 1,
          time: 0,
        },
      }
      dispatch(
        setReportContent({
          template_configs: [],
          is_all_view: 2,
          is_all_write: 2,
        }),
      )
      dispatch(setFillingRequirements(claerConfig))
    }
    setDelIsVisible(false)
    getMessage({ msg: t('formWork.message2'), type: 'success' })
  }
  const getEndTime = (timeVal: number) => {
    let timeValLen = String(timeVal)
    return timeValLen.length === 13 ? timeVal / 1000 : timeVal
  }
  const getTemplateSort = (list: any) => {
    const sortData = list.map((item: any, index: number) => ({
      ...item,
      sort: index,
    }))
    sortData.forEach((el: any) => {
      Number(el.id) < 1 && delete el.id
    })
    return sortData
  }
  const getVerifyParams = (parmas: any) => {
    if (!parmas.name) {
      getMessage({ msg: t('formWork.text11'), type: 'warning' })
      return false
    }
    // 谁可以写是必填的
    if (parmas.is_all_write !== 1) {
      const list = parmas.template_configs.filter(
        (el: any) => el.user_type === 1,
      )
      if (list?.length < 1) {
        getMessage({ msg: t('formWork.message1'), type: 'warning' })
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
          getMessage({ msg: t('formWork.msg10'), type: 'warning' })
          return false
        }
      }
      if (!parmas.requirement.start_time) {
        getMessage({ msg: t('formWork.message3'), type: 'warning' })
        return false
      } else if (!parmas.requirement.end_time) {
        getMessage({ msg: t('formWork.message4'), type: 'warning' })
        return false
      } else if (!parmas.reminder_time) {
        getMessage({ msg: t('formWork.message5'), type: 'warning' })
        return false
      }
    }
    if (parmas.submit_cycle === 4) {
      if (!parmas.requirement.end_time) {
        getMessage({ msg: t('formWork.message4'), type: 'warning' })
        return false
      } else if (!parmas.reminder_time) {
        getMessage({ msg: t('formWork.message5'), type: 'warning' })
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
      template_content_configs: getTemplateSort(templateContentConfigs),
      template_configs: config,
      id: activeItem?.id,
    }
    parmas.name = templateName || activeItem?.name
    parmas.requirement = {
      day:
        fillingRequirements.submit_cycle === 1
          ? fillingRequirements?.day
              .filter((el: { value: boolean }) => el.value)
              .map((el: { key: number }) => el.key)
          : [],
      end_time:
        fillingRequirements.submit_cycle === 4
          ? getEndTime(fillingRequirements?.end_time)
          : fillingRequirements?.end_time,
      start_time: fillingRequirements?.start_time,
      is_holiday: fillingRequirements?.is_holiday ? 1 : 2,
    }
    if (!getVerifyParams(parmas)) {
      return
    }
    if (!err) {
      getMessage({ msg: errMsg, type: 'warning' })
      return
    }
    if (activeItem?.id) {
      await upDateTemplate(parmas)
      getMessage({ msg: t('formWork.message6'), type: 'success' })
      await dispatch(getTemplateList())
      dispatch(setActiveItem({ name: templateName, id: activeItem?.id }))
    } else {
      const res = await createTemplate(parmas)
      await dispatch(getTemplateList())
      dispatch(setActiveItem({ id: res.data.id, name: res.data.name }))
      getMessage({ msg: t('formWork.message7'), type: 'success' })
    }
    dispatch(setEditSave(true))
  }
  const getBtn = () => {
    // 编辑的两个tabsd 情况都出现保存，新增编辑权限中出现
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

  useEffect(() => {
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }, [])
  return (
    <RightFormWorkStyle>
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
              style={{ margin: '0 16px 0 16px' }}
            >
              {t('formWork.t6')}
            </CommonButton>
            {/* 上一步/下一步或者是保存按钮 */}
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
            {getBtn()}
          </BtnRight>
        </HeaderOperate>
        {/* 编辑 */}
        {isActive === 0 ? (
          <EditFormWorkBox>
            <EditFormWorkStyle
              ref={inputRefDom}
              placeholder={t('formWork.t7')}
              value={value}
              autoFocus
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
      </Spin>
    </RightFormWorkStyle>
  )
}
export default RightFormWork
