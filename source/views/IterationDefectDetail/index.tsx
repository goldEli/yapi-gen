/* eslint-disable no-undefined */
import useShareModal from '@/hooks/useShareModal'
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
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useEffect, useRef, useState } from 'react'
import { Form, MenuProps, Popover, Tabs, TabsProps, Tooltip } from 'antd'
import { useDispatch, useSelector } from '@store/index'
import CustomSelect from '@/components/CustomSelect'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import ChangeStatusPopover from '@/components/ChangeStatusPopover'
import StateTag from '@/components/StateTag'
import { getMessage } from '@/components/Message'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import {
  deleteFlaw,
  updateFlawCategory,
  updateFlawStatus,
  updateFlawTableParams,
} from '@/services/flaw'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { copyLink, getIsPermission, getParamsData } from '@/tools'
import { getWorkflowList } from '@/services/project'
import FlawInfo from './components/FlawInfo'
import ChangeRecord from './components/ChangeRecord'
import Circulation from './components/Circulation'
import RelationStories from './components/RelationStories'
import {
  setAddWorkItemModal,
  setIsUpdateAddWorkItem,
  setIsUpdateChangeLog,
  setIsUpdateStatus,
} from '@store/project'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setActiveCategory } from '@store/category'
import { setFlawInfo } from '@store/flaw'
import CopyIcon from '@/components/CopyIcon'

