/* eslint-disable no-undefined */
import React, { useEffect, useState } from 'react'
import {
  ButtonGroup,
  ChangeIconGroup,
  DetailMain,
  DetailText,
  DetailTitle,
  DetailTop,
  DownWrap,
  FormWrap,
  Img,
  LiWrap,
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
import { getSprintCommentList, getSprintInfo } from '@store/sprint/sprint.thunk'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { Popover, Tooltip, Form } from 'antd'
import CommonModal from '@/components/CommonModal'
import { useTranslation } from 'react-i18next'
import CustomSelect from '@/components/CustomSelect'
import { getWorkflowList } from '@/services/project'
import { getMessage } from '@/components/Message'
import { updateSprintCategory } from '@/services/sprint'

interface IProps {}

const SprintProjectDetail: React.FC<IProps> = props => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { sprintInfo } = useSelector(store => store.sprint)
  const { projectInfoValues } = useSelector(store => store.project)
  const [isShowChange, setIsShowChange] = useState(false)
  const [isShowCategory, setIsShowCategory] = useState(false)
  const [resultCategory, setResultCategory] = useState([])
  // 工作流列表
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })

  // 复制标题
  const onCopy = () => {
    //
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
          <LiWrap key={k.id}>
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
    await updateSprintCategory({
      projectId: id,
      sprintId,
      ...form.getFieldsValue(),
    })
    getMessage({ msg: t('newlyAdd.changeSuccess'), type: 'success' })
    setIsShowCategory(false)
    // dispatch(setIsUpdateStatus(true))
    // dispatch(setIsRefresh(true))
    dispatch(getSprintInfo({ projectId: id, sprintId }))
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  useEffect(() => {
    dispatch(getSprintInfo({ projectId: id, sprintId }))
    dispatch(
      getSprintCommentList({
        projectId: id,
        sprintId,
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
        ?.filter((i: any) => i.id !== sprintInfo?.category)
        ?.filter((i: any) => i.status === 1),
    )
  }, [sprintInfo, projectInfoValues])

  return (
    <Wrap>
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
              src={sprintInfo?.category_attachment}
              style={{
                width: '18px',
                height: '18px',
                marginRight: '8px',
              }}
              alt=""
            />
            <span>{sprintInfo?.categoryName}</span>
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
          <CommonButton type="icon" icon="left-md" />
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
          <CommonButton type="icon" icon="share" />
          <CommonButton type="icon" icon="more" />
        </ButtonGroup>
      </DetailTop>
      <DetailTitle>
        <Tooltip title={sprintInfo?.categoryName}>
          <Popover
            trigger={['hover']}
            visible={isShowChange}
            placement="bottomLeft"
            content={changeStatus}
            getPopupContainer={node => node}
            onVisibleChange={visible => setIsShowChange(visible)}
          >
            <div>
              <Img src={sprintInfo.category_attachment} alt="" />
            </div>
          </Popover>
        </Tooltip>

        <DetailText>
          <span className="name">{sprintInfo.name}</span>
          <span className="icon" onClick={onCopy}>
            <CommonIconFont type="copy" color="var(--neutral-n3)" />
          </span>
          <ChangeStatusPopover>
            <StateTag
              name={sprintInfo.status?.status.content}
              state={
                sprintInfo.status?.is_start === 1 &&
                sprintInfo.status?.is_end === 2
                  ? 1
                  : sprintInfo.status?.is_end === 1 &&
                    sprintInfo.status?.is_start === 2
                  ? 2
                  : sprintInfo.status?.is_start === 2 &&
                    sprintInfo.status?.is_end === 2
                  ? 3
                  : 0
              }
            />
          </ChangeStatusPopover>
        </DetailText>
      </DetailTitle>
      <DetailMain>
        <SprintDetailInfo />
        <SprintDetailBasic />
      </DetailMain>
    </Wrap>
  )
}
export default SprintProjectDetail
