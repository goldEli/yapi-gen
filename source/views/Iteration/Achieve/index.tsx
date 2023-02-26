// 迭代详情-迭代成果

import { getIsPermission, getParamsData } from '@/tools'
import { css } from '@emotion/css'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Achievements from '../components/Achievements'
import EditAchievements from '../components/EditAchievements'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { getAchieveInfo } from '@/services/iterate'
import { setAchieveInfo } from '@store/iterate'

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
  const { projectInfo } = useSelector(store => store.project)
  const dispatch = useDispatch()

  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve',
  )

  // 获取迭代成果详情
  const getInfo = async () => {
    const result = await getAchieveInfo({
      projectId,
      id: iterateId,
    })
    dispatch(setAchieveInfo(result))
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
            <span onClick={() => setIsEdit(true)}>
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

        <EditAchievements
          isAchievements={isEdit}
          onClose={() => setIsEdit(false)}
          projectId={projectId}
          id={iterateId}
          isInfo
        />
      </div>
    </div>
  )
}

export default Achieve
