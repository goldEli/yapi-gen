import CommonModal from '@/components/CommonModal'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Form, Spin } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { getMessage } from '@/components/Message'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import NoPermissionModal from './NoPermissionModal'
import ChoosePeople from './ChoosePeople'
import { useTranslation } from 'react-i18next'
import UploadAttach from '@/components/UploadAttach'
import { AddWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import CustomSelect from '@/components/CustomSelect'
import NewRelatedNeed from './NewRelatedNeed'
import {
  getDailyInfo,
  getProjectList,
  getStoryListOfDaily,
  initDaily,
  writeAssistantReport,
} from '@/services/report'
import { useDispatch } from '@store/index'
import { setUpdateList } from '@store/workReport'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'

const HandleSpin = styled(Spin)`
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
  }
`

const ContentWrap = styled.div`
  .head {
    .tips {
      font-size: 12px;
      font-family: SiYuanRegular;
      color: var(--neutral-n3);
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .userBox {
      display: flex;
      align-items: center;
      margin-top: 12px;
      .desc {
        display: flex;
        flex-direction: column;
        margin-left: 6px;
        .title {
          font-size: 16px;
          font-family: SiYuanMedium;
          color: var(--neutral-n1-d1);
          .date {
            font-size: 12px;
          }
        }
        .department {
          font-family: SiYuanRegular;
          font-size: 12px;
          color: var(--neutral-n3);
        }
      }
    }
  }
  .content {
    margin-top: 32px;
    .ant-form-vertical .ant-form-item-label,
    .ant-col-24.ant-form-item-label,
    .ant-col-xl-24.ant-form-item-label {
      padding: 0px 0px 8px 0px !important;
    }
    .project {
      display: flex;
      align-items: center;
    }
    .rateText {
      font-size: 14px;
      font-family: SiYuanRegular;
      color: var(--neutral-n2);
      display: flex;
      align-items: center;
    }
    .line {
      display: inline-block;
      width: 1px;
      height: 16px;
      margin: 0px 16px;
      background: var(--neutral-n6-d1);
    }
  }
`
const LabelTitle = styled.span`
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  line-height: 22px;
`
const AgainButton = styled.div`
  width: 80px;
  height: 32px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px 6px 6px 6px;
  font-family: SiYuanRegular;
  color: var(--primary-d1);
  white-space: nowrap;
  margin-left: 16px;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    background: var(--hover-d2);
  }
  &:active {
    background: var(--auxiliary-b6);
  }
`

// 创建一个动画
const fadeInAnimation = keyframes`
  0% {
    width:0px;
  }
  50%{
    width:8px;
  }
  100%{
    width:16px;
  }
`

const Ellipsis = styled.span`
  display: inline-block;
  overflow: hidden;
  animation: ${fadeInAnimation} 1s infinite;
`

const LoadingButton = styled.span`
  height: 32px;
  font-size: 14px;
  border-radius: 6px 6px 6px 6px;
  font-family: SiYuanRegular;
  color: var(--primary-d1);
  white-space: nowrap;
  margin-left: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    width: 60px;
    text-align: right;
  }
`

interface ReportAssistantProps {
  visible: boolean
  close(): void
}

const ReportAssistantModal = (props: ReportAssistantProps) => {
  const [havePermission, setHavePermission] = useState(false)
  const [form] = Form.useForm()
  const [t]: any = useTranslation()
  const [initData, setInitData] = useState<any>(null)
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [projectList, setProjectList] = useState<any>([])
  const demandListAll = useRef([])
  const [demandList, setDemandList] = useState<any>([])
  const [modalInfo, setModalInfo] = useState<any>(null)
  const [loading, setLoading] = useState<any>(false)
  const [uploadAttachList, setUploadAttachList] = useState<any>({})
  const [peopleValue, setPeopleValue] = useState<any>([])
  const dispatch = useDispatch()
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const { close, visible } = props

  const onClose = () => {
    close()
    setCurrentProject(null)
    setModalInfo(null)
    setUploadAttachList({})
    setPeopleValue([])
  }

  // 发送日报
  const sendReport = async (params: any) => {
    let users: any[] = []
    const data: any[] = []
    Object.keys(params).forEach((key: string) => {
      const tempArr = key.split('_')
      if (tempArr[0] === '1') {
        users = params[key]
      } else if (tempArr[0] === '3') {
        const obj = {
          total_schedule: getScheduleData().rate,
          yesterday_add: params[key],
          task_completion: `${getScheduleData().done}/${
            getScheduleData().total
          }`,
          complete: getScheduleData().done,
        }
        data.push({
          conf_id: Number(tempArr[1]),
          content: JSON.stringify(obj),
          type: Number(tempArr[0]),
          name: tempArr[2],
        })
      } else if (tempArr[0] === '4') {
        data.push({
          type: Number(tempArr[0]),
          name: tempArr[2],
          conf_id: Number(tempArr[1]),
          content: (params[key] || [])?.map((i: any) => {
            const tempObj: any = demandListAll.current.find(
              (t: any) => t.id === i,
            )
            return {
              id: tempObj?.id,
              name: tempObj?.name,
              expected_day: tempObj?.expected_day,
              user_schedule_percent: tempObj?.user_schedule_percent,
            }
          }),
        })
      } else {
        data.push({
          conf_id: Number(tempArr[1]),
          content: params[key] || [],
          type: Number(tempArr[0]),
          name: tempArr[2],
        })
      }
    })
    const result = await writeAssistantReport({
      report_template_id: modalInfo?.id,
      template_name: modalInfo?.name,
      data,
      target_users: users,
    })
    if (result) {
      getMessage({
        type: 'success',
        msg: t('report.list.sendOk'),
      })
      onClose()
      // 更新List页面
      dispatch(setUpdateList({ isFresh: 1 }))
    }
  }

  // 提交
  const confirm = async () => {
    const params = form.getFieldsValue()
    if (Object.keys(params)?.length === 0) {
      getMessage({
        type: 'warning',
        msg: t('report.list.message1'),
      })
      return
    }
    let canSubmit = false
    Object.keys(params)?.forEach((k: string) => {
      const tempArr = k.split('_')
      if (tempArr[0] === '4' && params[k]?.length) {
        canSubmit = true
      }
      if (tempArr[0] === '1' && params[k]?.length <= 0) {
        canSubmit = false
      }
    })

    if (!canSubmit) {
      getMessage({
        type: 'warning',
        msg: t('report.list.message2'),
      })
      return
    }
    open({
      title: t('p2.toast'),
      okText: t('send'),
      cancelText: t('report.list.thinkAgain'),
      children: modalInfo?.send_time ? (
        <div>
          {`${t('report.list.currentDaily')}${modalInfo?.send_time}${t(
            'report.list.sendTo',
          )}-[${modalInfo?.group_name ?? '--'}]`}
          <div>{t('report.list.sendAgain')}</div>
        </div>
      ) : (
        <div>{`${t('report.list.sendToStud')}-[${
          modalInfo?.group_name ?? '--'
        }]`}</div>
      ),
      onConfirm: () => sendReport(params),
    })
  }

  // 获取项目列表
  const getProjectDataList = async () => {
    const result = await getProjectList()
    if (result) {
      setProjectList(result)
    }
  }

  // 获取当前项目的需求list
  const getDemandDataList = async (id: number) => {
    const result = await getStoryListOfDaily(id)
    demandListAll.current = result?.data ?? []
  }

  // 获取头部初始数据
  const getInitDaily = async () => {
    const result = await initDaily()
    setInitData(result)
  }

  // 实时过滤当前可选需求
  const setFilterDemand = () => {
    const result = form.getFieldsValue()
    let tempArr: any = []
    Object.keys(result).forEach((key: string) => {
      if (key?.split('_')?.[0] === '4') {
        tempArr = tempArr.concat(result[key])
      }
    })
    const configs = modalInfo?.configs?.map((item: any) => {
      if (item.type === 4) {
        return {
          ...item,
          content: result[`${item.type}_${item.id}_${item.name}`]?.map(
            (k: any) => demandListAll.current.find((i: any) => i.id === k),
          ),
        }
      }
      return item
    })
    setDemandList(
      demandListAll.current?.filter((k: any) => !tempArr?.includes(k.id)),
    )
    setModalInfo({ ...(modalInfo || {}), configs })
  }

  useEffect(() => {
    if (visible) {
      getInitDaily()
      getProjectDataList()
    }
  }, [visible])

  useEffect(() => {
    if (currentProject) {
      getDemandDataList(currentProject.id)
    }
  }, [currentProject])

  // 重新生成
  const generatorDataByProject = async () => {
    if (!currentProject) {
      getMessage({
        msg: t('report.list.message3'),
        type: 'warning',
      })
      return
    }
    if (!currentProject?.report_template_id) {
      setHavePermission(true)
      close()
      return
    }
    setLoading(true)
    try {
      const result = await getDailyInfo(currentProject?.id)
      setLoading(false)
      if (result.enable_hand_send === 2 || result.is_setting_config === 2) {
        setHavePermission(true)
        close()
        return
      }
      setCurrentProject({
        ...currentProject,
        is_setting_config: result.is_setting_config,
        enable_hand_send: result.enable_hand_send,
      })
      setModalInfo(result)
      // 先过滤掉已经默认选择的需求
      let tempArr: any = []
      const attach: any = {}
      result?.configs?.forEach((item: any) => {
        if (item.type === 4) {
          tempArr = tempArr.concat(item.content ?? [])
        }
        if (item.type === 2) {
          attach[`${item.type}_${item.id}_${item.name}`] = item?.content ?? []
        }
      })
      setUploadAttachList({
        ...attach,
      })
      tempArr = tempArr.map((i: any) => i.id)
      setDemandList(
        demandListAll.current?.filter((k: any) => !tempArr.includes(k.id)) ??
          [],
      )
      setPeopleValue(
        result?.reportUserList?.map((item: any) => {
          return {
            avatar: item?.avatar,
            id: item.id || item.user_id,
            name: item?.name,
            noDel: true,
          }
        }) ?? [],
      )
    } catch (error) {
      setLoading(false)
    }
  }

  // 选择附件逻辑处理
  const onChangeAttachment = (result: any, name: string) => {
    const arr = result.map((i: any) => {
      return {
        name: i.name,
        url: i.url,
        size: i.size,
        ext: i.ext,
        ctime: i.ctime,
      }
    })

    form.setFieldsValue({
      [name]: arr,
    })
  }

  // 计算进度相关数据
  const getScheduleData = () => {
    let tempArr: any[] = []
    modalInfo?.configs?.forEach((item: any) => {
      if (item.type === 4) {
        tempArr = tempArr.concat(item.content ?? [])
      }
    })

    let total = 0
    let done = 0
    if (tempArr.length) {
      total = Number(tempArr.length)
      done = Number(tempArr.filter((k: any) => k.is_end === 1).length)
    } else {
      total = 0
      done = 0
    }
    return {
      rate: total > 0 ? Number((done / total).toFixed(2)) * 100 : 0,
      done: done,
      total: total,
    }
  }

  // 根据数据type生成对应的日报模板
  const generatorHtmlByData = (content: any): React.ReactElement => {
    switch (content.type) {
      case 1:
        return (
          <Form.Item
            label={<LabelTitle>{content.name}</LabelTitle>}
            name={`${content.type}_${content.id}_${content.name}`}
          >
            <ChoosePeople initValue={peopleValue} />
          </Form.Item>
        )
      case 2:
        return (
          <Form.Item
            label={<LabelTitle>{content.name}</LabelTitle>}
            name={`${content.type}_${content.id}_${content.name}`}
            rules={[
              {
                message: (
                  <div
                    style={{
                      margin: '5px 0',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {t('report.list.upload')}
                  </div>
                ),
              },
            ]}
          >
            <UploadAttach
              power
              defaultList={
                uploadAttachList[
                  `${content.type}_${content.id}_${content.name}`
                ]
              }
              onChangeAttachment={(res: any) => {
                onChangeAttachment(
                  res,
                  `${content.type}_${content.id}_${content.name}`,
                )
              }}
              addWrap={
                <AddWrap hasColor>
                  <IconFont type="plus" />
                  <div>{t('p2.addAdjunct') as unknown as string}</div>
                </AddWrap>
              }
            />
          </Form.Item>
        )
      case 3:
        return (
          <Form.Item
            label={
              <LabelTitle>
                {content.name}：{getScheduleData().rate}%
              </LabelTitle>
            }
            name={`${content.type}_${content.id}_${content.name}`}
            initialValue={JSON.parse(content?.content ?? null)?.yesterday_add}
          >
            <div className="rateText">
              {t('report.list.addedYesterday')}：
              {JSON.parse(content?.content ?? null)?.yesterday_add}
              {t('report.list.pieces')}
            </div>
            <div className="rateText">
              <span>
                {t('report.list.taskProgress')}：{getScheduleData().done}/
                {getScheduleData().total}
              </span>
              <span className="line" />
              <span>
                {t('completed')}： {getScheduleData().done}
                {t('report.list.pieces')}
              </span>
            </div>
          </Form.Item>
        )
      case 4:
        return (
          <Form.Item
            label={
              <LabelTitle>
                {content.name}：{content?.content?.length}个
              </LabelTitle>
            }
            name={`${content.type}_${content.id}_${content.name}`}
          >
            <NewRelatedNeed
              initValue={content?.content}
              data={demandList}
              canSubmit={(arr: any) => {
                const isCan = arr?.every((i: any) =>
                  demandList?.map((o: any) => o?.id)?.includes(i?.value),
                )
                if (!isCan) {
                  if (content.key === 'timeout_task') {
                    getMessage({
                      msg: t(
                        'thereAreDuplicateTasksInPleaseCancelTheDuplicateAssociation',
                      ),
                      type: 'warning',
                    })
                  } else {
                    getMessage({
                      msg: t(
                        'thereAreDuplicateTasksInPleaseCancelTheDuplicateAssociation2',
                      ),
                      type: 'warning',
                    })
                  }
                }
                return isCan
              }}
              onFilter={() => {
                setFilterDemand()
              }}
              // 是否显示逾期
              isShowOverdue={content?.key === 'timeout_task'}
            />
          </Form.Item>
        )
      default:
        return <div></div>
    }
  }

  return (
    <>
      <CommonModal
        width={784}
        title={t('report.list.reportAssistant')}
        isVisible={visible}
        onClose={onClose}
        onConfirm={confirm}
        confirmText={t('send')}
      >
        <div
          style={{
            height: 'calc(90vh - 136px)',
            overflow: 'scroll',
            padding: ' 0 24px',
          }}
        >
          <ContentWrap>
            <div className="head">
              {currentProject?.is_setting_config === 1 &&
              currentProject?.enable_hand_send === 1 ? (
                <div className="tips">{t('report.list.tips1')}</div>
              ) : null}
              <div className="userBox">
                {initData?.avatar ? (
                  <img className="avatar" src={initData?.avatar} />
                ) : (
                  <CommonUserAvatar size="large" />
                )}
                <div className="desc">
                  <div className="title">
                    {initData?.report_title}
                    <span className="date">
                      {initData?.daily_date
                        ? `（${initData?.daily_date}）`
                        : ''}
                    </span>
                  </div>
                  <div className="department">
                    {[
                      initData?.company_name,
                      initData?.department_name,
                      initData?.job_name,
                    ]
                      ?.filter((k: any) => k)
                      ?.join('-')}
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <Form form={form} layout="vertical">
                <Form.Item
                  label={<LabelTitle>{t('report.list.message3')}</LabelTitle>}
                >
                  <div className="project">
                    <CustomSelect
                      optionFilterProp="label"
                      showSearch
                      onChange={(val: any) => {
                        setModalInfo(null)
                        setCurrentProject(
                          projectList?.find((item: any) => item.id === val),
                        )
                      }}
                      options={projectList?.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                        key: item.id,
                      }))}
                    />
                    {loading ? (
                      <LoadingButton>
                        <span>{t('report.list.generate')}</span>
                        <div style={{ width: 20 }}>
                          <Ellipsis>......</Ellipsis>
                        </div>
                      </LoadingButton>
                    ) : (
                      <AgainButton onClick={generatorDataByProject}>
                        {t('report.list.generateReport')}
                      </AgainButton>
                    )}
                  </div>
                </Form.Item>
                <HandleSpin
                  spinning={loading}
                  indicator={<NewLoadingTransition />}
                />
                {!loading &&
                  modalInfo?.configs?.map((item: any) => (
                    <div style={{ marginBottom: 18 }} key={item.id}>
                      {generatorHtmlByData(item)}
                    </div>
                  ))}
              </Form>
            </div>
          </ContentWrap>
        </div>
      </CommonModal>
      <NoPermissionModal
        id={currentProject?.id}
        visible={havePermission}
        close={() => {
          setHavePermission(false)
        }}
      />
      <DeleteConfirmModal />
    </>
  )
}

export default ReportAssistantModal
