/* eslint-disable no-undefined */
import React, { createRef, useEffect, useRef, useState } from 'react'
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
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import StateTag from '@/components/StateTag'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'
import SprintDetailInfo from './components/SprintDetailInfo'
import SprintDetailBasic from './components/SprintDetailBasic'
import { useDispatch, useSelector } from '@store/index'
import {
  getAffairsCommentList,
  getAffairsInfo,
} from '@store/affairs/affairs.thunk'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { copyLink, getIsPermission, getParamsData } from '@/tools'
import useShareModal from '@/hooks/useShareModal'
import {
  Popover,
  Tooltip,
  Form,
  Input,
  Dropdown,
  MenuProps,
  Checkbox,
} from 'antd'
import CommonModal from '@/components/CommonModal'
import { useTranslation } from 'react-i18next'
import CustomSelect from '@/components/CustomSelect'
import { getWorkflowList } from '@/services/project'
import { getMessage } from '@/components/Message'
import {
  deleteAffairs,
  updateAffairsCategory,
  updateAffairsStatus,
  updateAffairsTableParams,
} from '@/services/affairs'
import { setAffairsInfo } from '@store/affairs'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import LongStroyBread from '@/components/LongStroyBread'
import {
  setAddWorkItemModal,
  setIsUpdateChangeLog,
  setIsUpdateStatus,
} from '@store/project'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setActiveCategory } from '@store/category'
import CopyIcon from '@/components/CopyIcon'
import { useHotkeys } from 'react-hotkeys-hook'
import { keys } from 'highcharts'
interface IProps {}

