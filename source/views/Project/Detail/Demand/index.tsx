/* eslint-disable no-undefined */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable complexity */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */

import EditDemand from '@/components/EditDemandNew/index'
import DemandMain from './DemandMain'
import DemandInfo from './DemandInfo'
import ChangeRecord from './ChangeRecord'
import ChildDemand from './ChildDemand'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, Button, message, Popover, Form, Select } from 'antd'
import { ShapeContent } from '@/components/Shape'
import PopConfirm from '@/components/Popconfirm'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'
import { getIsPermission, getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { encryptPhp } from '@/tools/cryptoPhp'
import { OmitText } from '@star-yun/ui'
import { CanOperationCategory, StatusWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import Circulation from './Circulation'
import CommonModal from '@/components/CommonModal'
import useSetTitle from '@/hooks/useSetTitle'
import { changeId } from '../../../../../store/counterSlice'
import { setIsRefresh } from '@store/user'
import { useDispatch, useSelector } from '@store/index'
import { getWorkflowList } from '@/services/project'

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
    fontWeight: 'bold',
    color: 'black',
    marginRight: 8,
  },
})

const ContentWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100% - 84px)',
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
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
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
      fontWeight: activeIdx ? 'bold' : 400,
    },
    div: {
      color: activeIdx ? 'white' : '#2877FF',
      background: activeIdx ? '#2877FF' : '#F0F4FA',
    },
  }),
)

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

const LiWrap = styled.div<{ color: any }>(
  {
    cursor: 'pointer',
    padding: '0 16px',
    width: '100%',
    height: 32,
    display: 'flex',
    alignItems: 'center',
    background: 'white',
  },
  ({ color }) => ({
    '&: hover': {
      background: color,
    },
  }),
)

