/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import EditDemand from './components/EditDemand'
import DemandMain from './DemandMain'
import DemandInfo from './DemandInfo'
import ChangeRecord from './ChangeRecord'
import ChildDemand from './ChildDemand'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, Button, message, Tooltip, Popover } from 'antd'
import { ShapeContent } from '@/components/Shape'
import PopConfirm from '@/components/Popconfirm'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { encryptPhp } from '@/tools/cryptoPhp'
import { OmitText } from '@star-yun/ui'
import { CategoryWrap, StatusWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import Circulation from './Circulation'

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 64,
  background: 'white',
  padding: '0 24px',
})

const NameWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.demandName': {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    marginRight: 8,
  },
})

const ContentWrap = styled.div({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100% - 64px)',
})

const MainWrap = styled(Space)({
  borderRadius: 4,
  paddingLeft: 24,
  background: 'white',
  width: '100%',
  position: 'relative',
})

const Item = styled.div<{ activeIdx: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    span: {
      fontSize: 14,
      fontWeight: 400,
      marginRight: 4,
      color: '#323233',
      display: 'inline-block',
      height: 50,
      lineHeight: '50px',
    },
    div: {
      height: 20,
      padding: '0 6px',
      borderRadius: '50%',
      color: '#2877FF',
      background: '#F0F4FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? '#2877FF' : '#323233',
      borderBottom: activeIdx ? '2px solid #2877FF' : '2px solid white',
    },
  }),
)

const StatusTag = styled.div<{ color?: string; bgColor?: string }>(
  {
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    cursor: 'pointer',
    marginRight: 8,
  },
  ({ color, bgColor }) => ({
    color,
    background: bgColor,
  }),
)