const SprintProjectDetail: React.FC<IProps> = props => {
  useHotkeys('down,up', event => {
    if (event.key === 'ArrowDown') {
      document.getElementById('downIcon')?.click()
    } else {
      document.getElementById('upIcon')?.click()
    }
  })
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  const spanDom = useRef<HTMLSpanElement>(null)
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const sprintDetailInfoDom: any = createRef()
  const [form] = Form.useForm()
  const [searchParams, setSearchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId, changeIds, newOpen } = paramsData
  const { affairsInfo } = useSelector(store => store.affairs)
  const { projectInfoValues, projectInfo, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const { userInfo } = useSelector(store => store.user)
  const [isShowChange, setIsShowChange] = useState(false)
  const [isShowCategory, setIsShowCategory] = useState(false)
  const [resultCategory, setResultCategory] = useState([])
  const [isDeleteCheck, setIsDeleteCheck] = useState(false)

  // 工作流列表
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  const [focus, setFocus] = useState(false)

  const [leftWidth, setLeftWidth] = useState(400)
  const [currentIndex, setCurrentIndex] = useState(0)

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

  // 复制标题
  const onCopy = () => {
    copyLink(affairsInfo.name, t('copysuccess'), t('copyfailed'))
  }

  // 点击切换类别
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

  // 点击类别获取工作流列表
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

  // 修改事务状态
  const onChangeStatus = async (value: any) => {
    await updateAffairsStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    dispatch(getAffairsInfo({ projectId: id, sprintId: affairsInfo.id || 0 }))
    dispatch(
      getAffairsCommentList({
        projectId: id,
        sprintId: affairsInfo.id || 0,
        page: 1,
        pageSize: 999,
      }),
    )
    dispatch(setIsUpdateChangeLog(true))
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
      projectId: id,
      id: affairsInfo.id || 0,
      ...form.getFieldsValue(),
    })
    getMessage({ msg: t('newlyAdd.changeSuccess'), type: 'success' })
    setIsShowCategory(false)
    dispatch(setIsUpdateStatus(true))
    // dispatch(setIsRefresh(true))
    dispatch(getAffairsInfo({ projectId: id, sprintId: affairsInfo.id || 0 }))
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

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
        projectId: id,
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

  // 返回
  const onBack = () => {
    if (newOpen) {
      const params = encryptPhp(JSON.stringify({ id: affairsInfo.projectId }))
      navigate(`/SprintProjectManagement/Affair?data=${params}`)
    } else {
      history.go(-1)
    }
  }

  // 确认删除
  const onDeleteConfirm = async () => {
    await deleteAffairs({
      projectId: affairsInfo.projectId || 0,
      id: affairsInfo.id || 0,
      isDeleteChild: isDeleteCheck ? 1 : 2,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    const params = encryptPhp(JSON.stringify({ id: affairsInfo.projectId }))
    navigate(`/SprintProjectManagement/Affair?data=${params}`)
  }

  // 分享弹窗
  const onShare = () => {
    open({
      onOk: () => {
        return Promise.resolve()
      },
    })
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
    const params = encryptPhp(
      JSON.stringify({
        type: 'sprint',
        id: id,
        categoryItem: {
          id: affairsInfo.category,
          status: affairsInfo.category_status,
        },
      }),
    )
    navigate(`/SprintProjectManagement/DemandSetting?data=${params}`)
  }

  const onChangeTabsScroll = (value: string) => {
    sprintDetailInfoDom.current.changeTabs(value)
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
      {
        label: (
          <div onClick={() => onChangeTabsScroll('sprint-attachment')}>
            {t('addAttachments')}
          </div>
        ),
        key: '1',
      },
      {
        label: (
          <div onClick={() => onChangeTabsScroll('sprint-childSprint')}>
            {t('addChildAffairs')}
          </div>
        ),
        key: '2',
      },
      {
        label: (
          <div onClick={() => onChangeTabsScroll('sprint-tag')}>
            {t('addTag')}
          </div>
        ),
        key: '3',
      },
      {
        label: (
          <div onClick={() => onChangeTabsScroll('sprint-linkSprint')}>
            {t('linkAffairs')}
          </div>
        ),
        key: '4',
      },
      {
        type: 'divider',
      },
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

  useEffect(() => {
    if (sprintId && id) {
      dispatch(getAffairsInfo({ projectId: id, sprintId }))
      dispatch(
        getAffairsCommentList({
          projectId: id,
          sprintId,
          page: 1,
          pageSize: 999,
        }),
      )
    }
  }, [sprintId, id])

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = changeIds[currentIndex - 1]
    if (!currentIndex) return
    const params = encryptPhp(
      JSON.stringify({
        ...paramsData,
        ...{ id, changeIds, sprintId: newIndex },
      }),
    )
    setSearchParams(`data=${params}`)
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = changeIds[currentIndex + 1]
    if (currentIndex === changeIds?.length - 1) return
    const params = encryptPhp(
      JSON.stringify({
        ...paramsData,
        ...{ id, changeIds, sprintId: newIndex },
      }),
    )
    setSearchParams(`data=${params}`)
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
      (changeIds || []).findIndex((i: any) => i === affairsInfo?.id),
    )
  }, [affairsInfo, projectInfoValues])

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      dispatch(getAffairsInfo({ projectId: id, sprintId: affairsInfo.id }))
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
                  projectId: id,
                  sprintId: affairsInfo.id || 0,
                }),
              )
            }}
          ></LongStroyBread>
        </div>

        {affairsInfo.id && (
          <ButtonGroup size={16}>
            {changeIds && changeIds.length > 0 && (
              <CommonButton type="icon" icon="left-md" onClick={onBack} />
            )}
            {changeIds?.length > 1 && (
              <ChangeIconGroup>
                {currentIndex > 0 && (
                  <UpWrap
                    onClick={onUpDemand}
                    id="upIcon"
                    isOnly={
                      changeIds?.length === 0 ||
                      currentIndex === changeIds?.length - 1
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
                  changeIds?.length === 0 ||
                  currentIndex === changeIds?.length - 1
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
          </ButtonGroup>
        )}
      </DetailTop>
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
        <DetailText>
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
          <ChangeStatusPopover
            projectId={affairsInfo.projectId}
            record={affairsInfo}
            onChangeStatus={onChangeStatus}
            type={2}
            isCanOperation={!hasEdit}
          >
            <StateTag
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
        </DetailText>
      </DetailTitle>
      <DetailMain>
        <div
          style={{ position: 'relative', width: `calc(100% - ${leftWidth}px)` }}
        >
          <SprintDetailInfo onRef={sprintDetailInfoDom} />
        </div>
        <div
          ref={basicInfoDom}
          style={{ position: 'relative', width: leftWidth }}
        >
          <SprintDetailMouseDom
            active={focus}
            onMouseDown={onDragLine}
            style={{ left: 0 }}
          >
            <SprintDetailDragLine active={focus} className="line" />
          </SprintDetailMouseDom>
          <SprintDetailBasic onRef={basicInfoDom} />
        </div>
      </DetailMain>
    </Wrap>
  )
}
export default SprintProjectDetail
