/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
import useShareModal from '@/hooks/useShareModal'
import {
  ButtonGroup,
  ChangeIconGroup,
  DemandWrap,
  DetailTabItem,
  DetailText,
  DetailTitle,
  DetailTop,
  DownWrap,
  DropdownMenu,
  FormWrap,
  Img,
  ItemNumber,
  LiWrap,
  UpWrap,
} from './style'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useRef, useState } from 'react'
import CommonModal from '@/components/CommonModal'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form, MenuProps, Popover, Space, Tabs, TabsProps, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import { copyLink, getIsPermission } from '@/tools'
import { getMessage } from '@/components/Message'
import {
  setAddWorkItemModal,
  setIsUpdateAddWorkItem,
  setIsUpdateChangeLog,
  setIsUpdateStatus,
} from '@store/project'
import {
  deleteDemand,
  updateDemandCategory,
  updateDemandStatus,
  updateTableParams,
} from '@/services/demand'
import { getDemandCommentList, getDemandInfo } from '@store/demand/demand.thunk'
import { getWorkflowList } from '@/services/project'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setDemandInfo } from '@store/demand'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CommonIconFont from '@/components/CommonIconFont'
import CommonButton from '@/components/CommonButton'
import CopyIcon from '@/components/CopyIcon'
import ChangeStatusPopover from '@/components/ChangeStatusPopover'
import StateTag from '@/components/StateTag'
import ScreenMinHover from '@/components/ScreenMinHover'
import ChildDemand from './components/ChildDemand'
import StoryRelation from './components/StoryRelation'
import ChangeRecord from './components/ChangeRecord'
import Circulation from './components/Circulation'
import DemandInfo from './components/DemandInfo'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { DrawerHeader } from '@/components/DemandDetailDrawer/style'
import { css } from '@emotion/css'
import LeftIcontButton from '@/components/LeftIcontButton'

export const myTreeCss = css`
  &:hover {
    text-decoration: underline !important;
    text-decoration-color: var(--neutral-n1-d1) !important;
    /* padding-bottom: 4px !important; */
  }
`

