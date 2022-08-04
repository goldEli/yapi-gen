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
import { Space, Button, message } from 'antd'
import { ShapeContent } from '@/components/Shape'
import PopConfirm from '@/components/Popconfirm'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission } from '@/tools'

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 64,
  background: 'white',
  padding: '0 24px',
  position: 'sticky',
  top: 64,
  zIndex: 9,
})

const NameWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  span: {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    marginRight: 8,
  },
  div: {
    height: 22,
    borderRadius: 6,
    border: '1px solid #2877FF',
    padding: '0 8px',
    color: '#2877FF',
    fontSize: 12,
    fontWeight: 400,
  },
})

const ContentWrap = styled.div({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
})

const MainWrap = styled(Space)({
  borderRadius: 4,
  paddingLeft: 24,
  background: 'white',
  width: '100%',
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

const StatusWrap = styled.div({
  height: 22,
  borderRadius: 6,
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #2877FF',
  color: '#2877FF',
  width: 'fit-content',
  cursor: 'pointer',
})

const DemandBox = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const { projectInfo } = useModel('project')
  const { getDemandInfo, demandInfo, deleteDemand, updateDemandStatus }
    = useModel('demand')
  const navigate = useNavigate()
  const isEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const isDelete = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  useEffect(() => {
    if (demandId) {
      getDemandInfo({ projectId, id: demandId })
    }
  }, [])

  const onChangeIdx = (val: string) => {
    navigate(`/Detail/Demand?type=${val}&id=${projectId}&demandId=${demandId}`)
  }

  const moreClick = (e: any) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  const onEdit = () => {
    setIsVisible(!isVisible)
    setOperationItem(demandInfo)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: demandInfo.id })
      message.success('删除成功')
      setIsDelVisible(false)
      navigate(-1)
    } catch (error) {

      //
    }
  }

  const childContent = () => {
    if (type === 'info') {
      return <DemandInfo />
    } else if (type === 'child') {
      return <ChildDemand />
    }
    return <ChangeRecord />
  }

  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success('状态修改成功')
      if (demandId) {
        getDemandInfo({ projectId, id: demandId })
      }
    } catch (error) {

      //
    }
  }

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
          text="确认要删除当前需求？"
          isVisible={isDelVisible}
          onChangeVisible={() => setIsDelVisible(!isDelVisible)}
          onConfirm={onDeleteConfirm}
        />
        <DemandInfoWrap>
          <NameWrap>
            <span>{demandInfo?.name}</span>
            <PopConfirm
              content={({ onHide }: { onHide(): void }) => {
                return (
                  <ShapeContent
                    tap={value => onChangeStatus(value)}
                    hide={onHide}
                    record={{
                      id: demandInfo.id,
                      project_id: projectId,
                      status: {
                        id: demandInfo.status.id,
                        can_changes: demandInfo.status.can_changes,
                      },
                    }}
                  />
                )
              }}
            >
              <StatusWrap
                style={{
                  color: demandInfo?.status?.color,
                  border: `1px solid ${demandInfo?.status?.color}`,
                }}
              >
                {demandInfo?.status?.content}
              </StatusWrap>
            </PopConfirm>
          </NameWrap>
          <Space size={16}>
            {isEdit
              ? null
              : (
                  <Button type="primary" onClick={onEdit}>
                编辑
                  </Button>
                )}
            {isDelete
              ? null
              : <Button onClick={() => setIsDelVisible(true)}>删除</Button>
            }
          </Space>
        </DemandInfoWrap>
        <ContentWrap>
          <MainWrap size={32}>
            <Item
              onClick={() => onChangeIdx('info')}
              activeIdx={type === 'info'}
            >
              <span>详细信息</span>
            </Item>
            <Item
              onClick={() => onChangeIdx('child')}
              activeIdx={type === 'child'}
            >
              <span>子需求</span>
              <div>{demandInfo?.childCount || 0}</div>
            </Item>
            <Item
              onClick={() => onChangeIdx('record')}
              activeIdx={type === 'record'}
            >
              <span>变更记录</span>
              <div>{demandInfo?.changeCount || 0}</div>
            </Item>
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

  return (
    <PermissionWrap
      auth="需求"
      hasWidth
      permission={projectInfo.projectPermissions}
      isType={1}
    >
      <EditDemand
        visible={isVisible}
        onChangeVisible={onChangeVisible}
        id={operationItem.id}
        onUpdate={onUpdate}
      />
      {content()}
    </PermissionWrap>
  )
}

export default DemandBox
