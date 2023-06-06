/* eslint-disable no-undefined */
import React, { useEffect, useRef, useState } from 'react'
import {
  ButtonGroup,
  ChangeIconGroup,
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
  Wrap,
} from './style'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import useShareModal from '@/hooks/useShareModal'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useSearchParams } from 'react-router-dom'
import { copyLink, getParamsData } from '@/tools'
import { Form, MenuProps, Popover, Tabs, TabsProps, Tooltip } from 'antd'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import ChangeStatusPopover from '@/components/ChangeStatusPopover'
import StateTag from '@/components/StateTag'
import DemandDetailInfo from './components/DemandDetailInfo'
import { getWorkflowList } from '@/services/project'
import { getMessage } from '@/components/Message'
import { setDemandInfo } from '@store/demand'
import { getDemandCommentList, getDemandInfo } from '@store/demand/demand.thunk'
import {
  updateDemandCategory,
  updateDemandStatus,
  updateTableParams,
} from '@/services/demand'
import { setIsUpdateStatus } from '@store/project'
import { setIsRefresh } from '@store/user'
import ChildDemand from './components/ChildDemand'
import ChangeRecord from './components/ChangeRecord'
import Circulation from './components/Circulation'
import StoryRelation from './components/StoryRelation'

const DemandDetail = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  const spanDom = useRef<HTMLSpanElement>(null)

  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, demandId } = paramsData
  const { demandInfo } = useSelector(store => store.demand)
  const { projectInfoValues } = useSelector(store => store.project)
  const [form] = Form.useForm()
  const [isShowChange, setIsShowChange] = useState(false)
  const [isShowCategory, setIsShowCategory] = useState(false)
  const [resultCategory, setResultCategory] = useState([])
  // 工作流列表
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })

  const [tabActive, setTabActive] = useState('1')

  // 复制标题
  const onCopy = () => {
    copyLink(demandInfo.name, '复制成功！', '复制失败！')
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
    await updateDemandStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    dispatch(getDemandInfo({ projectId: id, id: demandId }))
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
      projectId: id,
      demandId,
      ...form.getFieldsValue(),
    })
    getMessage({ msg: t('newlyAdd.changeSuccess'), type: 'success' })
    setIsShowCategory(false)
    dispatch(setIsUpdateStatus(true))
    dispatch(setIsRefresh(true))
    dispatch(getDemandInfo({ projectId: id, id: demandId }))
    setTimeout(() => {
      form.resetFields()
    }, 100)
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
    if (value !== demandInfo.name) {
      await updateTableParams({
        projectId: id,
        id: demandId,
        otherParams: {
          name: value,
        },
      })
      getMessage({ type: 'success', msg: '修改成功' })
      // 提交名称
      setDemandInfo({
        ...demandInfo,
        name: value,
      })
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

  // 确认删除
  const onDeleteConfirm = () => {
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

  // 删除事务弹窗
  const onDelete = () => {
    openDelete({
      title: '删除确认',
      text: '确认删除该事务？',
      onConfirm() {
        onDeleteConfirm()
        return Promise.resolve()
      },
    })
  }

  // 跳转配置
  const onConfig = () => {
    //
  }

  //   编辑需求
  const onEdit = () => {
    //
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
      label: <div onClick={onConfig}>配置</div>,
      key: '4',
    },
  ]

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    if (value === '1') {
      dispatch(getDemandInfo({ projectId: id, id: demandId }))
    }
  }

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <DetailTabItem>
          <span>详细信息</span>
        </DetailTabItem>
      ),
      children: <DemandDetailInfo />,
    },
    {
      key: '2',
      label: (
        <DetailTabItem>
          <span>子需求</span>
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
          <span>关联工作项</span>
        </DetailTabItem>
      ),
      children: <StoryRelation activeKey={tabActive} detail={demandInfo} />,
    },
    {
      key: '4',
      label: (
        <DetailTabItem>
          <span>变更记录</span>
          <ItemNumber isActive={tabActive === '4'}>
            {demandInfo?.changeCount || 0}
          </ItemNumber>
        </DetailTabItem>
      ),
      children: <ChangeRecord activeKey={tabActive} />,
    },
    {
      key: '5',
      label: (
        <DetailTabItem>
          <span>流转记录</span>
        </DetailTabItem>
      ),
      children: <Circulation activeKey={tabActive} />,
    },
  ]

  useEffect(() => {
    dispatch(setDemandInfo({}))
    dispatch(getDemandInfo({ projectId: id, id: demandId }))
    dispatch(
      getDemandCommentList({
        projectId: id,
        demandId,
        page: 1,
        pageSize: 999,
      }),
    )
  }, [])

  useEffect(() => {
    // 获取项目信息中的需求类别
    const list = projectInfoValues?.filter((i: any) => i.key === 'category')[0]
      ?.children
    setResultCategory(
      list
        ?.filter((i: any) => i.id !== demandInfo?.category)
        ?.filter((i: any) => i.status === 1),
    )
  }, [demandInfo, projectInfoValues])

  return (
    <Wrap>
      <DeleteConfirmModal />
      {/* <ShareModal
        copyLink={() => {
          // Todo 传入复制方法
        }}
      /> */}
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
          <span
            className="name"
            ref={spanDom}
            contentEditable
            onBlur={onNameConfirm}
          >
            {demandInfo.name}
          </span>
          <span className="icon" onClick={onCopy}>
            <CommonIconFont type="copy" color="var(--neutral-n3)" />
          </span>
          <ChangeStatusPopover
            record={demandInfo}
            onChangeStatus={onChangeStatus}
            type={1}
          >
            <StateTag
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
        activeKey={tabActive}
        items={tabItems}
        onChange={onChangeTabs}
      />
    </Wrap>
  )
}

export default DemandDetail
