/* eslint-disable complexity */
// 编辑迭代成果组件
import CommonModal from '@/components/CommonModal'
import { createRef, useEffect, useState } from 'react'
import Achievements from './Achievements'
import { useModel } from '@/models'
import { editButton } from '@/components/StyleCommon'
import { message } from 'antd'
import { getIsPermission } from '@/tools'

interface Props {
  isAchievements: boolean
  onClose(): void
  id: any
  projectId: any
  // 是否从详情过来
  isInfo: boolean
}

const EditAchievements = (props: Props) => {
  const [isEdit, setIsEdit] = useState(false)
  const childRef: any = createRef()
  const { updateAchieve, getAchieveInfo, getIterateInfo } = useModel('iterate')
  const { projectInfo } = useModel('project')
  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve',
  )

  useEffect(() => {
    setIsEdit(props.isInfo ? true : false)
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
      message.success('编辑成功！')
      onClose()
      childRef?.current?.reset()
      if (props.isInfo) {
        const obj = {
          projectId: props.projectId,
          id: props.id,
        }
        getAchieveInfo(obj)
        getIterateInfo(obj)
      }
    } catch (error) {
      //
    }
  }

  return (
    <CommonModal
      isVisible={props.isAchievements}
      width={784}
      title={isEdit ? '编辑迭代成果' : '迭代成果'}
      hasTop={
        !isEdit && !isCanEdit ? (
          <div className={editButton} onClick={() => setIsEdit(true)}>
            编辑
          </div>
        ) : null
      }
      isShowFooter={!isEdit}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {props.isAchievements && (
        <Achievements
          onRef={childRef}
          isEdit={isEdit}
          isModal
          projectId={props.projectId}
          id={props.id}
          isReadonly={props.isInfo}
        />
      )}
    </CommonModal>
  )
}

export default EditAchievements
