/* eslint-disable no-constant-binary-expression */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
import { useDispatch, useSelector } from '@store/index'
import { Form, MenuProps, Popover, Tabs, TabsProps, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  ActivityTabItem,
  ButtonGroup,
  ChangeIconGroup,
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
  Wrap,
} from './style'
import useShareModal from '@/hooks/useShareModal'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import CustomSelect from '@/components/CustomSelect'
import CommonModal from '@/components/CommonModal'
import { useEffect, useRef, useState } from 'react'
import { copyLink, getIsPermission } from '@/tools'
import {
  deleteFlaw,
  updateFlawCategory,
  updateFlawStatus,
  updateFlawTableParams,
} from '@/services/flaw'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import {
  setAddWorkItemModal,
  setIsUpdateAddWorkItem,
  setIsUpdateStatus,
} from '@store/project'
import { getMessage } from '@/components/Message'
import { getWorkflowList } from '@/services/project'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setFlawInfo } from '@store/flaw'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CommonIconFont from '@/components/CommonIconFont'
import CopyIcon from '@/components/CopyIcon'
import ChangeStatusPopover from '@/components/ChangeStatusPopover'
import StateTag from '@/components/StateTag'
import RelationStories from './components/RelationStories'
import ChangeRecord from './components/ChangeRecord'
import Circulation from './components/Circulation'
import FlawInfo from './components/FlawInfo'
import ScreenMinHover from '@/components/ScreenMinHover'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { DrawerHeader } from '@/components/DemandDetailDrawer/style'
import { myTreeCss } from '../DemandDetail'
import LeftIcontButton from '@/components/LeftIcontButton'

