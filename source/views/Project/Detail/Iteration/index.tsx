/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import EditIteration from './components/EditIteration'
import IterationMain from './IterationMain'
import IterationInfo from './IterationInfo'
import ChangeRecord from './ChangeRecord'
import Demand from './Demand'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, Button, message, Popover } from 'antd'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission, openDetail } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'

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
  '.name': {
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
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? '#2877FF' : '#323233',
      borderBottom: activeIdx ? '2px solid #2877FF' : '2px solid white',
    },
  }),
)

const StatusTag = styled.div<{ isOpen: boolean }>(
  {
    height: 22,
    borderRadius: 6,
    textAlign: 'center',
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    cursor: 'pointer',
  },
  ({ isOpen }) => ({
    color: isOpen ? '#43BA9A' : '#969799',
    background: isOpen ? '#EDF7F4' : '#F2F2F4',
  }),
)

const IterationWrap = () => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const projectId = searchParams.get('id')
  const navigate = useNavigate()
  const iterateId = searchParams.get('iterateId')
  const {
    getIterateInfo,
    iterateInfo,
    deleteIterate,
    updateIterateStatus,
    setFilterHeightIterate,
  } = useModel('iterate')
  const [isDelete, setIsDelete] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)
  const { projectInfo } = useModel('project')

  const hasChangeStatus = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/status',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/del',
  )

  const childContent = () => {
    if (type === 'info') {
      return <IterationInfo />
    } else if (type === 'demand') {
      return <Demand />
    }
    return <ChangeRecord />
  }

  useEffect(() => {
    setFilterHeightIterate(52)
    if (iterateId) {
      getIterateInfo({ projectId, id: iterateId })
    }
  }, [])

  const onChangeIdx = (val: string) => {
    openDetail(
      `/Detail/Iteration?type=${val}&id=${projectId}&iterateId=${iterateId}`,
    )
  }

  const onChangeOperation = (item: any) => {
    setOperationDetail(item)
    if (item.id) {
      getIterateInfo({ projectId, id: item?.id })
    }
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteIterate({ projectId, id: iterateId })
      message.success(t('common.deleteSuccess'))
      setIsDelete(false)
      navigate(`/Detail/Iteration?id=${projectId}`)
    } catch (error) {

      //
    }
  }

  const onChangeVisible = (val?: any) => {
    setIsVisible(!isVisible)
    if (val) {
      setOperationDetail({})
    }
  }

  const onChangeEditVisible = () => {
    setIsVisible(!isVisible)
    setOperationDetail(iterateInfo)
  }

  const onChangeStatus = async (val: number) => {
    if (val !== iterateInfo?.status) {
      try {
        await updateIterateStatus({
          projectId,
          id: iterateInfo?.id,
          status: val === 1,
        })
        message.success(t('common.editS'))
        getIterateInfo({ projectId, id: iterateInfo?.id })
      } catch (error) {

        //
      }
    }
  }

  const changeStatus = (
    <Space
      size={8}
      style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}
    >
      <StatusTag isOpen onClick={() => onChangeStatus(1)}>
        {t('common.opening')}
      </StatusTag>
      <StatusTag isOpen={false} onClick={() => onChangeStatus(2)}>
        {t('common.Closed')}
      </StatusTag>
    </Space>
  )

  const content = () => {
    if (!type) {
      return (
        <IterationMain
          onChangeVisible={onChangeVisible}
          onChangeOperation={item => onChangeOperation(item)}
          updateState={isUpdateState}
          onChangeIsUpdate={setIsUpdateState}
        />
      )
    }

    return (
      <div style={{ height: '100%' }}>
        <DeleteConfirm
          text={t('mark.editIterate')}
          isVisible={isDelete}
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />
        <DemandInfoWrap>
          <NameWrap>
            <span className="name">{iterateInfo.name}</span>
            {hasChangeStatus ? (
              <StatusTag isOpen={iterateInfo?.status === 1}>
                {iterateInfo?.status === 1
                  ? t('common.opening')
                  : t('common.Closed')}
              </StatusTag>
            ) : (
              <Popover
                placement="bottom"
                content={changeStatus}
                getPopupContainer={node => node}
              >
                {iterateInfo ? (
                  <StatusTag isOpen={iterateInfo?.status === 1}>
                    {iterateInfo?.status === 1
                      ? t('common.opening')
                      : t('common.Closed')}
                    <IconFont
                      type="down-icon"
                      style={{
                        fontSize: 12,
                        marginLeft: 4,
                        color:
                          iterateInfo?.status === 1 ? '#43BA9A' : '#969799',
                      }}
                    />
                  </StatusTag>
                ) : null}
              </Popover>
            )}
          </NameWrap>
          <Space size={16}>
            {hasEdit ? null : (
              <Button type="primary" onClick={onChangeEditVisible}>
                {t('common.edit')}
              </Button>
            )}
            {hasDel ? null : (
              <Button onClick={() => setIsDelete(!isDelete)}>
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
              <span>{t('common.iterateSurvey')}</span>
            </Item>
            <Item
              onClick={() => onChangeIdx('demand')}
              activeIdx={type === 'demand'}
            >
              <span>{t('common.demand')}</span>
              <div>{iterateInfo?.storyCount || 0}</div>
            </Item>
            <Item
              onClick={() => onChangeIdx('record')}
              activeIdx={type === 'record'}
            >
              <span>{t('common.changeRecord')}</span>
              <div>{iterateInfo?.changeCount || 0}</div>
            </Item>
          </MainWrap>
          {childContent()}
        </ContentWrap>
      </div>
    )
  }

  return (
    <div style={{ height: 'calc(100% - 64px)' }}>
      <EditIteration
        visible={isVisible}
        onChangeVisible={() => onChangeVisible('clear')}
        id={operationDetail.id}
        onUpdate={setIsUpdateState}
      />
      {content()}
    </div>
  )
}

export default IterationWrap
