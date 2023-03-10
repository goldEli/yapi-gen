/* eslint-disable complexity */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { message } from 'antd'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import HaveSearchAndList from '@/components/HaveSearchAndList'
import { useSelector } from '@store/index'
import { deleteInfoDemand } from '@/services/demand'

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
  projectId?: any
  detail?: any
  onUpdate(): void
}

const ParentDemand = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const onDeleteInfoDemand = async () => {
    try {
      await deleteInfoDemand({
        projectId: props.projectId,
        demandId: props.detail?.id,
        type: 'parent',
        targetId: props.detail?.parentId,
      })
      message.success(t('common.deleteSuccess'))
      props.onUpdate()
    } catch (error) {
      //
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <DemandCheckedItem hidden={!props.detail?.parentId}>
        <div
          style={{
            color: '#323233',
            fontSize: 14,
          }}
        >
          {props.detail?.parentName}
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
          isHidden={props.detail?.parentId}
          projectId={props.projectId}
          demandId={props.detail?.id}
          isOperationParent
          placeholder={t('common.searchParent')}
          onUpdate={props.onUpdate}
        />
      )}
    </div>
  )
}

export default ParentDemand