const FlawDetail = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const spanDom = useRef<HTMLSpanElement>(null)
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const { userInfo } = useSelector(store => store.user)
  const { flawInfo } = useSelector(store => store.flaw)
  const {
    isDetailScreenModal,
    projectInfo,
    projectInfoValues,
    isUpdateAddWorkItem,
  } = useSelector(store => store.project)
  const { visible, params } = isDetailScreenModal
  const [form] = Form.useForm()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const [tabActive, setTabActive] = useState('1')
  const [filter, setFilter] = useState(false)
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

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/update',
  )

  //   刷新缺陷详情
  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: params.id, id: flawInfo.id }))
  }

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
    await updateFlawCategory({
      projectId: params.id,
      id: flawInfo.id,
      ...form.getFieldsValue(),
    })
    getMessage({ msg: t('newlyAdd.changeSuccess'), type: 'success' })
    setIsShowCategory(false)
    dispatch(setIsUpdateStatus(true))
    dispatch(getFlawInfo({ projectId: params.id, id: flawInfo.id }))
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
    if (!currentIndex) return
    const resultParams = { ...params, ...{ flawId: newIndex } }
    dispatch(saveScreenDetailModal({ visible, params: resultParams }))
    setTabActive('1')
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = params?.changeIds ? params?.changeIds[currentIndex + 1] : 0
    if (currentIndex === (params?.changeIds?.length || 0) - 1) return
    const resultParams = { ...params, ...{ flawId: newIndex } }
    dispatch(saveScreenDetailModal({ visible, params: resultParams }))
    setTabActive('1')
  }

  const getKeyDown = (e: any) => {
    if (e.keyCode === 38) {
      //up
      document.getElementById('upIcon')?.click()
    }
    if (e.keyCode === 40) {
      //down
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
    copyLink(flawInfo.name, t('copysuccess'), t('copyfailed'))
  }

  //   编辑缺陷
  const onEdit = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: flawInfo.id,
          projectId: flawInfo.projectId,
          type: 2,
          title: t('editorialDefect'),
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
        id: params.id,
        categoryItem: {
          id: flawInfo.category,
          status: flawInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectDetail/Setting/TypeConfiguration?data=${resultParams}`)
    //
  }

  // 确认删除
  const onDeleteConfirm = async () => {
    await deleteFlaw({
      projectId: flawInfo.projectId || 0,
      id: flawInfo.id || 0,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    onClose()
    setTimeout(() => {
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }, 0)
  }

  // 删除缺陷弹窗
  const onDelete = () => {
    openDelete({
      title: t('deleteConfirmation'),
      text: t('areYouSureToDeleteThisFlaw'),
      onConfirm() {
        onDeleteConfirm()
        return Promise.resolve()
      },
    })
  }

  // 复制需求id
  const onCopyId = () => {
    copyLink(
      `${flawInfo.projectPrefix}-${flawInfo.prefixKey}`,
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
        id: flawInfo.projectId,
        detailId: flawInfo.id,
        specialType: 2,
        isOpenScreenDetail: true,
      }),
    )
    const url = `/ProjectDetail/Defect?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${flawInfo.projectPrefix}-${flawInfo.prefixKey}】${text}`,
      t('copysuccess'),
      t('copyfailed'),
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

  //   类别下拉
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
        ?.filter((i: any) => i.work_type === 2)
        ?.map((k: any) => {
          return (
            <LiWrap key={k.id} onClick={() => onClickCategory(k)}>
              <img
                src={k.category_attachment}
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
    if (value !== flawInfo.name) {
      await updateFlawTableParams({
        projectId: flawInfo.projectId,
        id: flawInfo.id,
        otherParams: {
          name: value,
        },
      })
      getMessage({ type: 'success', msg: t('successfullyModified') })
      // 提交名称
      setFlawInfo({
        ...flawInfo,
        name: value,
      })
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }
  }

  // 修改缺陷状态
  const onChangeStatus = async (value: any) => {
    await updateFlawStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    dispatch(
      getFlawCommentList({
        projectId: flawInfo.projectId || 0,
        id: flawInfo.id || 0,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 是否审核
  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <ActivityTabItem>
          <span>{t('details')}</span>
        </ActivityTabItem>
      ),
      children: <FlawInfo />,
    },
    {
      key: '2',
      label: (
        <ActivityTabItem>
          <span>{t('linkWorkItems')}</span>
        </ActivityTabItem>
      ),
      children: (
        <RelationStories
          activeKey={tabActive}
          detail={flawInfo as Model.Flaw.FlawInfo}
          onUpdate={onUpdate}
          isPreview={(params?.employeeCurrentId || 0) > 0}
        />
      ),
    },
    {
      key: '3',
      label: (
        <ActivityTabItem>
          <span>{t('changeLog')}</span>
          <ItemNumber isActive={tabActive === '3'}>
            {flawInfo.changeCount}
          </ItemNumber>
        </ActivityTabItem>
      ),
      children: (
        <ChangeRecord
          activeKey={tabActive}
          filter={filter}
          isPreview={(params?.employeeCurrentId || 0) > 0}
        />
      ),
    },
    {
      key: '4',
      label: (
        <ActivityTabItem>
          <span>{t('circulationRecords')}</span>
        </ActivityTabItem>
      ),
      children: (
        <Circulation
          activeKey={tabActive}
          isPreview={(params?.employeeCurrentId || 0) > 0}
        />
      ),
    },
  ]

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    if (value === '1') {
      dispatch(getFlawInfo({ projectId: params.id, id: flawInfo.id }))
    }
  }

  useEffect(() => {
    if (userPreferenceConfig.previewModel === 2) {
      const value = encryptPhp(JSON.stringify({ id: params.id }))
      localStorage.setItem(
        'projectRouteDetail',
        `${location.pathname}?data=${value}`,
      )
    }
    if (visible && params.flawId) {
      dispatch(setFlawInfo({}))
      dispatch(getFlawInfo({ projectId: params.id, id: params.flawId }))
      dispatch(
        getFlawCommentList({
          projectId: params.id,
          id: params.flawId ?? 0,
          page: 1,
          pageSize: 999,
        }),
      )
    } else {
      localStorage.removeItem('projectRouteDetail')
    }
    return () => {
      localStorage.removeItem('projectRouteDetail')
    }
  }, [visible, params, userPreferenceConfig.previewModel])

  useEffect(() => {
    // 获取项目信息中的需求类别
    const list = projectInfoValues?.filter((i: any) => i.key === 'category')[0]
      ?.children
    setResultCategory(
      list
        ?.filter((i: any) => i.id !== flawInfo?.category)
        ?.filter((i: any) => i.status === 1),
    )
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex(
      (params?.changeIds || []).findIndex((i: any) => i === flawInfo?.id),
    )
  }, [flawInfo, projectInfoValues])

  useEffect(() => {
    if (isUpdateAddWorkItem && visible) {
      dispatch(getFlawInfo({ projectId: params.id, id: params.flawId }))
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    document.addEventListener('keydown', getKeyDown)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
    }
  }, [])

  return (
    <Wrap
      all={userPreferenceConfig.previewModel === 3}
      employeeCurrentId={params?.employeeCurrentId}
      style={{ paddingTop: (params?.employeeCurrentId || 0) > 0 ? 0 : 20 }}
    >
      {!params?.employeeCurrentId && (
        <>
          <DeleteConfirmModal />
          <ShareModal
            url={`${location.origin}/ProjectDetail/Defect?data=${encryptPhp(
              JSON.stringify({
                detailId: flawInfo?.id,
                id: projectInfo.id,
                specialType: 2,
                isOpenScreenDetail: true,
              }),
            )}`}
            title={
              flawInfo?.name
                ? `【${flawInfo?.projectPrefix}-${flawInfo?.name}-${userInfo?.name}】`
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
                  src={flawInfo?.category_attachment}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginRight: '8px',
                  }}
                  alt=""
                />
                <span>{flawInfo?.categoryName}</span>
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
          <DetailTop
            style={{ borderBottom: '1px solid #EBECED', paddingBottom: '16px' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <MyBreadcrumb />
              <div style={{ display: 'inline-flex', marginLeft: '10px' }}>
                {flawInfo.level_tree?.map((i: any, index: number) => (
                  <DrawerHeader
                    style={{
                      cursor:
                        index === (flawInfo?.level_tree?.length || 0) - 1
                          ? 'auto'
                          : 'pointer',
                    }}
                    key={i.prefix_key}
                    onClick={() => {
                      const projectId = flawInfo?.projectId
                      if (index !== (flawInfo?.level_tree?.length || 0) - 1) {
                        openDemandDetail({ ...i }, projectId, i.id, 2)
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      <CommonIconFont
                        type="right"
                        color="var(--neutral-n1-d1)"
                      ></CommonIconFont>
                    </span>
                    <img
                      style={{ fontSize: '12px' }}
                      src={i.category_attachment}
                      alt=""
                    />
                    <div
                      className={
                        index === (flawInfo?.level_tree?.length || 0) - 1
                          ? ''
                          : myTreeCss
                      }
                      style={{
                        fontSize: '12px',
                        color:
                          index === (flawInfo?.level_tree?.length || 0) - 1
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

            {flawInfo.id && (
              <ButtonGroup size={16}>
                {(params?.changeIds?.length || 0) > 1 && (
                  <ChangeIconGroup>
                    {currentIndex > 0 && (
                      <LeftIcontButton
                        onClick={onUpDemand}
                        icon="up-md"
                        text={t('previous')}
                      />
                    )}
                    {!(
                      params?.changeIds?.length === 0 ||
                      currentIndex === (params?.changeIds?.length || 0) - 1
                    ) && (
                      <LeftIcontButton
                        onClick={onDownDemand}
                        icon="down-md"
                        text={t('next')}
                      />
                    )}
                  </ChangeIconGroup>
                )}

                <div>
                  <LeftIcontButton
                    onClick={onShare}
                    icon="share"
                    text={t('share')}
                  />
                </div>

                <DropdownMenu
                  placement="bottomRight"
                  trigger={['click']}
                  menu={{ items: items }}
                  getPopupContainer={n => n}
                >
                  <div>
                    <LeftIcontButton icon="more-01" text={t('more')} />
                  </div>
                </DropdownMenu>

                <div>
                  <LeftIcontButton
                    danger
                    onClick={onClose}
                    icon="close"
                    text={t('closure')}
                  />
                </div>
              </ButtonGroup>
            )}
          </DetailTop>
        </>
      )}

      <DetailTitle>
        <Tooltip title={flawInfo?.categoryName}>
          {!params?.employeeCurrentId && (
            <Popover
              trigger={['hover']}
              visible={isShowChange}
              placement="bottomLeft"
              content={changeStatus}
              getPopupContainer={node => node}
              onVisibleChange={visible => setIsShowChange(visible)}
            >
              <div>
                <Img src={flawInfo.category_attachment} alt="" />
              </div>
            </Popover>
          )}
          {params?.employeeCurrentId && (
            <div>
              <Img src={flawInfo.category_attachment} alt="" />
            </div>
          )}
        </Tooltip>
        <DetailText>
          {!hasEdit && !params?.employeeCurrentId && (
            <span
              className="name"
              ref={spanDom}
              contentEditable
              onBlur={onNameConfirm}
            >
              {flawInfo.name}
            </span>
          )}
          {(hasEdit || params?.employeeCurrentId) && (
            <span className="name">{flawInfo.name}</span>
          )}
          <CopyIcon onCopy={onCopy} />
          <ChangeStatusPopover
            projectId={flawInfo.projectId}
            isCanOperation={!hasEdit && !params?.employeeCurrentId}
            record={flawInfo}
            onChangeStatus={onChangeStatus}
            type={3}
          >
            <StateTag
              isShow
              name={flawInfo.status?.status.content}
              state={
                flawInfo.status?.is_start === 1 && flawInfo.status?.is_end === 2
                  ? 1
                  : flawInfo.status?.is_end === 1 &&
                    flawInfo.status?.is_start === 2
                  ? 2
                  : flawInfo.status?.is_start === 2 &&
                    flawInfo.status?.is_end === 2
                  ? 3
                  : 0
              }
            />
          </ChangeStatusPopover>
        </DetailText>
      </DetailTitle>
      <Tabs
        className="tabs"
        activeKey={tabActive}
        items={tabItems}
        onChange={onChangeTabs}
        tabBarExtraContent={
          tabActive === '3' && !params?.employeeCurrentId ? (
            <ScreenMinHover
              style={{ marginRight: '24px' }}
              label={t('common.search')}
              icon="filter"
              isActive={filter}
              onClick={() => setFilter(!filter)}
            />
          ) : null
        }
      />
    </Wrap>
  )
}

export default FlawDetail
