/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import {
  ButtonGroup,
  ChangeIconGroup,
  DetailMain,
  DetailText,
  DetailTitle,
  DetailTop,
  DownWrap,
  DropdownMenu,
  FormWrap,
  Img,
  LiWrap,
  SprintDetailDragLine,
  SprintDetailMouseDom,
  UpWrap,
  Wrap,
} from './style'
import useShareModal from '@/hooks/useShareModal'
import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { Checkbox, Form, MenuProps, Popover, Tooltip } from 'antd'
import { createRef, useState, useRef, useEffect } from 'react'
import CustomSelect from '@/components/CustomSelect'
import {
  deleteAffairs,
  updateAffairsCategory,
  updateAffairsStatus,
  updateAffairsTableParams,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import {
  getAffairsCommentList,
  getAffairsInfo,
} from '@store/affairs/affairs.thunk'
import {
  setAddWorkItemModal,
  setIsUpdateAddWorkItem,
  setIsUpdateChangeLog,
  setIsUpdateStatus,
} from '@store/project'
import { getWorkflowList } from '@/services/project'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import LongStroyBread from '@/components/LongStroyBread'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { copyLink, getIsPermission } from '@/tools'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'
import StatusExamine from '@/components/StatusExamine'
import { cancelVerify } from '@/services/mine'
import CopyIcon from '@/components/CopyIcon'
import ChangeStatusPopover from '@/components/ChangeStatusPopover'
import StateTag from '@/components/StateTag'
import { setAffairsActivity, setAffairsInfo } from '@store/affairs'
import AffairsBasic from './components/AffairsBasic'
import AffairsInfo from './components/AffairsInfo'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'

const AffairsDetail = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const spanDom = useRef<HTMLSpanElement>(null)
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const sprintDetailInfoDom: any = createRef()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const { open, ShareModal } = useShareModal()
  const { affairsInfo } = useSelector(store => store.affairs)
  const { userInfo } = useSelector(store => store.user)
  const {
    isDetailScreenModal,
    projectInfo,
    projectInfoValues,
    isUpdateAddWorkItem,
  } = useSelector(store => store.project)
  const { visible, params } = isDetailScreenModal
  const [form] = Form.useForm()
  // 拖拽聚焦
  const [focus, setFocus] = useState(false)
  // 是否可改变类别弹窗
  const [isShowChange, setIsShowChange] = useState(false)
  // 左侧宽度
  const [leftWidth, setLeftWidth] = useState(400)
  // 当前需求的下标
  const [currentIndex, setCurrentIndex] = useState(0)
  // 是否勾选删除子级
  const [isDeleteCheck, setIsDeleteCheck] = useState(false)
  // 是否展示切换类别的弹窗
  const [isShowCategory, setIsShowCategory] = useState(false)
  // 可选择的类别数组
  const [resultCategory, setResultCategory] = useState([])
  // 当前选择类别的工作流列表
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })

  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/delete',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/update',
  )

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
    await updateAffairsCategory({
      projectId: params.id,
      id: affairsInfo.id || 0,
      ...form.getFieldsValue(),
    })
    getMessage({ msg: t('newlyAdd.changeSuccess'), type: 'success' })
    setIsShowCategory(false)
    dispatch(setIsUpdateStatus(true))
    dispatch(
      getAffairsInfo({ projectId: params.id, sprintId: affairsInfo.id || 0 }),
    )
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
    const resultParams = { ...params, ...{ sprintId: newIndex } }
    dispatch(saveScreenDetailModal({ visible, params: resultParams }))
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = params?.changeIds ? params?.changeIds[currentIndex + 1] : 0
    if (currentIndex === (params?.changeIds?.length || 0) - 1) return
    const resultParams = { ...params, ...{ sprintId: newIndex } }
    dispatch(saveScreenDetailModal({ visible, params: resultParams }))
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
    copyLink(affairsInfo.name, t('copysuccess'), t('copyfailed'))
  }

  // 编辑事务
  const onEdit = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: affairsInfo.id,
          projectId: affairsInfo.projectId,
          type: affairsInfo.work_type,
          title: t('editorialAffairs'),
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
        type: 'sprint',
        id: params.id,
        categoryItem: {
          id: affairsInfo.category,
          status: affairsInfo.category_status,
        },
      }),
    )
    navigate(`/SprintProjectManagement/DemandSetting?data=${resultParams}`)
  }

  // 标签滚动
  const onChangeTabsScroll = (value: string) => {
    sprintDetailInfoDom.current.changeTabs(value)
  }

  // 确认删除
  const onDeleteConfirm = async () => {
    await deleteAffairs({
      projectId: affairsInfo.projectId || 0,
      id: affairsInfo.id || 0,
      isDeleteChild: isDeleteCheck ? 1 : 2,
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
      text: (
        <>
          <div style={{ marginBottom: 9 }}>
            {t('youWillPermanentlyDeleteWhichCannotBeRecoveredAfterPleaseBe', {
              key: `${affairsInfo.projectPrefix}-${affairsInfo.prefixKey}`,
            })}
          </div>
          <Checkbox onChange={e => setIsDeleteCheck(e.target.checked)}>
            {t('deleteAllSubtransactionsUnderThisTransactionAtTheSameTime')}
          </Checkbox>
        </>
      ),
      onConfirm() {
        onDeleteConfirm()
        return Promise.resolve()
      },
    })
  }

  // 菜单
  const onGetMenu = () => {
    // 更多下拉
    let items: MenuProps['items'] = [
      {
        label: <div onClick={onEdit}>{t('common.edit')}</div>,
        key: '6',
      },
      {
        label: <div onClick={onDelete}>{t('common.del')}</div>,
        key: '0',
      },

      {
        type: 'divider',
        key: '10',
      },
      // {
      //   label: (
      //     <div onClick={() => onChangeTabsScroll('sprint-attachment')}>
      //       {t('addAttachments')}
      //     </div>
      //   ),
      //   key: '1',
      // },
      // {
      //   label: (
      //     <div onClick={() => onChangeTabsScroll('sprint-childSprint')}>
      //       {t('addChildAffairs')}
      //     </div>
      //   ),
      //   key: '2',
      // },
      // {
      //   label: (
      //     <div onClick={() => onChangeTabsScroll('sprint-tag')}>
      //       {t('addTag')}
      //     </div>
      //   ),
      //   key: '3',
      // },
      // {
      //   label: (
      //     <div onClick={() => onChangeTabsScroll('sprint-linkSprint')}>
      //       {t('linkAffairs')}
      //     </div>
      //   ),
      //   key: '4',
      // },
      // {
      //   type: 'divider',
      // },
      {
        label: <div onClick={onToConfig}>{t('configuration')}</div>,
        key: '5',
      },
    ]
    if (hasEdit) {
      items = items.filter((i: any) => i.key !== '6')
    }
    if (hasDel) {
      items = items.filter((i: any) => i.key !== '0')
    }
    if (isEnd) {
      items = items.filter((i: any) => !['6', '0', '10'].includes(i.key))
    }
    // 子任务不存在子事务模块
    return affairsInfo.work_type === 6
      ? items.filter((i: any) => i.key !== '2')
      : items
  }

  // 取消审核
  const onCancelExamine = async () => {
    await cancelVerify(affairsInfo.verify_data?.id)
    getMessage({ type: 'success', msg: t('other.cancelExamineSuccess') })
    dispatch(getAffairsInfo({ projectId: params.id, sprintId: affairsInfo.id }))
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

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
        ?.filter((i: any) => i.work_type === affairsInfo.work_type)
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
    if (value !== affairsInfo.name) {
      await updateAffairsTableParams({
        projectId: params.id,
        id: affairsInfo.id || 0,
        otherParams: {
          name: value,
        },
      })
      getMessage({ type: 'success', msg: t('successfullyModified') })
      // 提交名称
      setAffairsInfo({
        ...affairsInfo,
        name: value,
      })
    }
  }

  // 修改事务状态
  const onChangeStatus = async (value: any) => {
    await updateAffairsStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    dispatch(
      getAffairsInfo({ projectId: params.id, sprintId: affairsInfo.id || 0 }),
    )
    dispatch(
      getAffairsCommentList({
        projectId: params.id,
        sprintId: affairsInfo.id || 0,
        page: 1,
        pageSize: 999,
      }),
    )
    dispatch(setIsUpdateChangeLog(true))
  }

  // 拖动线条
  const onDragLine = () => {
    document.onmousemove = e => {
      setFocus(true)

      setLeftWidth(window.innerWidth - e.clientX)
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  // 是否审核
  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  // 点击查看流转记录
  const onCheckRecord = () => {
    sprintDetailInfoDom.current.changeTabs('sprint-activity')
    setTimeout(() => {
      dispatch(setAffairsActivity('3'))
    }, 100)
  }

  useEffect(() => {
    if (visible) {
      dispatch(
        getAffairsInfo({
          projectId: params.id,
          sprintId: params?.sprintId || 0,
        }),
      )
      dispatch(
        getAffairsCommentList({
          projectId: params.id,
          sprintId: params?.sprintId || 0,
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
        ?.filter((i: any) => i.id !== affairsInfo?.category)
        ?.filter((i: any) => i.status === 1),
    )
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex(
      (params?.changeIds || []).findIndex((i: any) => i === affairsInfo?.id),
    )
  }, [affairsInfo, projectInfoValues])

  useEffect(() => {
    if (isUpdateAddWorkItem && visible) {
      dispatch(
        getAffairsInfo({ projectId: params.id, sprintId: affairsInfo.id }),
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
    <Wrap>
      <DeleteConfirmModal />
      <ShareModal
        url={location.href}
        title={
          affairsInfo?.name
            ? `【${affairsInfo?.projectPrefix}${
                affairsInfo?.prefixKey ? '-' : ''
              }${affairsInfo?.prefixKey}-${affairsInfo?.name}-${
                userInfo?.name
              }】`
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
              src={affairsInfo?.category_attachment}
              style={{
                width: '18px',
                height: '18px',
                marginRight: '8px',
              }}
              alt=""
            />
            <span>{affairsInfo?.categoryName}</span>
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MyBreadcrumb />
          <LongStroyBread
            longStroy={affairsInfo}
            onClick={() => {
              dispatch(
                getAffairsInfo({
                  projectId: params.id,
                  sprintId: affairsInfo.id || 0,
                }),
              )
            }}
          ></LongStroyBread>
        </div>
        {affairsInfo.id && (
          <ButtonGroup size={16}>
            {(params?.changeIds?.length || 0) > 1 && (
              <ChangeIconGroup>
                {currentIndex > 0 && (
                  <UpWrap
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
                  </UpWrap>
                )}
                {!(
                  params?.changeIds?.length === 0 ||
                  currentIndex === (params?.changeIds?.length || 0) - 1
                ) && (
                  <DownWrap
                    onClick={onDownDemand}
                    id="downIcon"
                    isOnly={currentIndex <= 0}
                  >
                    <CommonIconFont
                      type="down"
                      size={20}
                      color="var(--neutral-n1-d1)"
                    />
                  </DownWrap>
                )}
              </ChangeIconGroup>
            )}
            <CommonButton type="icon" icon="share" onClick={onShare} />
            <DropdownMenu
              placement="bottomRight"
              trigger={['click']}
              menu={{
                items: onGetMenu(),
              }}
              getPopupContainer={n => n}
            >
              <div>
                <CommonButton type="icon" icon="more" />
              </div>
            </DropdownMenu>
            <CommonButton onClick={onClose} type="icon" icon="close" />
          </ButtonGroup>
        )}
      </DetailTop>
      {affairsInfo?.isExamine && (
        <div style={{ padding: '0 24px' }}>
          <StatusExamine
            type={2}
            onCancel={onCancelExamine}
            isVerify={affairsInfo?.has_verify === 1}
            onCheck={onCheckRecord}
          />
        </div>
      )}

      <DetailMain>
        <div
          style={{ position: 'relative', width: `calc(100% - ${leftWidth}px)` }}
        >
          <DetailTitle>
            <Tooltip title={affairsInfo?.categoryName}>
              <Popover
                trigger={['hover']}
                visible={isShowChange}
                placement="bottomLeft"
                content={changeStatus}
                getPopupContainer={node => node}
                onVisibleChange={visible => setIsShowChange(visible)}
              >
                <div>
                  <Img src={affairsInfo.category_attachment} alt="" />
                </div>
              </Popover>
            </Tooltip>
            <DetailText id="DetailText">
              {!hasEdit && (
                <span
                  className="name"
                  ref={spanDom}
                  contentEditable
                  onBlur={onNameConfirm}
                >
                  {affairsInfo.name}
                </span>
              )}
              {hasEdit && <span className="name">{affairsInfo.name}</span>}
              <CopyIcon onCopy={onCopy} />
            </DetailText>
          </DetailTitle>
          <AffairsInfo onRef={sprintDetailInfoDom} />
        </div>
        <div
          ref={basicInfoDom}
          style={{ position: 'relative', width: leftWidth }}
        >
          <div style={{ margin: '0 0 30px 24px' }}>
            <ChangeStatusPopover
              projectId={affairsInfo.projectId}
              record={affairsInfo}
              onChangeStatus={onChangeStatus}
              type={2}
              isCanOperation={!hasEdit && !affairsInfo.isExamine}
            >
              <StateTag
                onClick={affairsInfo.isExamine ? onExamine : void 0}
                isShow={!hasEdit}
                name={affairsInfo.status?.status.content}
                state={
                  affairsInfo.status?.is_start === 1 &&
                  affairsInfo.status?.is_end === 2
                    ? 1
                    : affairsInfo.status?.is_end === 1 &&
                      affairsInfo.status?.is_start === 2
                    ? 2
                    : affairsInfo.status?.is_start === 2 &&
                      affairsInfo.status?.is_end === 2
                    ? 3
                    : 0
                }
              />
            </ChangeStatusPopover>
          </div>
          <SprintDetailMouseDom
            active={focus}
            onMouseDown={onDragLine}
            style={{ left: 0 }}
          >
            <SprintDetailDragLine active={focus} className="line" />
          </SprintDetailMouseDom>
          <AffairsBasic onRef={basicInfoDom} />
        </div>
      </DetailMain>
    </Wrap>
  )
}

export default AffairsDetail
