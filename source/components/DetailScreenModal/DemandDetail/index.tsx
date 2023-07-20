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
  SelectWrap,
  SelectWrapBedeck,
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
  setIsDetailScreenModal,
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
import RangePicker from '@/components/RangePicker'
import moment from 'moment'
import ChildDemand from './components/ChildDemand'
import StoryRelation from './components/StoryRelation'
import ChangeRecord from './components/ChangeRecord'
import Circulation from './components/Circulation'
import DemandInfo from './components/DemandInfo'

const DemandDetail = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const spanDom = useRef<HTMLSpanElement>(null)
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
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
  // 是否打开变更记录的筛选
  const [isOpen, setIsOpen] = useState(false)
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

  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )

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
    if (!currentIndex) return
    const resultParams = { ...params, ...{ sprintId: newIndex } }
    dispatch(setIsDetailScreenModal({ visible, params: resultParams }))
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = params?.changeIds ? params?.changeIds[currentIndex + 1] : 0
    if (currentIndex === (params?.changeIds?.length || 0) - 1) return
    const resultParams = { ...params, ...{ sprintId: newIndex } }
    dispatch(setIsDetailScreenModal({ visible, params: resultParams }))
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
    dispatch(setIsDetailScreenModal({ visible: false, params: {} }))
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
    dispatch(setIsDetailScreenModal({ visible: false, params: {} }))
    setTimeout(() => {
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }, 0)
  }

  // 删除事务弹窗
  const onDelete = () => {
    openDelete({
      title: t('deleteConfirmation'),
      text: t('areYouSureToDeleteThisTransaction'),
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
        demandId: demandInfo.id,
      }),
    )
    const url = `/ProjectManagement/DemandDetail?data=${params}`
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
    dispatch(getDemandInfo({ projectId: params.id, id: demandInfo.id }))
    dispatch(
      getDemandCommentList({
        projectId: params.id,
        demandId: demandInfo.id,
        page: 1,
        pageSize: 999,
      }),
    )
    dispatch(setIsUpdateChangeLog(true))
  }

  // 关闭弹窗
  const onClose = () => {
    dispatch(setIsDetailScreenModal({ visible: false, params: {} }))
  }

  // 是否审核
  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  const SearchWrap = () => {
    const onChangeTime = (d: any) => {
      if (d) {
        form.setFieldsValue({
          ['date']: [
            moment(d[0]).unix()
              ? moment(d[0]).format('YYYY-MM-DD')
              : '1970-01-01',
            moment(d[1]).unix() === 1893427200
              ? '2030-01-01'
              : moment(d[1]).format('YYYY-MM-DD'),
          ],
        })
      } else {
        form.setFieldsValue({
          ['date']: null,
        })
      }
      const a = form.getFieldsValue()
      console.log(a, '9')
    }
    const confirm = (e: any) => {
      const a = form.getFieldsValue()
    }
    return (
      <Form form={form}>
        <Space
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 0px 20px 0px',
            borderBottom: '1px solid var(--neutral-n6-d1)',
          }}
          size={16}
        >
          <SelectWrapBedeck style={{ marginRight: '4px' }}>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>变更人</span>
            <Form.Item name="person" noStyle>
              <SelectWrap
                mode="multiple"
                onChange={confirm}
                style={{ width: '100%' }}
                placeholder={'请选择'}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                options={[
                  {
                    label: t('other.affairs_public'),
                    value: 1,
                  },
                  {
                    label: t('other.affairs_team'),
                    value: 2,
                  },
                  {
                    label: t('other.iteration_public'),
                    value: 3,
                  },
                  {
                    label: t('other.iteration_team'),
                    value: 4,
                  },
                ]}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck style={{ marginRight: '4px' }}>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>变更类型</span>
            <Form.Item name="type" noStyle>
              <SelectWrap
                mode="multiple"
                onChange={confirm}
                style={{ width: '100%' }}
                placeholder={'请选择'}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                options={[
                  {
                    label: t('other.affairs_public'),
                    value: 1,
                  },
                  {
                    label: t('other.affairs_team'),
                    value: 2,
                  },
                  {
                    label: t('other.iteration_public'),
                    value: 3,
                  },
                  {
                    label: t('other.iteration_team'),
                    value: 4,
                  },
                ]}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck style={{ marginRight: '4px' }}>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>变更前后</span>
            <Form.Item name="before" noStyle>
              <SelectWrap
                mode="multiple"
                onChange={confirm}
                style={{ width: '100%' }}
                placeholder={'请选择'}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                options={[
                  {
                    label: t('other.affairs_public'),
                    value: 1,
                  },
                  {
                    label: t('other.affairs_team'),
                    value: 2,
                  },
                  {
                    label: t('other.iteration_public'),
                    value: 3,
                  },
                  {
                    label: t('other.iteration_team'),
                    value: 4,
                  },
                ]}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>变更时间</span>
            <Form.Item name="date" noStyle>
              <RangePicker
                isShowQuick
                onChange={dates => onChangeTime(dates)}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <span
            style={{
              margin: '0 8px',
              color: 'var(--primary-d2)',
              cursor: 'pointer',
            }}
            onClick={() => form.resetFields()}
          >
            清除条件
          </span>
        </Space>
      </Form>
    )
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
      children: (
        <div>
          {isOpen && <SearchWrap />}
          <ChangeRecord activeKey={tabActive} />
        </div>
      ),
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

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    if (value === '1') {
      dispatch(getDemandInfo({ projectId: params.id, id: demandInfo.id }))
    }
  }

  useEffect(() => {
    if (visible) {
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
  }, [visible])

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
        url={location.href}
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
        <MyBreadcrumb />
        {demandInfo.id && (
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
              menu={{ items }}
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
            isCanOperation={!hasEdit && demandInfo.isExamine}
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
              isActive={true}
              onClick={() => setIsOpen(!isOpen)}
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
