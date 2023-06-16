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
import { useEffect, useState } from 'react'
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
import { updateFlawCategory, updateFlawStatus } from '@/services/flaw'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { copyLink, getParamsData } from '@/tools'
import { getWorkflowList } from '@/services/project'
import { setFlawInfo } from '@store/flaw'
import FlawInfo from './components/FlawInfo'
import ChangeRecord from './components/ChangeRecord'
import Circulation from './components/Circulation'
import RelationStories from './components/RelationStories'
import { setIsUpdateStatus } from '@store/project'
import { encryptPhp } from '@/tools/cryptoPhp'
const IterationDefectDetail = () => {
  const navigate = useNavigate()
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, flawId } = paramsData
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  const [isShowChange, setIsShowChange] = useState(false)
  const [isShowCategory, setIsShowCategory] = useState(false)
  const [resultCategory, setResultCategory] = useState([])
  const [tabActive, setTabActive] = useState('1')
  const { flawInfo } = useSelector(store => store.flaw)
  const { projectInfoValues } = useSelector(store => store.project)
  // 工作流列表
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })

  // 复制标题
  const onCopy = () => {
    copyLink(flawInfo.name, '复制成功！', '复制失败！')
  }

  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: id, id: flawId }))
  }

  // 修改缺陷状态
  const onChangeStatus = async (value: any) => {
    await updateFlawStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    dispatch(getFlawInfo({ projectId: id, id: flawId }))
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
      id: flawId,
      ...form.getFieldsValue(),
    })
    getMessage({ msg: t('newlyAdd.changeSuccess'), type: 'success' })
    setIsShowCategory(false)
    dispatch(setIsUpdateStatus(true))
    // dispatch(setIsRefresh(true))
    dispatch(getFlawInfo({ projectId: id, id: flawId }))
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
    history.go(-1)
  }

  // 确认分享
  const onShareConfirm = () => {
    //
  }

  // 分享弹窗
  const onShare = () => {
    open({
      onOk: () => {
        onShareConfirm()
        return Promise.resolve()
      },
    })
  }

  //   编辑缺陷
  const onEdit = () => {
    //
  }

  // 跳转配置
  const onToConfig = () => {
    const params = encryptPhp(
      JSON.stringify({
        type: 4,
        id: id,
        categoryName: '特效',
        pageIdx: 'DemandDetail',
        categoryItem: {
          id: flawInfo.category,
          status: 1,
        },
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
    //
  }

  // 确认删除
  const onDeleteConfirm = () => {
    //
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
      label: '复制编号',
      key: '2',
    },
    {
      label: '复制链接',
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
      dispatch(getFlawInfo({ projectId: id, id: flawId }))
    }
  }

  useEffect(() => {
    // dispatch(setFlawInfo({}))
    dispatch(getFlawInfo({ projectId: id, id: flawId }))
  }, [])

  useEffect(() => {
    // 获取项目信息中的需求类别
    const list = projectInfoValues?.filter((i: any) => i.key === 'category')[0]
      ?.children
    setResultCategory(
      list
        ?.filter((i: any) => i.id !== flawInfo?.category)
        ?.filter((i: any) => i.status === 1),
    )
  }, [flawInfo, projectInfoValues])

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
          <CommonButton type="icon" icon="left-md" onClick={onBack} />
          <ChangeIconGroup>
            {/* {currentIndex > 0 && ( */}
            <UpWrap
              // onClick={onUpDemand}
              id="upIcon"
              // isOnly={
              //   demandIds?.length === 0 ||
              //   currentIndex === demandIds?.length - 1
              // }
            >
              <CommonIconFont
                type="up"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </UpWrap>
            {/* )} */}
            {/* {!(
                demandIds?.length === 0 ||
                currentIndex === demandIds?.length - 1
              ) &&  ( */}
            <DownWrap
              // onClick={onDownDemand}
              id="downIcon"
              // isOnly={currentIndex <= 0}
            >
              <CommonIconFont
                type="down"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </DownWrap>
            {/* )} */}
          </ChangeIconGroup>
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
          <span className="name">{flawInfo.name}</span>
          <span className="icon" onClick={onCopy}>
            <CommonIconFont type="copy" color="var(--neutral-n3)" />
          </span>
          <ChangeStatusPopover
            projectId={flawInfo.projectId}
            isCanOperation
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
