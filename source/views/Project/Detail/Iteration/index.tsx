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
import { Space, Button, message } from 'antd'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 64,
  background: 'white',
  padding: '0 24px',

  // position: 'sticky',
  // top: 64,
  // zIndex: 2,
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
      color: '#969799',
      background: '#F2F2F4',
      '&: hover': {
        color: '#2877FF',
        background: '#F0F4FA',
      },
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? '#2877FF' : '#323233',
      borderBottom: activeIdx ? '2px solid #2877FF' : '2px solid white',
    },
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
  const { getIterateInfo, iterateInfo, deleteIterate } = useModel('iterate')
  const [isDelete, setIsDelete] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)
  const { projectInfo } = useModel('project')

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
    if (iterateId) {
      getIterateInfo({ projectId, id: iterateId })
    }
  }, [])

  const onChangeIdx = (val: string) => {
    navigate(
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
      <>
        <DeleteConfirm
          text="确认删除该迭代？"
          isVisible={isDelete}
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />
        <DemandInfoWrap>
          <NameWrap>
            <span>{iterateInfo.name}</span>
            <div>{iterateInfo.status === 1 ? t('common.open') : '关闭'}</div>
          </NameWrap>
          <Space size={16}>
            {hasEdit
              ? null
              : (
                  <Button type="primary" onClick={onChangeEditVisible}>
                    {t('common.edit')}
                  </Button>
                )}
            {hasDel
              ? null
              : (
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
      </>
    )
  }

  return (
    <PermissionWrap
      auth="迭代"
      hasWidth
      permission={projectInfo.projectPermissions}
      isType={1}
    >
      <EditIteration
        visible={isVisible}
        onChangeVisible={() => onChangeVisible('clear')}
        id={operationDetail.id}
        onUpdate={setIsUpdateState}
      />
      {content()}
    </PermissionWrap>
  )
}

export default IterationWrap
