// 编辑迭代成果组件

import CommonModal from '@/components/CommonModal'
import { createRef, useEffect, useState } from 'react'
import Achievements from './Achievements'
import { Button, message, Space } from 'antd'
import { getIsPermission } from '@/tools'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import {
  getAchieveInfo,
  getIterateInfo,
  updateAchieve,
} from '@/services/iterate'
import { setAchieveInfo, setIterateInfo } from '@store/iterate'
import CommonButton from '@/components/CommonButton'
import { getMessage } from '@/components/Message'

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  padding: '0 24px',
})

interface Props {
  isAchievements: boolean
  onClose(): void
  id: any
  projectId: any

  // 是否从详情过来
  isInfo: boolean
}

const EditAchievements = (props: Props) => {
  const [t] = useTranslation()
  const [isEdit, setIsEdit] = useState(false)
  const childRef: any = createRef()
  const { projectInfo } = useSelector(store => store.project)
  const dispatch = useDispatch()
  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve',
  )

  useEffect(() => {
    setIsEdit(!!props.isInfo)
  }, [])

  // 关闭迭代成果弹窗
  const onClose = () => {
    setIsEdit(false)
    props.onClose()
  }

  // 提交迭代成果
  const onConfirm = async () => {
    const params = childRef?.current?.confirm()
    try {
      await updateAchieve({
        projectId: props.projectId,
        id: props.id,
        ...params,
      })
      getMessage({ msg: t('common.editSuccess') as string, type: 'success' })
      onClose()
      childRef?.current?.reset()
      if (props.isInfo) {
        const obj = {
          projectId: props.projectId,
          id: props.id,
        }
        const resultAchieve = await getAchieveInfo(obj)
        dispatch(setAchieveInfo(resultAchieve))

        const result = await getIterateInfo(obj)
        dispatch(setIterateInfo(result))
      }
    } catch (error) {
      //
    }
  }

  // 获取操作按钮
  const getFooter =
    !isEdit && !isCanEdit ? (
      <ModalFooter size={16}>
        <CommonButton onClick={() => setIsEdit(true)} type="primary">
          {t('common.edit')}
        </CommonButton>
      </ModalFooter>
    ) : null

  return (
    <CommonModal
      isVisible={props.isAchievements}
      width={784}
      title={isEdit ? t('p2.d1') : t('p2.d2')}
      onClose={onClose}
      onConfirm={onConfirm}
      hasFooter={getFooter}
      isShowFooter={isCanEdit}
    >
      {props.isAchievements ? (
        <Achievements
          onRef={childRef}
          isEdit={isEdit}
          isModal
          projectId={props.projectId}
          id={props.id}
          isReadonly={props.isInfo}
        />
      ) : null}
    </CommonModal>
  )
}

export default EditAchievements