const DemandBox = () => {
  const [t] = useTranslation()
  const [isShowCategory, setIsShowCategory] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { type } = paramsData
  const { demandId } = paramsData
  const { projectInfo } = useModel('project')
  const {
    getDemandInfo,
    demandInfo,
    deleteDemand,
    updateDemandStatus,
    setIsShowProgress,
    setFilterHeight,
  } = useModel('demand')
  const navigate = useNavigate()
  const isEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const isDelete = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const isCanEdit
    = projectInfo.projectPermissions?.length > 0
    || projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0
  const init = async () => {
    if (demandId) {
      await getDemandInfo({ projectId, id: demandId })
    }
    setLoadingState(true)
  }
  useEffect(() => {
    init()
    setFilterHeight(52)
  }, [])

  const onChangeIdx = (val: string) => {
    const params = encryptPhp(
      JSON.stringify({ type: val, id: projectId, demandId }),
    )
    navigate(`/Detail/Demand?data=${params}`)
  }

  const moreClick = (e: any) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  const onEdit = () => {
    setIsShowProgress(true)
    setIsVisible(!isVisible)
    setOperationItem(demandInfo)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: demandInfo.id })
      message.success(t('common.deleteSuccess'))
      setIsDelVisible(false)
      const params = encryptPhp(JSON.stringify({ id: projectId, demandId }))
      navigate(`/Detail/Demand?data=${params}`)
    } catch (error) {

      //
    }
  }

  const childContent = () => {
    if (type === 'info') {
      return <DemandInfo />
    } else if (type === 'child') {
      return <ChildDemand />
    } else if (type === 'record') {
      return <ChangeRecord />
    }
    return <Circulation />
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      if (demandId) {
        getDemandInfo({ projectId, id: demandId })
      }
    } catch (error) {

      //
    }
  }

  const onExamine = () => {
    message.warning('该需求正在审核中，现在不能流转操作')
  }

  const onChangeCategory = () => {

    // 弹出需求类别框
    setIsShowCategory(true)
  }

  const changeStatus = (
    <Space
      size={8}
      style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}
    >
      <StatusTag color="#43BA9A" bgColor="#EDF7F4" onClick={onChangeCategory}>
        开发需求
      </StatusTag>
    </Space>
  )

  const content = () => {
    if (!type) {
      return (
        <DemandMain
          onSetOperationItem={setOperationItem}
          onChangeVisible={(e: any) => moreClick(e)}
          isUpdate={isUpdate}
          onIsUpdate={() => setIsUpdate(false)}
        />
      )
    }
    return (
      <>
        <DeleteConfirm
          text={t('common.confirmDelDemand')}
          isVisible={isDelVisible}
          onChangeVisible={() => setIsDelVisible(!isDelVisible)}
          onConfirm={onDeleteConfirm}
        />
        <DemandInfoWrap>
          <NameWrap>
            <Popover
              placement="bottom"
              content={changeStatus}
              getPopupContainer={node => node}
            >
              <StatusTag color="#43BA9A" bgColor="#EDF7F4">
                <>软件开发</>
                <IconFont
                  type="down-icon"
                  style={{
                    fontSize: 12,
                    marginLeft: 4,
                    color: '43BA9A',
                  }}
                />
              </StatusTag>
            </Popover>
            <Tooltip title={demandInfo?.name}>
              <OmitText width={600}>
                <span className="demandName">{demandInfo?.name}</span>
              </OmitText>
            </Tooltip>
            <PopConfirm
              content={({ onHide }: { onHide(): void }) => {
                return isCanEdit && !demandInfo?.isExamine ? (
                  <ShapeContent
                    tap={value => onChangeStatus(value)}
                    hide={onHide}
                    row={demandInfo}
                    record={{
                      id: demandInfo.id,
                      project_id: projectId,
                      status: {
                        id: demandInfo.status.id,
                        can_changes: demandInfo.status.can_changes,
                      },
                    }}
                  />
                ) : null
              }}
            >
              <StatusWrap
                onClick={demandInfo?.isExamine ? onExamine : void 0}
                isShow={isCanEdit || demandInfo?.isExamine}
                style={{
                  color: demandInfo?.status?.color,
                  border: `1px solid ${demandInfo?.status?.color}`,
                }}
              >
                {demandInfo?.status?.content_txt}
              </StatusWrap>
            </PopConfirm>
          </NameWrap>
          <Space size={16}>
            {isEdit ? null : (
              <Button type="primary" onClick={onEdit}>
                {t('common.edit')}
              </Button>
            )}
            {isDelete ? null : (
              <Button onClick={() => setIsDelVisible(true)}>
                {t('common.del')}
              </Button>
            )}
          </Space>
        </DemandInfoWrap>
        <ContentWrap>
          <MainWrap size={32}>
            <Item
              onClick={() => onChangeIdx('info')}
              activeIdx={type === 'info'}
            >
              <span>{t('project.detailInfo')}</span>
            </Item>
            <Item
              onClick={() => onChangeIdx('child')}
              activeIdx={type === 'child'}
            >
              <span>{t('common.childDemand')}</span>
              <div>{demandInfo?.childCount || 0}</div>
            </Item>
            <Item
              onClick={() => onChangeIdx('record')}
              activeIdx={type === 'record'}
            >
              <span>{t('common.changeRecord')}</span>
              <div>{demandInfo?.changeCount || 0}</div>
            </Item>
            <Item
              onClick={() => onChangeIdx('circulation')}
              activeIdx={type === 'circulation'}
            >
              <span>流转记录</span>
            </Item>
            {demandInfo?.isExamine && type === 'info' ? (
              <IconFont
                type="review"
                style={{
                  fontSize: 80,
                  position: 'absolute',
                  top: 22,
                  right: 530,
                }}
              />
            ) : null}
          </MainWrap>
          {childContent()}
        </ContentWrap>
      </>
    )
  }

  const onChangeVisible = () => {
    setIsVisible(!isVisible)
    setOperationItem({})
  }

  const onUpdate = () => {
    if (demandId) {
      getDemandInfo({ projectId, id: demandId })
    }
    setIsUpdate(true)
  }
  if (!loadingState) {
    return <Loading />
  }

  return (
    <div style={{ height: 'calc(100% - 64px)' }}>
      {isVisible ? (
        <EditDemand
          visible={isVisible}
          onChangeVisible={onChangeVisible}
          id={operationItem.id}
          onUpdate={onUpdate}
        />
      ) : null}
      {content()}
    </div>
  )
}

export default DemandBox
