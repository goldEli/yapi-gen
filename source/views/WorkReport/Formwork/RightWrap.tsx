/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable no-negated-condition */
import CommonButton from '@/components/CommonButton'
import styled from '@emotion/styled'
import { Input, message } from 'antd'
import { useEffect, useState } from 'react'
import PermissionConfig from './PermissionConfig'
import EditWork from './EditWork'
import PreviewDialog from '@/components/FormWork/PreviewDialog'
import { useDispatch, useSelector } from '@store/index'
import { setActiveItem, setTemplateName } from '@store/formWork'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  deleteTemplate,
  upDateTemplate,
  createTemplate,
} from '@/services/formwork'
import { getTemplateList, templateDetail } from '@store/formWork/thunk'
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
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-end;
`
const RightFormWork = () => {
  const [isActive, setIsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [value, setValue] = useState('')
  const [save, setSave] = useState(false)
  const dispatch = useDispatch()
  const [delIsVisible, setDelIsVisible] = useState(false)
  const {
    editSave,
    dataList,
    activeItem,
    reportContent,
    templateContentConfigs,
    templateName,
    fillingRequirements,
    err,
  } = useSelector(store => store.formWork)
  const getTemplateDetail = async () => {
    await dispatch(templateDetail({ id: activeItem.id }))
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
    await deleteTemplate({ id: activeItem.id })
    await dispatch(getTemplateList())
    dataList.length >= 1 &&
      dispatch(setActiveItem({ id: dataList[0].id, name: dataList[0].name }))
    message.success('删除成功')
  }
  useEffect(() => {
    console.log(editSave, editSave)
    setSave(editSave)
  }, [editSave])
  const getVerifyParams = (parmas: any) => {
    // 谁可以写是必填的
    if (parmas.is_all_write !== 1) {
      const list = parmas.template_configs.filter(
        (el: any) => el.user_type === 1,
      )
      list.length < 1 && message.warning('谁可以写必选')
      return false
    } else if (
      parmas.submit_cycle === 1 ||
      parmas.submit_cycle === 2 ||
      parmas.submit_cycle === 3
    ) {
      if (!parmas.requirement.start_time) {
        message.warning('开始时间必填')
        return false
      } else if (!parmas.requirement.end_time) {
        message.warning('截止时间必填')
        return false
      } else if (!parmas.reminder_time) {
        message.warning('提醒时间必填')
        return false
      }
    } else if (parmas.submit_cycle === 4) {
      if (!parmas.requirement.end_time) {
        message.warning('截止时间必填')
        return false
      } else if (!parmas.reminder_time) {
        message.warning('提醒时间必填')
        return false
      }
    }
    return true
  }
  const saveApi = async () => {
    let parmas: any = {}
    parmas = {
      submit_cycle: fillingRequirements?.submit_cycle,
      auto_reminder: fillingRequirements?.auto_reminder ? 1 : 2,
      reminder_time: fillingRequirements?.reminder_time,
      is_supply: fillingRequirements?.is_supply ? 1 : 2,
      is_cycle_limit: fillingRequirements?.is_cycle_limit ? 1 : 2,
      is_submitter_edit: fillingRequirements?.is_cycle_limit ? 1 : 2,
      hand_scope:
        fillingRequirements?.hand_scope?.key || fillingRequirements?.hand_scope,
      is_all_view: reportContent?.is_all_view,
      is_all_write: reportContent?.is_all_write,
      template_content_configs: templateContentConfigs,
      template_configs: reportContent?.template_configs?.filter(
        (el: any) => el.target_value.key !== 'all',
      ),
      id: activeItem.id || 0,
    }
    parmas.name = templateName || activeItem.name
    parmas.requirement = {
      day: fillingRequirements?.day,
      end_time: fillingRequirements?.end_time,
      start_time: fillingRequirements?.start_time,
      is_holiday: fillingRequirements?.is_holiday ? 1 : 2,
    }
    if (!getVerifyParams(parmas)) {
      return
    }
    if (!err) {
      message.warning('结束时间大于开始时间')
      return
    }
    if (activeItem?.id) {
      const res = await upDateTemplate(parmas)
      message.success('编辑成功')
      await dispatch(getTemplateList())
      dispatch(setActiveItem({ id: activeItem?.id, name: activeItem?.name }))
    } else {
      const res = await createTemplate(parmas)
      await dispatch(getTemplateList())
      dispatch(setActiveItem({ id: res.data.id, name: res.data }))
      message.success('新增成功')
    }
    localStorage.setItem('edit', '1')
  }
  return (
    <RightFormWorkStyle>
      <Title>工作日报</Title>
      <HeaderOperate>
        <RowStyle>
          <Col onClick={() => setIsActive(0)}>
            <StyleLeft bgc={isActive === 0} />
            <Text bgc={isActive === 0}>编辑模板</Text>
            <StyleRight bgc={isActive === 0} />
          </Col>
          <Col2 onClick={() => setIsActive(1)}>
            <StyleLeft bgc={isActive === 1} />
            <Text bgc={isActive === 1}>权限配置</Text>
            <StyleRight bgc={isActive === 1} />
          </Col2>
        </RowStyle>
        <BtnRight>
          <CommonButton type="light" onClick={() => setIsVisible(true)}>
            预览
          </CommonButton>
          <CommonButton
            type="light"
            onClick={() => setDelIsVisible(true)}
            style={{ margin: '0 0px 0 16px' }}
          >
            删除
          </CommonButton>
        </BtnRight>
      </HeaderOperate>
      {/* 编辑 */}
      {isActive === 0 ? (
        <EditFormWorkBox>
          <EditFormWorkStyle
            placeholder="请输入模板标题"
            value={value}
            maxLength={50}
            onInput={(e: any) => {
              localStorage.setItem('edit', '0')
              setValue(e.target.value),
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
          <CommonButton type="light" onClick={() => setIsActive(1)}>
            下一步
          </CommonButton>
        ) : (
          <CommonButton type="light" onClick={() => setIsActive(0)}>
            上一步
          </CommonButton>
        )}
        {localStorage.getItem('edit') !== '1' ? (
          <CommonButton type="primary" style={{ margin: '0 0px 0 16px' }}>
            已保存
          </CommonButton>
        ) : (
          <CommonButton
            type="primary"
            onClick={() => saveApi()}
            style={{ margin: '0 0px 0 16px' }}
          >
            保存
          </CommonButton>
        )}
      </BtnRow>
      {/* 预览 */}
      <PreviewDialog
        dataList={[]}
        type={'formWork'}
        title="工作周报预览"
        onClose={() => setIsVisible(false)}
        onConfirm={() => setIsVisible(false)}
        isVisible={isVisible}
      />
      {/* 删除模板 */}
      <DeleteConfirm
        title={'删除模板'}
        text="确认删除模版，删除后将无法汇报"
        isVisible={delIsVisible}
        onConfirm={deleteActiveItem}
        notCancel
      />
    </RightFormWorkStyle>
  )
}
export default RightFormWork