const IterationDefectDetail = () => {
  const navigate = useNavigate()
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, flawId, changeIds, newOpen } = paramsData
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  const [isShowChange, setIsShowChange] = useState(false)
  const [isShowCategory, setIsShowCategory] = useState(false)
  const [resultCategory, setResultCategory] = useState([])
  const [tabActive, setTabActive] = useState('1')
  const { flawInfo } = useSelector(store => store.flaw)
  const { projectInfoValues, isUpdateAddWorkItem, projectInfo } = useSelector(
    store => store.project,
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  // 工作流列表
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  const spanDom = useRef<HTMLSpanElement>(null)

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/flaw/update',
  )

  // 复制标题
  const onCopy = () => {
    copyLink(flawInfo.name, '复制成功！', '复制失败！')
  }

  // 快捷修改名称
  const onNameConfirm = async () => {
    const value = spanDom.current?.innerText
    if ((value?.length || 0) <= 0) {
      getMessage({ type: 'warning', msg: '名称不能为空' })
      return
    }
    if ((value?.length || 0) > 100) {
      getMessage({ type: 'warning', msg: '名称不能超过100个字' })
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
      getMessage({ type: 'success', msg: '修改成功' })
      // 提交名称
      setFlawInfo({
        ...flawInfo,
        name: value,
      })
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }
  }

  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: id, id: flawInfo.id }))
  }

  // 修改缺陷状态
  const onChangeStatus = async (value: any) => {
    await updateFlawStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    dispatch(getFlawInfo({ projectId: id, id: flawInfo.id }))
    dispatch(
      getFlawCommentList({
        projectId: id,
        id: flawInfo.id || 0,
        page: 1,
        pageSize: 20,
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
    await updateFlawCategory({
      projectId: id,
      id: flawInfo.id,
      ...form.getFieldsValue(),
    })
    getMessage({ msg: t('newlyAdd.changeSuccess'), type: 'success' })
    setIsShowCategory(false)
    dispatch(setIsUpdateStatus(true))
    // dispatch(setIsRefresh(true))
    dispatch(getFlawInfo({ projectId: id, id: flawInfo.id }))
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

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

  // 返回
  const onBack = () => {
    if (newOpen) {
      const params = encryptPhp(JSON.stringify({ id: flawInfo.projectId }))
      navigate(`/ProjectManagement/Defect?data=${params}`)
    } else {
      history.go(-1)
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

  //   编辑缺陷
  const onEdit = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: flawInfo.id,
          projectId: flawInfo.projectId,
          type: 2,
          title: '编辑缺陷',
        },
      }),
    )
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    const params = encryptPhp(
      JSON.stringify({
        type: 4,
        id: id,
        pageIdx: 'DemandDetail',
        categoryItem: {
          id: flawInfo.category,
          status: flawInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
    //
  }

  // 确认删除
  const onDeleteConfirm = async () => {
    await deleteFlaw({
      projectId: flawInfo.projectId || 0,
      id: flawInfo.id || 0,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    const params = encryptPhp(JSON.stringify({ id: flawInfo.projectId }))
    navigate(`/ProjectManagement/Defect?data=${params}`)
  }

  // 删除缺陷弹窗
  const onDelete = () => {
    openDelete({
      title: '删除确认',
      text: '确认删除该缺陷？',
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
      '复制成功！',
      '复制失败！',
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
        demandId: flawInfo.id,
      }),
    )
    const url = `/ProjectManagement/DemandDetail?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(text, '复制成功！', '复制失败！')
  }

  // 更多下拉
  const items: MenuProps['items'] = [
    {
      label: <div onClick={onEdit}>编辑</div>,
      key: '0',
    },
    {
      label: <div onClick={onDelete}>删除</div>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={onCopyId}>复制编号</div>,
      key: '2',
    },
    {
      label: <div onClick={onCopyLink}>复制链接</div>,
      key: '3',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={onToConfig}>配置</div>,
      key: '4',
    },
  ]

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
      {resultCategory?.map((k: any) => {
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

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <ActivityTabItem>
          <span>详细信息</span>
        </ActivityTabItem>
      ),
      children: <FlawInfo />,
    },
    {
      key: '2',
      label: (
        <ActivityTabItem>
          <span>关联工作项</span>
        </ActivityTabItem>
      ),
      children: (
        <RelationStories
          activeKey={tabActive}
          detail={flawInfo as Model.Flaw.FlawInfo}
          onUpdate={onUpdate}
        />
      ),
    },
    {
      key: '3',
      label: (
        <ActivityTabItem>
          <span>变更记录</span>
          <ItemNumber isActive={tabActive === '2'}>
            {flawInfo.changeCount}
          </ItemNumber>
        </ActivityTabItem>
      ),
      children: <ChangeRecord activeKey={tabActive} />,
    },
    {
      key: '4',
      label: (
        <ActivityTabItem>
          <span>流转记录</span>
        </ActivityTabItem>
      ),
      children: <Circulation activeKey={tabActive} />,
    },
  ]

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    if (value === '1') {
      dispatch(getFlawInfo({ projectId: id, id: flawInfo.id }))
    }
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = changeIds[currentIndex - 1]
    if (!currentIndex) return
    const params = encryptPhp(
      JSON.stringify({
        ...paramsData,
        ...{ id, changeIds, flawId: newIndex },
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
        ...{ id, changeIds, flawId: newIndex },
      }),
    )
    setSearchParams(`data=${params}`)
  }

  useEffect(() => {
    if (flawId && id) {
      dispatch(getFlawInfo({ projectId: id, id: flawId }))
    }
  }, [flawId, id])

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
    setCurrentIndex((changeIds || []).findIndex((i: any) => i === flawInfo?.id))
  }, [flawInfo, projectInfoValues])

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      dispatch(getFlawInfo({ projectId: id, id: flawInfo.id }))
    }
  }, [isUpdateAddWorkItem])

  return (
    <Wrap>
      <DeleteConfirmModal />
      <ShareModal
        url={location.href}
        title={
          flawInfo?.name
            ? `【${flawInfo?.projectPrefix} ${flawInfo?.name}】`
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
      <DetailTop>
        <MyBreadcrumb />
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
            menu={{ items }}
            getPopupContainer={n => n}
          >
            <div>
              <CommonButton type="icon" icon="more" />
            </div>
          </DropdownMenu>
        </ButtonGroup>
      </DetailTop>
      <DetailTitle>
        <Tooltip title={flawInfo?.categoryName}>
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
        </Tooltip>
        <DetailText>
          {!hasEdit && (
            <span
              className="name"
              ref={spanDom}
              contentEditable
              onBlur={onNameConfirm}
            >
              {flawInfo.name}
            </span>
          )}
          {hasEdit && <span className="name">{flawInfo.name}</span>}
          <CopyIcon onCopy={onCopy} />
          <ChangeStatusPopover
            projectId={flawInfo.projectId}
            isCanOperation={!hasEdit}
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
      />
    </Wrap>
  )
}

export default IterationDefectDetail