const DemandDetail = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const spanDom = useRef<HTMLSpanElement>(null)
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const { demandInfo } = useSelector(store => store.demand)
  const { userInfo } = useSelector(store => store.user)
  const {
    isDetailScreenModal,
    projectInfo,
    projectInfoValues,
    isUpdateAddWorkItem,
  } = useSelector(store => store.project)
  const { visible, params } = isDetailScreenModal
  const [form] = Form.useForm()
  // 当前选中那一个
  const [tabActive, setTabActive] = useState(params.type ?? '1')
  // 是否可改变类别弹窗
  const [isShowChange, setIsShowChange] = useState(false)
  // 当前需求的下标
  const [currentIndex, setCurrentIndex] = useState(0)
  // 是否展示切换类别的弹窗
  const [isShowCategory, setIsShowCategory] = useState(false)
  // 可选择的类别数组
  const [resultCategory, setResultCategory] = useState([])
  // 当前选择类别的工作流列表
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  const projectIdRef = useRef()
  const [filter, setFilter] = useState(false)
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  // const [drawerInfo, setDrawerInfo] = useState<any>({})
  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  // 关闭弹窗
  const onClose = () => {
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    closeScreenModal()
  }

  // 关闭类别弹窗
  const onCloseCategory = () => {
    setIsShowCategory(false)
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  // 切换类别确认事件
  const onConfirmCategory = async () => {
    await form.validateFields()
    await updateDemandCategory({
      projectId: params.id,
      id: demandInfo.id,
      ...form.getFieldsValue(),
    })
    getMessage({ msg: t('newlyAdd.changeSuccess'), type: 'success' })
    setIsShowCategory(false)
    dispatch(setIsUpdateStatus(true))
    dispatch(getDemandInfo({ projectId: params.id, id: demandInfo.id }))
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  // 点击类别获取工作流列表
  const onChangeSelect = async (value: any) => {
    if (value) {
      const result = await getWorkflowList({
        projectId: params.id,
        categoryId: value,
      })
      setWorkList(result)
    } else {
      form.resetFields()
    }
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = params?.changeIds ? params?.changeIds[currentIndex - 1] : 0
    if (!currentIndex) {
      return
    }
    const resultParams = { ...params, ...{ sprintId: newIndex } }
    dispatch(saveScreenDetailModal({ visible, params: resultParams }))
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = params?.changeIds ? params?.changeIds[currentIndex + 1] : 0
    if (currentIndex === (params?.changeIds?.length || 0) - 1) {
      return
    }
    const resultParams = { ...params, ...{ sprintId: newIndex } }
    dispatch(saveScreenDetailModal({ visible, params: resultParams }))
  }

  const getKeyDown = (e: any) => {
    if (e.keyCode === 38) {
      // up
      document.getElementById('upIcon')?.click()
    }
    if (e.keyCode === 40) {
      // down
      document.getElementById('downIcon')?.click()
    }
  }

  // 分享弹窗
  const onShare = () => {
    open({
      onOk: () => {
        return Promise.resolve()
      },
    })
  }

  // 复制标题
  const onCopy = () => {
    copyLink(demandInfo.name, t('copysuccess'), t('copyfailed'))
  }

  //   编辑需求
  const onEdit = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: demandInfo.id,
          projectId: demandInfo.projectId,
          type: 1,
          title: t('editingRequirements'),
        },
      }),
    )
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    onClose()
    const resultParams = encryptPhp(
      JSON.stringify({
        type: 4,
        id: params.id,
        pageIdx: 'DemandDetail',
        categoryItem: {
          id: demandInfo.category,
          status: demandInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${resultParams}`)
  }

  // 确认删除
  const onDeleteConfirm = async () => {
    await deleteDemand({
      projectId: demandInfo.projectId,
      id: demandInfo.id,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    onClose()
    setTimeout(() => {
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }, 0)
  }

  // 删除事务弹窗
  const onDelete = () => {
    openDelete({
      title: t('deleteConfirmation'),
      text: t('mark.del'),
      onConfirm() {
        onDeleteConfirm()
        return Promise.resolve()
      },
    })
  }

  // 复制需求id
  const onCopyId = () => {
    copyLink(
      `${demandInfo.projectPrefix}-${demandInfo.prefixKey}`,
      t('copysuccess'),
      t('copyfailed'),
    )
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: demandInfo.project_id,
        detailId: demandInfo.id,
        specialType: 3,
        isOpenScreenDetail: true,
      }),
    )
    const url = `/ProjectManagement/Demand?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${demandInfo.projectPrefix}-${demandInfo.prefixKey}】${text}`,
      t('common.copySuccess'),
      t('common.copyFail'),
    )
  }

  // 更多下拉
  const items: MenuProps['items'] = [
    {
      label: <div onClick={onEdit}>{t('common.edit')}</div>,
      key: '0',
    },
    {
      label: <div onClick={onDelete}>{t('common.del')}</div>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={onCopyId}>{t('copy_requirement_number')}</div>,
      key: '2',
    },
    {
      label: <div onClick={onCopyLink}>{t('copy_title_link')}</div>,
      key: '3',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={onToConfig}>{t('configuration')}</div>,
      key: '4',
    },
  ]

  // 点击切换类别
  const onClickCategory = async (k: any) => {
    const result = await getWorkflowList({
      projectId: params.id,
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
      {resultCategory
        // 只能是需求的类别
        ?.filter((i: any) => i.work_type === 1)
        ?.map((k: any) => {
          return (
            <LiWrap key={k.id} onClick={() => onClickCategory(k)}>
              <img
                src={k.category_attachment ? k.category_attachment : ' '}
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

  // 快捷修改名称
  const onNameConfirm = async () => {
    const value = spanDom.current?.innerText
    if ((value?.length || 0) <= 0) {
      getMessage({ type: 'warning', msg: t('nameIsRequired') })
      return
    }
    if ((value?.length || 0) > 100) {
      getMessage({ type: 'warning', msg: t('nameCannotExceedCharacters') })
      return
    }
    if (value !== demandInfo.name) {
      await updateTableParams({
        projectId: params.id,
        id: demandInfo.id,
        otherParams: {
          name: value,
        },
      })
      getMessage({ type: 'success', msg: t('successfullyModified') })
      // 提交名称
      setDemandInfo({
        ...demandInfo,
        name: value,
      })
    }
  }

  // 修改事务状态
  const onChangeStatus = async (value: any) => {
    await updateDemandStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    dispatch(setIsUpdateChangeLog(true))
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

  // 是否审核
  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  // tab切换
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <DetailTabItem>
          <span>{t('details')}</span>
        </DetailTabItem>
      ),
      children: <DemandInfo />,
    },
    {
      key: '2',
      label: (
        <DetailTabItem>
          <span>{t('subRequirement')}</span>
          <ItemNumber isActive={tabActive === '2'}>
            {demandInfo?.childCount || 0}
          </ItemNumber>
        </DetailTabItem>
      ),
      children: <ChildDemand activeKey={tabActive} />,
    },
    {
      key: '3',
      label: (
        <DetailTabItem>
          <span>{t('associatedWorkItems')}</span>
        </DetailTabItem>
      ),
      children: <StoryRelation activeKey={tabActive} detail={demandInfo} />,
    },
    {
      key: '4',
      label: (
        <DetailTabItem>
          <span>{t('changeLog')}</span>
          <ItemNumber isActive={tabActive === '4'}>
            {demandInfo?.changeCount || 0}
          </ItemNumber>
        </DetailTabItem>
      ),
      children: <ChangeRecord activeKey={tabActive} filter={filter} />,
    },
    {
      key: '5',
      label: (
        <DetailTabItem>
          <span>{t('circulationRecords')}</span>
        </DetailTabItem>
      ),
      children: <Circulation activeKey={tabActive} />,
    },
  ]

  const onGetMenu = () => {
    if (isEnd) {
      return items.splice(3, 4)
    }
    return items
  }

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    if (value === '1') {
      dispatch(getDemandInfo({ projectId: params.id, id: demandInfo.id }))
    }
  }

  useEffect(() => {
    if (visible || params.demandId) {
      dispatch(getDemandInfo({ projectId: params.id, id: params.demandId }))
      dispatch(
        getDemandCommentList({
          projectId: params.id,
          demandId: params.demandId,
          page: 1,
          pageSize: 999,
        }),
      )
    }
  }, [visible, params])

  useEffect(() => {
    // 获取项目信息中的需求类别
    const list = projectInfoValues?.filter((i: any) => i.key === 'category')[0]
      ?.children
    setResultCategory(
      list
        ?.filter((i: any) => i.id !== demandInfo?.category)
        ?.filter((i: any) => i.status === 1),
    )
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex(
      (params?.changeIds || []).findIndex((i: any) => i === demandInfo?.id),
    )
  }, [demandInfo, projectInfoValues])

  useEffect(() => {
    if (isUpdateAddWorkItem && visible) {
      dispatch(getDemandInfo({ projectId: params.id, id: demandInfo.id }))
      dispatch(
        getDemandCommentList({
          projectId: params.id,
          demandId: params.demandId,
          page: 1,
          pageSize: 999,
        }),
      )
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    document.addEventListener('keydown', getKeyDown)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
    }
  }, [])

  return (
    <DemandWrap>
      <DeleteConfirmModal />
      <ShareModal
        url={`${location.origin}/ProjectManagement/Demand?data=${encryptPhp(
          JSON.stringify({
            detailId: demandInfo?.id,
            id: projectInfo.id,
            specialType: 3,
            isOpenScreenDetail: true,
          }),
        )}`}
        title={
          demandInfo?.name
            ? `【${demandInfo?.projectPrefix}${
                demandInfo?.prefixKey ? '-' : ''
              }${demandInfo?.prefixKey}-${demandInfo?.name}-${userInfo?.name}】`
            : ''
        }
      />
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
              src={demandInfo?.category_attachment}
              style={{
                width: '18px',
                height: '18px',
                marginRight: '8px',
              }}
              alt=""
            />
            <span>{demandInfo?.categoryName}</span>
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
      <DetailTop>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <MyBreadcrumb />
          <div style={{ display: 'inline-flex', marginLeft: '10px' }}>
            {demandInfo.level_tree?.map((i: any, index: number) => (
              <DrawerHeader
                style={{
                  cursor:
                    index === demandInfo?.level_tree?.length - 1
                      ? 'auto'
                      : 'pointer',
                }}
                key={i.prefix_key}
                onClick={() => {
                  // TODO
                  if (demandInfo.project_id) {
                    projectIdRef.current = demandInfo.project_id
                  }
                  const projectId = demandInfo?.projectId
                  if (index !== demandInfo?.level_tree?.length - 1) {
                    openDemandDetail({ ...i }, projectId, i.id, 0)
                  }
                }}
              >
                <span style={{ fontSize: '12px' }}>
                  <CommonIconFont
                    type="right"
                    color="var(--neutral-n1-d1)"
                  ></CommonIconFont>
                </span>
                <img
                  style={{ width: '16px', height: '16px' }}
                  src={i.category_attachment}
                  alt=""
                />
                <div
                  className={
                    index === demandInfo?.level_tree?.length - 1
                      ? ''
                      : myTreeCss
                  }
                  style={{
                    fontSize: '12px',
                    color:
                      index === demandInfo?.level_tree?.length - 1
                        ? ''
                        : 'var(--neutral-n1-d1)',
                  }}
                >
                  {i.project_prefix}-{i.prefix_key}
                </div>
              </DrawerHeader>
            ))}
          </div>
        </div>

        {demandInfo.id && (
          <ButtonGroup size={16}>
            {(params?.changeIds?.length || 0) > 1 && (
              <ChangeIconGroup>
                {currentIndex > 0 && (
                  <Tooltip title={`${t('previous')}[↑]`}>
                    <LeftIcontButton
                      onClick={onUpDemand}
                      icon="up-md"
                      text={t('previous')}
                    />
                    {/* <UpWrap
                      onClick={onUpDemand}
                      id="upIcon"
                      isOnly={
                        params?.changeIds?.length === 0 ||
                        currentIndex === (params?.changeIds?.length || 0) - 1
                      }
                    >
                      <CommonIconFont
                        type="up"
                        size={20}
                        color="var(--neutral-n1-d1)"
                      />
                    </UpWrap> */}
                  </Tooltip>
                )}
                {!(
                  params?.changeIds?.length === 0 ||
                  currentIndex === (params?.changeIds?.length || 0) - 1
                ) && (
                  <Tooltip title={`${t('next')}[↓]`}>
                    <LeftIcontButton
                      onClick={onDownDemand}
                      icon="down-md"
                      text={t('next')}
                    />
                    {/* <DownWrap

                      id="downIcon"
                      isOnly={currentIndex <= 0}
                    >
                      <CommonIconFont
                        type="down"
                        size={20}
                        color="var(--neutral-n1-d1)"
                      />
                    </DownWrap> */}
                  </Tooltip>
                )}
              </ChangeIconGroup>
            )}
            <Tooltip title={t('share')}>
              <div>
                <LeftIcontButton
                  onClick={onShare}
                  icon="share"
                  text={t('share')}
                />
                {/* <CommonButton type="icon" icon="share"  /> */}
              </div>
            </Tooltip>
            <Tooltip title={t('more')}>
              <DropdownMenu
                placement="bottomRight"
                trigger={['click']}
                menu={{ items: onGetMenu() }}
                getPopupContainer={n => n}
              >
                <div>
                  <LeftIcontButton icon="more-01" text={t('more')} />
                </div>
              </DropdownMenu>
            </Tooltip>
            <Tooltip title={t('closure')}>
              <div>
                <LeftIcontButton
                  danger
                  onClick={onClose}
                  icon="close"
                  text={t('closure')}
                />
                {/* <CommonButton onClick={onClose} type="icon" icon="close" /> */}
              </div>
            </Tooltip>
          </ButtonGroup>
        )}
      </DetailTop>
      <DetailTitle>
        <Tooltip title={demandInfo?.categoryName}>
          <Popover
            trigger={['hover']}
            visible={isShowChange}
            placement="bottomLeft"
            content={changeStatus}
            getPopupContainer={node => node}
            onVisibleChange={visible => setIsShowChange(visible)}
          >
            <div>
              <Img src={demandInfo.category_attachment} alt="" />
            </div>
          </Popover>
        </Tooltip>
        <DetailText>
          {!hasEdit && (
            <span
              className="name"
              ref={spanDom}
              contentEditable
              onBlur={onNameConfirm}
            >
              {demandInfo.name}
            </span>
          )}
          {hasEdit && <span className="name">{demandInfo.name}</span>}
          <CopyIcon onCopy={onCopy} />
          <ChangeStatusPopover
            projectId={demandInfo.projectId}
            isCanOperation={!hasEdit && !demandInfo.isExamine}
            record={demandInfo}
            onChangeStatus={onChangeStatus}
            type={1}
          >
            <StateTag
              onClick={demandInfo.isExamine ? onExamine : void 0}
              isShow
              name={demandInfo.status?.status.content}
              state={
                demandInfo.status?.is_start === 1 &&
                demandInfo.status?.is_end === 2
                  ? 1
                  : demandInfo.status?.is_end === 1 &&
                    demandInfo.status?.is_start === 2
                  ? 2
                  : demandInfo.status?.is_start === 2 &&
                    demandInfo.status?.is_end === 2
                  ? 3
                  : 0
              }
            />
          </ChangeStatusPopover>
        </DetailText>
      </DetailTitle>
      <Tabs
        className="tabs"
        tabBarExtraContent={
          tabActive === '4' && (
            <ScreenMinHover
              label={t('common.search')}
              icon="filter"
              isActive={filter}
              onClick={() => setFilter(!filter)}
            />
          )
        }
        activeKey={tabActive}
        items={tabItems}
        onChange={onChangeTabs}
      />
    </DemandWrap>
  )
}

export default DemandDetail
