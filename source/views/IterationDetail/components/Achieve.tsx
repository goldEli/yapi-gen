// 迭代详情-迭代成果

import { getIsPermission, getParamsData } from '@/tools'
import { css } from '@emotion/css'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { getAchieveInfo } from '@/services/iterate'
import { setAchieveInfo } from '@store/iterate'
import CommonButton from '@/components/CommonButton'
import EditAchievements from './EditAchievements'
import Achievements from './Achievements'

const wrap = css`
  background: white;
  border-radius: 6px;
`

interface AchieveProps {
  activeKey: string
}

const Achieve = (props: AchieveProps) => {
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
    if (props.activeKey === '4') {
      getInfo()
    }
  }, [props.activeKey])

  return (
    <div>
      <div className={wrap}>
        {isCanEdit ? null : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              margin: '8px 0',
            }}
          >
            <CommonButton type="primaryText" onClick={() => setIsEdit(true)}>
              {t('p2.editAchievements')}
            </CommonButton>
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
