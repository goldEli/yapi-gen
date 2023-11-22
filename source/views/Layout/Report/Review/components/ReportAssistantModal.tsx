import CommonModal from '@/components/CommonModal'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { Form } from 'antd'
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
  getListOfProjectDaily,
  getProjectList,
  getProjectTemplateInfo,
  getStoryListOfDaily,
  initDaily,
  writeAssistantReport,
  writeProjectAssistantReport,
} from '@/services/report'
import { useDispatch } from '@store/index'
import { setUpdateList } from '@store/workReport'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { Editor } from 'ifunuikit'
import { uploadFile } from '@/components/AddWorkItem/CreateWorkItemLeft'
import { getStaffListAll } from '@/services/staff'
import NewRelatedNeedForProject from './NewRelatedNeedForProject'
import {
  AgainButton,
  ContentWraps,
  Ellipsis,
  HandleSpin,
  LabelTitles,
  LoadingButton,
  TitleTips,
  NotHaveTaskWrap,
} from './style'
import ProjectGroup from './ProjectGroup'

interface ReportAssistantProps {
  visible: boolean
  close(): void
  type: 'user' | 'project'
  projectId?: number | null
}

const ReportAssistantModal = (props: ReportAssistantProps) => {
  const [havePermission, setHavePermission] = useState(false)
  const [form] = Form.useForm()
  const [t]: any = useTranslation()
  const [initData, setInitData] = useState<any>(null)
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [projectList, setProjectList] = useState<any>([])
  const [demandListAll, setDemandListAll] = useState<any>([])
  const [demandList, setDemandList] = useState<any>([])
  const [modalInfo, setModalInfo] = useState<any>(null)
  const [loading, setLoading] = useState<any>(false)
  const [uploadAttachList, setUploadAttachList] = useState<any>({})
  const [uploadAttachListStatus, setUploadAttachListStatus] = useState<any>({})
  const [peopleValue, setPeopleValue] = useState<any>([])
  const dispatch = useDispatch()
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const [options, setOptions] = useState<any>([])
  const [tasksConfig, setTasksConfig] = useState<any>({})
  const { close, visible, type, projectId } = props

  // 带入默认选中项目
  useEffect(() => {
    if (projectId && projectList?.length > 0) {
      setCurrentProject(projectList?.find((item: any) => item.id === projectId))
    }
    if (projectId === null) {
      setCurrentProject(null)
    }
  }, [projectId, projectList])

  const onClose = () => {
    close()
    setCurrentProject(null)
    setModalInfo(null)
    setUploadAttachList({})
    setPeopleValue([])
    setUploadAttachListStatus({})
    form.resetFields()
  }

  // 发送日报
  const sendReport = async (params: any) => {
    let users: any[] = []
    const data: any[] = []
    Object.keys(params).forEach((key: string) => {
      const tempArr = key.split('+')
      if (tempArr[0] === '1') {
        users = params[key]
      } else if (tempArr[0] === '3') {
        if (tempArr[2] === 'total_schedule') {
          const obj = {
            total_schedule: getScheduleData().rate,
            yesterday_add: params[key],
            task_completion: `${getScheduleData().done}/${
              getScheduleData().total
            }`,
            complete: getScheduleData().done,
            [type === 'user'
              ? 'user_today_total_task_time'
              : 'today_total_task_time']: getScheduleData().totalHour,
          }
          data.push({
            conf_id: Number(tempArr[1]),
            content: JSON.stringify(obj),
            type: Number(tempArr[0]),
            name: tempArr[2],
          })
        } else {
          data.push({
            conf_id: Number(tempArr[1]),
            content: params[key] || '',
            type: Number(tempArr[0]),
            name: tempArr[2],
          })
        }
      } else if (tempArr[0] === '4') {
        data.push({
          type: Number(tempArr[0]),
          name: tempArr[2],
          conf_id: Number(tempArr[1]),
          content: (params[key] || [])?.map((i: any) => {
            const tempObj: any = demandListAll?.find((t: any) => t.id === i)
            return type === 'user'
              ? {
                  id: tempObj?.id,
                  name: tempObj?.name,
                  expected_day: tempObj?.expected_day,
                  user_schedule_percent: tempObj?.user_schedule_percent,
                  user_today_task_time: tempObj?.user_today_task_time,
                  user_total_task_time: tempObj?.user_total_task_time,
                }
              : i
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
    // return
    let result = null
    if (type === 'user') {
      result = await writeAssistantReport({
        report_template_id: modalInfo?.id,
        template_name: modalInfo?.name,
        data,
        target_users: users,
      })
    } else {
      result = await writeProjectAssistantReport({
        report_template_id: modalInfo?.id,
        template_name: modalInfo?.name,
        data,
        target_users: users,
      })
    }

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
    let notHaveTask = false
    Object.keys(params)?.forEach((k: string) => {
      const tempArr = k.split('+')
      if (tempArr[0] === '4' && params[k]?.length > 0) {
        canSubmit = true
      }
      if (tempArr[0] === '4' && params[k]?.length <= 0) {
        notHaveTask = true
      }
      if (tempArr[0] === '1' && params[k]?.length <= 0) {
        canSubmit = false
      }
    })

    // 如果没有任务关联的需求
    if (notHaveTask) {
      open({
        title: t('p2.toast'),
        okText: t('confirm'),
        cancelText: t('cancel'),
        children: (
          <NotHaveTaskWrap>
            <span>{t('yourTaskAssociationNumberIsAndYouCannotSendDaily')}</span>
            <span>
              {t('pleaseClickTheAssociatedButtonBelowToQuicklyAddTasks')}
            </span>
          </NotHaveTaskWrap>
        ),
        onConfirm: () => {
          return Promise.resolve()
        },
      })
    }

    if (!canSubmit) {
      getMessage({
        type: 'warning',
        msg: t('report.list.message2'),
      })
      return
    }

    // 判断有文件在uploading状态
    if (Object.values(uploadAttachListStatus)?.some((i: any) => !!i)) {
      getMessage({
        type: 'warning',
        msg: t('theFileIsBeingPleaseWait'),
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
    const result = await getProjectList({
      type: type === 'project' ? 3 : 2,
    })
    if (result) {
      setProjectList(result)
    }
  }

  // 获取当前项目的需求list keyword：是否带有搜索
  const getDemandDataList = async (id: number, keyword?: string) => {
    let result = []
    const value = form.getFieldsValue()
    let tempArr: any = []
    Object.keys(value).forEach((key: string) => {
      if (key?.split('+')?.[0] === '4') {
        tempArr = tempArr.concat(value[key])
      }
    })
    if (type === 'user') {
      result = await getStoryListOfDaily({
        project_id: id,
        keyword,
        exclude_ids: tempArr,
      })
    } else {
      result = await getListOfProjectDaily(id)
    }

    setDemandList(result?.data ?? [])
  }

  // 获取头部初始数据
  const getInitDaily = async () => {
    const result = await initDaily({
      type: type === 'project' ? 3 : 2,
      project_id: currentProject.id,
    })
    setInitData(result)
  }

  useEffect(() => {
    if (visible && currentProject) {
      getInitDaily()
      getProjectDataList()
    }
  }, [visible, currentProject])

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
    // 个人日报
    if (!currentProject?.report_template_id && type === 'user') {
      setHavePermission(true)
      close()
      return
    }
    // 项目日报
    if (!currentProject?.project_report_template_id && type === 'project') {
      setHavePermission(true)
      close()
      return
    }
    setLoading(true)
    setUploadAttachListStatus({})
    setTasksConfig({})
    form.resetFields()
    try {
      let result = null
      if (type === 'user') {
        result = await getDailyInfo(currentProject?.id)
      } else {
        result = await getProjectTemplateInfo(currentProject?.id)
      }
      setLoading(false)
      if (type === 'user') {
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
      } else {
        if (result.is_setting_project_config === 2) {
          setHavePermission(true)
          close()
          return
        }
        setCurrentProject({
          ...currentProject,
          is_setting_project_config: result.is_setting_project_config,
        })
      }
      setModalInfo(result)
      // 先过滤掉已经默认选择的需求
      let tempArr: any = []
      const attach: any = {}
      const taskObj: any = {}
      result?.configs?.forEach((item: any) => {
        if (item.type === 4) {
          taskObj[`${item.type}+${item.id}+${item.name}`] = item.content
          tempArr = tempArr.concat(item.content ?? [])
        }
        if (item.type === 2) {
          attach[`${item.type}+${item.id}+${item.name}`] =
            item?.content.map((i: any) => ({
              url: i.url,
              size: i.size,
              time: i.ctime,
              name: i.name,
              suffix: i.ext,
            })) ?? []
        }
      })
      setTasksConfig({
        ...taskObj,
      })
      setUploadAttachList({
        ...attach,
      })
      setDemandListAll([...tempArr, ...demandListAll])
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

  // (日报)计算进度相关数据
  const getScheduleData = () => {
    let tempArr: any[] = []
    if (modalInfo?.type === 3) {
      const projectConfig = modalInfo?.configs?.filter(
        (ele: { type: number }) => ele.type === 4,
      )[0]?.content
      projectConfig?.forEach((item: { stories: any }) => {
        if (item.stories) {
          tempArr.push([...item.stories])
        }
      })
    } else {
      const value = form.getFieldsValue()
      Object.keys(value).forEach((key: string) => {
        if (key?.split('+')?.[0] === '4') {
          tempArr = tempArr.concat(value[key])
        }
      })
      tempArr = tempArr.map((k: any) =>
        demandListAll?.find?.((t: any) => k === t.id),
      )
    }
    tempArr = tempArr.flat()
    let total = 0
    let done = 0
    if (tempArr.length) {
      total = Number(tempArr.length)
      done = Number(tempArr.filter((k: any) => k?.is_end === 1).length)
    } else {
      total = 0
      done = 0
    }

    const totalHour = tempArr.reduce(
      (pre, next) =>
        (type === 'user' ? next?.user_today_task_time : next?.today_task_time) +
        pre,
      0,
    )
    const totalSchedule = tempArr.reduce(
      (pre, next) =>
        (type === 'user'
          ? next?.user_schedule_percent
          : next?.schedule_percent) + pre,
      0,
    )
    return {
      rate: total > 0 ? Number((totalSchedule / total).toFixed(2)) : 0,
      done: done,
      total: total,
      totalHour,
    }
  }

  // 自定义校富文本框
  const onValidator = (rule: any, value: any) => {
    if (
      (value === '<p><br></p>' ||
        value === '<p></p>' ||
        value?.trim() === '' ||
        !value) &&
      rule?.required
    ) {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }
    return Promise.resolve()
  }

  // 获取人员集合
  const getList = async () => {
    const result = await getStaffListAll({ all: 1 })
    setOptions(
      result.map((i: any) => ({
        id: i?.id,
        label: i?.name,
      })),
    )
  }

  // 修改汇报 初始化
  useEffect(() => {
    if (props.visible) {
      getList()
    } else {
      setTasksConfig({})
    }
  }, [props.visible])

  const checkUploadStatus = (name: string, success: boolean) => {
    setUploadAttachListStatus({
      [name]: success,
    })
  }

  // (单人日报)根据数据type生成对应的日报模板
  const generatorHtmlByDataForUser = (content: any): React.ReactElement => {
    switch (content.type) {
      case 1:
        return (
          <Form.Item
            label={<LabelTitles>{content.name_text}</LabelTitles>}
            name={`${content.type}+${content.id}+${content.name}`}
          >
            <ChoosePeople initValue={peopleValue} />
          </Form.Item>
        )
      case 2:
        return (
          <Form.Item
            label={
              <div>
                <LabelTitles>{content.name_text}</LabelTitles>
                {content.name === 'picture' && (
                  <TitleTips>
                    {t('theSizeOfThePictureShouldNotExceed')}
                  </TitleTips>
                )}
                {content.name === 'video' && (
                  <TitleTips>{t('theSizeOfTheVideoShouldNotExceed')}</TitleTips>
                )}
              </div>
            }
            name={`${content.type}+${content.id}+${content.name}`}
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
              MaxSize={300}
              power
              special={
                content.name === 'picture'
                  ? ['png', 'jpg', 'jpeg', 'gif']
                  : content.name === 'video'
                  ? ['avi', 'wmv', 'mp4']
                  : []
              }
              defaultList={
                uploadAttachList[
                  `${content.type}+${content.id}+${content.name}`
                ]
              }
              onChangeAttachment={(res: any) => {
                onChangeAttachment(
                  res,
                  `${content.type}+${content.id}+${content.name}`,
                )
              }}
              checkUploadStatus={(success: boolean) =>
                checkUploadStatus(
                  `${content.type}+${content.id}+${content.name}`,
                  success,
                )
              }
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
        return content.name === 'perception' ? (
          <Form.Item
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitles>{content.name_text}</LabelTitles>}
            name={`${content.type}+${content.id}+${content.name}`}
            initialValue={content?.content}
            rules={[
              {
                validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
                required: content.is_required === 1,
                message: (
                  <div
                    style={{
                      margin: '5px 0',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {t('p2.only1')}
                  </div>
                ),
                whitespace: true,
                validator: onValidator,
              },
            ]}
          >
            <Editor
              color="transparent"
              upload={uploadFile}
              getSuggestions={() => options}
              placeholder={content.tips}
              height="240px"
            />
          </Form.Item>
        ) : (
          <Form.Item
            label={
              <LabelTitles>
                {content.name_text}：{getScheduleData().rate}%
                <span style={{ marginLeft: 16 }}>
                  {t('spent')}：{getScheduleData().totalHour}h
                </span>
              </LabelTitles>
            }
            name={`${content.type}+${content.id}+${content.name}`}
            initialValue={JSON.parse(content?.content ?? null)?.yesterday_add}
          >
            {/* <div className="rateText">
              {t('report.list.addedYesterday')}：
              {JSON.parse(content?.content ?? null)?.yesterday_add}
              {t('report.list.pieces')}
            </div> */}
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
              <LabelTitles>
                {content.name_text}：
                {tasksConfig?.[`${content.type}+${content.id}+${content.name}`]
                  ?.length ?? 0}{' '}
                {t('report.list.pieces')}
              </LabelTitles>
            }
            name={`${content.type}+${content.id}+${content.name}`}
          >
            <NewRelatedNeed
              onSearchWord={(value: string) =>
                getDemandDataList(currentProject?.id, value)
              }
              addItem={(arr: any) => {
                setDemandListAll([...arr, ...demandListAll])
                setTasksConfig({
                  ...tasksConfig,
                  [`${content.type}+${content.id}+${content.name}`]: arr,
                })
              }}
              canSubmit={(arr: any) => {
                let tempArray: any = []
                Object.keys(tasksConfig).forEach((key: string) => {
                  if (key?.split('+')?.[0] === '4') {
                    tempArray = tempArray.concat(tasksConfig[key])
                  }
                })

                const isCan = !arr?.some((i: any) => {
                  return tempArray?.map((o: any) => o?.id)?.includes(i?.value)
                })
                if (!isCan) {
                  if (content.name === 'overdue_tasks') {
                    getMessage({
                      msg: t(
                        'thereAreDuplicateTasksInPleaseCancelTheDuplicateAssociation2',
                      ),
                      type: 'warning',
                    })
                  } else {
                    getMessage({
                      msg: t(
                        'thereAreDuplicateTasksInPleaseCancelTheDuplicateAssociation',
                      ),
                      type: 'warning',
                    })
                  }
                }
                return isCan
              }}
              initValue={content?.content}
              data={demandList}
              // 是否显示逾期
              isShowOverdue={content?.name === 'overdue_tasks'}
            />
          </Form.Item>
        )
      default:
        return <div></div>
    }
  }

  // (项目日报)根据数据type生成对应的日报模板
  const generatorHtmlByDataForProject = (content: any): React.ReactElement => {
    switch (content.type) {
      case 1:
        return (
          <Form.Item
            label={<LabelTitles>{content.name_text}</LabelTitles>}
            name={`${content.type}+${content.id}+${content.name}`}
          >
            <ChoosePeople initValue={peopleValue} />
          </Form.Item>
        )
      case 2:
        return (
          <Form.Item
            label={
              <div>
                <LabelTitles>{content.name_text}</LabelTitles>
                {content.name === 'picture' && (
                  <TitleTips>
                    {t('theSizeOfThePictureShouldNotExceed')}
                  </TitleTips>
                )}
                {content.name === 'video' && (
                  <TitleTips>{t('theSizeOfTheVideoShouldNotExceed')}</TitleTips>
                )}
              </div>
            }
            name={`${content.type}+${content.id}+${content.name}`}
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
              MaxSize={300}
              special={
                content.name === 'picture'
                  ? ['png', 'jpg', 'jpeg', 'gif']
                  : content.name === 'video'
                  ? ['avi', 'wmv', 'mp4']
                  : []
              }
              defaultList={
                uploadAttachList[
                  `${content.type}+${content.id}+${content.name}`
                ]
              }
              onChangeAttachment={(res: any) => {
                onChangeAttachment(
                  res,
                  `${content.type}+${content.id}+${content.name}`,
                )
              }}
              checkUploadStatus={(success: boolean) =>
                checkUploadStatus(
                  `${content.type}+${content.id}+${content.name}`,
                  success,
                )
              }
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
        return content.name === 'description' ? (
          <Form.Item
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitles>{content.name_text}</LabelTitles>}
            name={`${content.type}+${content.id}+${content.name}`}
            rules={[
              {
                validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
                required: content.is_required === 1,
                message: (
                  <div
                    style={{
                      margin: '5px 0',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {t('p2.only1')}
                  </div>
                ),
                whitespace: true,
                validator: onValidator,
              },
            ]}
          >
            <Editor
              upload={uploadFile}
              getSuggestions={() => options}
              placeholder={content.tips}
              height="240px"
            />
          </Form.Item>
        ) : (
          <Form.Item
            label={
              <LabelTitles>
                {content.name_text}：{getScheduleData().rate}%
                <span style={{ marginLeft: 16 }}>
                  {t('spent')}：{getScheduleData().totalHour}h
                </span>
              </LabelTitles>
            }
            name={`${content.type}+${content.id}+${content.name}`}
            initialValue={JSON.parse(content?.content ?? null)?.yesterday_add}
          >
            {/* <div className="rateText">
              {t('report.list.addedYesterday')}：
              {JSON.parse(content?.content ?? null)?.yesterday_add}
              {t('report.list.pieces')}
            </div> */}
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
            label={<LabelTitles>{t('addProjectGroup')}</LabelTitles>}
            name={`${content.type}+${content.id}+${content.name}`}
            initialValue={content?.content}
          >
            <ProjectGroup
              projectId={currentProject?.id}
              template_id={currentProject?.project_report_template_id}
              data={content.content}
              onOk={() => {
                generatorDataByProject()
              }}
            ></ProjectGroup>
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
        title={type === 'user' ? t('singleDaily') : t('projectDaily')}
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
          <ContentWraps>
            <div className="head">
              {(type === 'user' &&
                currentProject?.is_setting_config === 1 &&
                currentProject?.enable_hand_send === 1) ||
              (type === 'project' &&
                currentProject?.is_setting_project_config === 1) ? (
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
                  label={<LabelTitles>{t('report.list.message3')}</LabelTitles>}
                >
                  <div className="project">
                    <CustomSelect
                      optionFilterProp="label"
                      showSearch
                      value={currentProject?.id}
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
                      {type === 'user'
                        ? generatorHtmlByDataForUser(item)
                        : generatorHtmlByDataForProject(item)}
                    </div>
                  ))}
              </Form>
            </div>
          </ContentWraps>
        </div>
      </CommonModal>
      <NoPermissionModal
        id={currentProject?.id}
        visible={havePermission}
        close={() => {
          setHavePermission(false)
        }}
        type={type}
      />
      <DeleteConfirmModal />
    </>
  )
}

export default ReportAssistantModal
