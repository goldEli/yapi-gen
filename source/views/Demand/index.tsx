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

import DemandMain from './DemandMain'
import DemandInfo from './DemandInfo'
import ChangeRecord from './ChangeRecord'
import ChildDemand from './ChildDemand'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, message, Popover, Form, Select, Tooltip } from 'antd'
import DeleteConfirm from '@/components/DeleteConfirm'
import { copyLink, getIsPermission, getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { encryptPhp } from '@/tools/cryptoPhp'
import { OmitText } from '@star-yun/ui'
import Circulation from './Circulation'
import CommonModal from '@/components/CommonModal'
import ChangeStatusPopover from '@/components/ChangeStatusPopover'
import useSetTitle from '@/hooks/useSetTitle'
import { setIsRefresh } from '@store/user'
import { useDispatch, useSelector } from '@store/index'
import { getWorkflowList } from '@/services/project'
import {
  deleteDemand,
  getDemandInfo,
  updateDemandCategory,
  updateDemandStatus,
} from '@/services/demand'
import {
  setCreateDemandProps,
  setDemandInfo,
  setIsCreateDemandVisible,
  setIsRefreshComment,
  setIsUpdateDemand,
  setIsUpdateStatus,
} from '@store/demand'
import { changeId } from '@store/counterSlice'
import { onTapSearchChoose } from '@store/view'
import { changeColorText } from '@store/color-text'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import StateTag from '@/components/StateTag'
import CommonButton from '@/components/CommonButton'
import PermissionWrap from '@/components/PermissionWrap'
import CustomSelect from '@/components/CustomSelect'

const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding: 20px 16px 0 0px;
  flex-direction: column;
`

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 32,
  background: 'white',
  margin: '20px 0 6px 24px',
})

const NameWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.demandName': {
    fontSize: 16,
    color: 'var(--neutral-n1-d1)',
    marginRight: 8,
    fontFamily: 'SiYuanMedium',
  },
})

const ContentWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100% - 80px)',
  padding: '0 0 0 24px',
})

const MainWrap = styled(Space)({
  borderRadius: 4,
  background: 'white',
  width: '100%',
  position: 'relative',
  borderBottom: '1px solid var(--neutral-n6-d1)',
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
      color: 'var(--neutral-n2) !important',
      display: 'inline-block',
      height: 50,
      lineHeight: '50px',
    },
    div: {
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
      fontSize: 12,
      color: 'var(--primary-d2)',
      // background: 'var(--neutral-n1-d1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? 'var(--primary-d2) !important' : 'var(--neutral-n2)',
      borderBottom: activeIdx
        ? '2px solid var(--primary-d2)'
        : '2px solid white',
      fontWeight: activeIdx ? 'bold' : 400,
    },
    div: {
      color: activeIdx ? 'white' : 'var(--primary-d2)',
      background: activeIdx ? 'var(--primary-d2)' : 'rgba(102, 136, 255, 0.10)',
    },
  }),
)

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

const LiWrap = styled.div({
  cursor: 'pointer',
  padding: '0 16px',
  width: '100%',
  height: 32,
  display: 'flex',
  alignItems: 'center',
  background: 'var(--neutral-white-d3)',
  '&: hover': {
    background: 'var(--hover-d3)',
  },
})

const MoreItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  color: 'var(--neutral-n2)',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  padding: '0 16px',
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--hover-d3)',
  },
})

const DemandBox = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [isVisibleMore, setIsVisibleMore] = useState(false)
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
  const { projectInfo, colorList, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { demandInfo, isUpdateDemand } = useSelector(store => store.demand)
  const { currentMenu } = useSelector(store => store.user)
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

  // 计算当前选中下是否有项目管理权限
  const resultAuth =
    currentMenu?.children?.filter(
      (i: any) => i.url === '/ProjectManagement/Project',
    )?.length > 0

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const init = async () => {
    if (demandId) {
      const result = await getDemandInfo({ projectId, id: demandId })
      dispatch(setDemandInfo(result))
    }
    setLoadingState(true)
    dispatch(setIsUpdateDemand(false))
  }

  useEffect(() => {
    init()
    return () => {
      dispatch(changeId(0))
      dispatch(changeColorText(''))
      dispatch(onTapSearchChoose({}))
    }
  }, [demandId])

  useEffect(() => {
    if (isUpdateDemand) {
      init()
    }
  }, [isUpdateDemand])

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
    navigate(`/ProjectManagement/Demand?data=${params}`)
  }

  const moreClick = (e: any) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  const onEdit = () => {
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        demandId: demandInfo.id,
        projectId: demandInfo.projectId,
        isInfo: true,
      }),
    )
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({ projectId, id: demandInfo.id })
      message.success(t('common.deleteSuccess'))
      setIsDelVisible(false)
      const params = encryptPhp(JSON.stringify({ id: projectId }))
      navigate(`/ProjectManagement/Demand?data=${params}`)
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
      dispatch(setIsRefreshComment(true))
      message.success(t('common.statusSuccess'))
      if (demandId) {
        const result = await getDemandInfo({ projectId, id: demandId })
        dispatch(setDemandInfo(result))
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
      dispatch(setIsUpdateStatus(true))
      dispatch(setIsRefresh(true))
      const result = await getDemandInfo({ projectId, id: demandInfo?.id })
      dispatch(setDemandInfo(result))
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
      {resultCategory?.map((k: any) => {
        return (
          <LiWrap key={k.id} onClick={() => onClickCategory(k)}>
            <img
              src={
                k.category_attachment
                  ? k.category_attachment
                  : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
              }
              style={{
                width: '18px',
                height: '18px',
                marginRight: '8px',
              }}
              alt=""
            />
            <span>{k.content}</span>
          </LiWrap>
        )
      })}
    </div>
  )

  const onClickMoreDelete = () => {
    setIsDelVisible(true)
    setIsVisibleMore(false)
  }
  // 复制需求id
  const onCopyId = () => {
    copyLink(
      `${demandInfo?.storyPrefixKey}`,
      t('copy_requirement_number_successfully'),
      t('copy_requirement_number_failed'),
    )
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: demandInfo?.projectId,
        demandId: demandInfo?.id,
      }),
    )
    const url = `/ProjectManagement/Demand?data=${params}`
    text += `【${demandInfo?.name}】 ${beforeUrl}${url} \n`
    copyLink(
      text,
      t('successfully_copied_requirement_link'),
      t('failed_copied_requirement_link'),
    )
  }

  const moreOperation = (
    <div
      style={{
        padding: '4px 0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!isDelete && (
        <MoreItem onClick={onClickMoreDelete}>
          <span>{t('p2.delete')}</span>
        </MoreItem>
      )}
      <MoreItem onClick={onCopyId}>
        <span>{t('copy_requirement_number')}</span>
      </MoreItem>
      <MoreItem onClick={onCopyLink}>
        <span>{t('copy_title_link')}</span>
      </MoreItem>
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
            style={{ padding: '0 20px 0 24px' }}
          >
            <Form.Item label={t('newlyAdd.beforeCategory')}>
              <img
                src={
                  colorObj?.category_attachment
                    ? colorObj?.category_attachment
                    : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
                }
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '8px',
                }}
                alt=""
              />
              <span>{colorObj?.content}</span>
            </Form.Item>
            <Form.Item
              label={t('newlyAdd.afterCategory')}
              name="categoryId"
              rules={[{ required: true, message: '' }]}
            >
              <CustomSelect
                placeholder={t('common.pleaseSelect')}
                showArrow
                showSearch
                getPopupContainer={(node: any) => node}
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
              <CustomSelect
                placeholder={t('common.pleaseSelect')}
                showArrow
                showSearch
                getPopupContainer={(node: any) => node}
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
        <div style={{ paddingLeft: 24 }}>
          <MyBreadcrumb
            demand={{
              name: demandInfo?.name,
              cover: demandInfo?.category_attachment,
            }}
          />
        </div>
        <DemandInfoWrap>
          <NameWrap>
            <Tooltip title={colorObj?.content}>
              <Popover
                trigger={['hover']}
                visible={isShowChange}
                placement="bottomLeft"
                content={changeStatus}
                getPopupContainer={node => node}
                onVisibleChange={visible => setIsShowChange(visible)}
              >
                <div>
                  <img
                    src={
                      colorObj?.category_attachment
                        ? colorObj?.category_attachment
                        : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
                    }
                    style={{
                      width: '18px',
                      height: '18px',
                      marginRight: '8px',
                    }}
                    alt=""
                  />
                </div>
              </Popover>
            </Tooltip>
            <OmitText
              width={800}
              tipProps={{
                getPopupContainer: node => node,
              }}
            >
              <span className="demandName">{demandInfo?.name}</span>
            </OmitText>
            <ChangeStatusPopover
              isCanOperation={isCanEdit && !demandInfo?.isExamine}
              projectId={projectId}
              record={demandInfo}
              onChangeStatus={onChangeStatus}
            >
              <StateTag
                onClick={demandInfo?.isExamine ? onExamine : void 0}
                isShow={isCanEdit || demandInfo?.isExamine}
                name={demandInfo?.status?.status.content}
                state={
                  demandInfo?.status?.is_start === 1 &&
                  demandInfo?.status?.is_end === 2
                    ? 1
                    : demandInfo?.status?.is_end === 1 &&
                      demandInfo?.status?.is_start === 2
                    ? 2
                    : demandInfo?.status?.is_start === 2 &&
                      demandInfo?.status?.is_end === 2
                    ? 3
                    : 0
                }
              />
            </ChangeStatusPopover>
          </NameWrap>
          <Space size={16}>
            {isEdit ? null : (
              <CommonButton type="light" onClick={onEdit}>
                {t('common.edit')}
              </CommonButton>
            )}
            <Popover
              content={moreOperation}
              placement="bottom"
              getPopupContainer={node => node}
              key={isVisibleMore.toString()}
              visible={isVisibleMore}
              onVisibleChange={visible => setIsVisibleMore(visible)}
            >
              <div>
                <CommonButton
                  type="light"
                  icon={isVisibleMore ? 'up' : 'down'}
                  iconPlacement="right"
                >
                  <span>{t('moreInfo')}</span>
                </CommonButton>
              </div>
            </Popover>
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

  if (!loadingState) {
    return <Loading />
  }

  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <Wrap>{content()}</Wrap>
    </PermissionWrap>
  )
}

export default DemandBox