const DemandBox = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [isShowChange, setIsShowChange] = useState(false)
  const [isShowCategory, setIsShowCategory] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [colorObj, setColorObj] = useState<any>({})
  const [resultCategory, setResultCategory] = useState([])
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { type } = paramsData
  const { demandId } = paramsData
  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )
  const { colorList, projectInfoValues } = useModel('project')
  const {
    getDemandInfo,
    demandInfo,
    deleteDemand,
    updateDemandStatus,
    setIsShowProgress,
    setFilterHeight,
    updateDemandCategory,
    setIsUpdateStatus,
  } = useModel('demand')
  const navigate = useNavigate()
  const asyncSetTtile = useSetTitle()
  asyncSetTtile(`${t('title.need')}【${projectInfo.name}】`)
  const isEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const isDelete = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
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
    return () => {
      dispatch(changeId(0))
    }
  }, [])

  useEffect(() => {
    // 获取项目信息中的需求类别
    const list = projectInfoValues?.filter((i: any) => i.key === 'category')[0]
      ?.children

    setColorObj(list?.filter((k: any) => k.id === demandInfo?.category)[0])
    setResultCategory(
      list
        ?.filter((i: any) => i.id !== demandInfo?.category)
        ?.filter((i: any) => i.status === 1),
    )
  }, [demandInfo, projectInfoValues])

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
      const params = encryptPhp(JSON.stringify({ id: projectId }))
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
    message.warning(t('newlyAdd.underReview'))
  }

  const onCloseCategory = () => {
    setIsShowCategory(false)
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  const onConfirmCategory = async () => {
    await form.validateFields()
    try {
      await updateDemandCategory({
        projectId,
        id: demandInfo?.id,
        ...form.getFieldsValue(),
      })
      message.success(t('newlyAdd.changeSuccess'))
      setIsShowCategory(false)
      setIsUpdateStatus(true)
      dispatch(setIsRefresh(true))
      getDemandInfo({ projectId, id: demandInfo?.id })
      setTimeout(() => {
        form.resetFields()
      }, 100)
    } catch (error) {
      //
    }
  }

  const onChangeSelect = async (value: any) => {
    if (value) {
      const result = await getWorkflowList({
        projectId: paramsData.id,
        categoryId: value,
      })
      setWorkList(result)
    } else {
      form.resetFields()
    }
  }

  const onClickCategory = async (k: any) => {
    const result = await getWorkflowList({
      projectId: paramsData.id,
      categoryId: k.id,
    })
    setWorkList(result)
    form.setFieldsValue({
      categoryId: k.id,
    })
    setIsShowChange(false)
    setIsShowCategory(true)
  }

  const changeStatus = (
    <div
      style={{
        padding: '4px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {resultCategory?.map((k: any) => (
        <LiWrap
          key={k.id}
          color={colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor}
          onClick={() => onClickCategory(k)}
        >
          <CanOperationCategory
            style={{ marginRight: 0, cursor: 'pointer' }}
            color={k.color}
            bgColor={
              colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor
            }
          >
            <span className="title">{k.content}</span>
          </CanOperationCategory>
        </LiWrap>
      ))}
    </div>
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
        <CommonModal
          isVisible={isShowCategory}
          onClose={onCloseCategory}
          title={t('newlyAdd.changeCategory')}
          onConfirm={onConfirmCategory}
        >
          <FormWrap
            form={form}
            layout="vertical"
            style={{ padding: '0 20px 0 2px' }}
          >
            <Form.Item label={t('newlyAdd.beforeCategory')}>
              <CanOperationCategory
                style={{ marginRight: 8, cursor: 'pointer' }}
                color={colorObj?.color}
                bgColor={
                  colorList?.filter((i: any) => i.key === colorObj?.color)[0]
                    ?.bgColor
                }
              >
                <span className="title">{colorObj?.content}</span>
              </CanOperationCategory>
            </Form.Item>
            <Form.Item
              label={t('newlyAdd.afterCategory')}
              name="categoryId"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder={t('common.pleaseSelect')}
                showArrow
                showSearch
                getPopupContainer={node => node}
                allowClear
                optionFilterProp="label"
                onChange={onChangeSelect}
                options={resultCategory?.map((k: any) => ({
                  label: k.content,
                  value: k.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label={t('newlyAdd.afterStatus')}
              name="statusId"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder={t('common.pleaseSelect')}
                showArrow
                showSearch
                getPopupContainer={node => node}
                allowClear
                optionFilterProp="label"
                options={workList?.list?.map((k: any) => ({
                  label: k.name,
                  value: k.statusId,
                }))}
              />
            </Form.Item>
          </FormWrap>
        </CommonModal>
        <DeleteConfirm
          text={t('common.confirmDelDemand')}
          isVisible={isDelVisible}
          onChangeVisible={() => setIsDelVisible(!isDelVisible)}
          onConfirm={onDeleteConfirm}
        />
        <DemandInfoWrap>
          <NameWrap>
            <Popover
              trigger={['hover']}
              visible={isShowChange}
              placement="bottomLeft"
              content={changeStatus}
              getPopupContainer={node => node}
              onVisibleChange={visible => setIsShowChange(visible)}
            >
              <CanOperationCategory
                style={{
                  cursor: resultCategory?.length > 0 ? 'pointer' : 'inherit',
                  marginRight: 8,
                }}
                color={colorObj?.color}
                bgColor={
                  colorList?.filter((i: any) => i.key === colorObj?.color)[0]
                    ?.bgColor
                }
              >
                <span className="title">{colorObj?.content}</span>
                {resultCategory?.length > 0 && (
                  <IconFont
                    type="down-icon"
                    style={{
                      fontSize: 12,
                      marginLeft: 4,
                      color: '43BA9A',
                    }}
                  />
                )}
              </CanOperationCategory>
            </Popover>
            <div className="demandName">【{demandInfo?.id}】</div>
            <OmitText
              width={800}
              tipProps={{
                getPopupContainer: node => node,
              }}
            >
              <span className="demandName">{demandInfo?.name}</span>
            </OmitText>
            <PopConfirm
              content={({ onHide }: { onHide(): void }) => {
                return isCanEdit && !demandInfo?.isExamine ? (
                  <ShapeContent
                    tap={(value: any) => onChangeStatus(value)}
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
                  color: demandInfo?.status?.status?.color,
                  border: `1px solid ${demandInfo?.status?.status?.color}`,
                }}
              >
                {demandInfo?.status?.status?.content}
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
              <span>{t('newlyAdd.circulationRecord')}</span>
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
  if (!loadingState) {
    return <Loading />
  }

  return (
    <div style={{ height: 'calc(100% - 64px)' }}>
      <EditDemand
        visible={isVisible}
        onChangeVisible={onChangeVisible}
        demandId={operationItem.id}
        onUpdate={onUpdate}
        isInfo={type === 'info'}
      />
      {content()}
    </div>
  )
}

export default DemandBox
