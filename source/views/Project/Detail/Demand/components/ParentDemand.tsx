/* eslint-disable complexity */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { message } from 'antd'
import IconFont from '@/components/IconFont'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import HaveSearchAndList from '@/components/HaveSearchAndList'
import { useDispatch, useSelector } from '@store/index'
import { setDemandInfo } from '@store/demand'
import { deleteInfoDemand, getDemandInfo } from '@/services/project/demand'

const DemandCheckedItem = styled.div({
  minHeight: 22,
  lineHeight: '22px',
  padding: '0 8px 0 0',
  fontSize: 12,
  position: 'relative',
  color: '#323233',
  boxSizing: 'border-box',
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  '.icon': {
    visibility: 'hidden',
    marginLeft: 8,
    cursor: 'pointer',
  },
  '&:hover': {
    '.icon': {
      visibility: 'visible',
    },
  },
})

interface Props {
  addWrap: React.ReactElement
  isRight?: any
}

const ParentDemand = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo } = useSelector(store => store.project)
  const { demandInfo } = useSelector(store => store.demand)
  const dispatch = useDispatch()
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const onDeleteInfoDemand = async () => {
    try {
      await deleteInfoDemand({
        projectId,
        demandId: demandInfo?.id,
        type: 'parent',
        targetId: demandInfo?.parentId,
      })
      message.success(t('common.deleteSuccess'))
      const result = await getDemandInfo({ projectId, id: demandInfo?.id })
      dispatch(setDemandInfo(result))
    } catch (error) {
      //
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DemandCheckedItem hidden={!demandInfo?.parentId}>
        <div
          style={{
            color: '#323233',
            fontSize: 14,
          }}
        >
          {demandInfo?.parentName}
          {isCanEdit && (
            <IconFont
              onClick={isCanEdit ? onDeleteInfoDemand : void 0}
              className="icon"
              type="close"
            />
          )}
        </div>
      </DemandCheckedItem>
      {isCanEdit && (
        <HaveSearchAndList
          isRight
          addWrap={props.addWrap}
          isHidden={demandInfo?.parentId}
          projectId={projectId}
          demandId={demandInfo?.id}
          isOperationParent
          placeholder={t('common.searchParent')}
        />
      )}
    </div>
  )
}

export default ParentDemand
