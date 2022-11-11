import { getIsPermission, getParamsData } from '@/tools'
import { css } from '@emotion/css'
import { createRef, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Achievements from '../components/Achievements'
import { editButton } from '@/components/StyleCommon'
import EditAchievements from '../components/EditAchievements'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'

const wrap = css`
  height: calc(100% - 24px);
  background: white;
  border-radius: 6px;
  overflow-x: auto;
  padding: 24px 4px 24px 24px;
`

const Achieve = () => {
  const [t] = useTranslation()
  const [isEdit, setIsEdit] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { iterateId } = paramsData
  const { getAchieveInfo } = useModel('iterate')
  const { projectInfo } = useModel('project')

  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve',
  )

  // 获取迭代成果详情
  const getInfo = async () => {
    await getAchieveInfo({
      projectId,
      id: iterateId,
    })
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <div style={{ height: 'calc(100% - 50px)', padding: '16px 16px 0' }}>
      <div className={wrap}>
        {isCanEdit ? null : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: 20,
            }}
          >
            <span onClick={() => setIsEdit(true)} className={editButton}>
              {t('p2.editAchievements')}
            </span>
          </div>
        )}
        <Achievements
          isModal={false}
          projectId={projectId}
          id={iterateId}
          isReadonly
        />

        {isEdit ? (
          <EditAchievements
            isAchievements={isEdit}
            onClose={() => setIsEdit(false)}
            projectId={projectId}
            id={iterateId}
            isInfo
          />
        ) : null}
      </div>
    </div>
  )
}

export default Achieve
