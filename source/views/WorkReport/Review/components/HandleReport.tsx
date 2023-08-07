/**
 * 写汇报
 */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-handler-names */
import { Form, Modal, Spin } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'
import { AddWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import UploadAttach from '@/components/UploadAttach'
import { useSelector, useDispatch } from '@store/index'
import { Editor } from '@xyfe/uikit'
import { getStaffListAll } from '@/services/staff'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  getReportDetailById,
  supplyReport,
  updateReport,
  writeReport,
} from '@/services/report'
import { templateDetail } from '@/services/formwork'
import { setUpdateList } from '@store/workReport'
import { getMessage } from '@/components/Message'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import ChoosePeople from './ChoosePeople'
import RelatedNeed from './RelatedNeed'
import moment from 'moment'
import { uploadFile } from '@/components/AddWorkItem/CreateWorkItemLeft'

const LabelTitle = styled.span`
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  line-height: 22px;
`
const HandleWrap = styled.div`
  font-family: inherit;
`

const HandleSpin = styled(Spin)`
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
  }
`
const HeadWrap = styled.div<{ isCanImport: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  .titleText {
    font-size: 16px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: #323233;
    line-height: 24px;
    margin-left: 12px;
    .dateText {
      font-size: 12px;
    }
  }
  .reportTitleWrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .submitTimeText {
    font-size: 12px;
    font-family: SiYuanRegular;
    font-weight: 400;
    color: #969799;
    margin-left: 12px;
  }
  .importText {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-family: SiYuanRegular;
    font-weight: 400;
    color: ${(props: any) => (props.isCanImport ? '#646566' : '#bbbdbf')};
    cursor: ${(props: any) => (props.isCanImport ? 'pointer' : 'not-allowed')};
    .notCopy {
      user-select: none;
      white-space: nowrap;
    }
    &:hover {
      color: ${(props: any) => (props.isCanImport ? 'var(--primary-d2)' : '')};
    }
  }
`

const HandleReport = (props: any) => {
  const [form] = Form.useForm()
  const [options, setOptions] = useState<any>([])
  const wrapRef = useRef<HTMLInputElement>(null)
  const [t]: any = useTranslation()
  const userInfo = useSelector(state => state.user.userInfo)
  const [reportDetail, setReportDetail] = useState<any>(null)
  const [detail, setDetail] = useState<any>(null)
  const isFirstValidator = useRef(0)
  const [peopleValue, setPeopleValue] = useState<any>([])
  const [relatedNeedList, setRelatedNeedList] = useState<any>([])
  const [uploadAttachList, setUploadAttachList] = useState<any>({})
  const dispatch = useDispatch()

  // 关闭弹窗时重置
  const close = () => {
    form.resetFields()
    props.editClose()
    isFirstValidator.current = 0
    setPeopleValue([])
    setRelatedNeedList([])
    setUploadAttachList({})
    setReportDetail(null)
    setDetail(null)
  }

  // 写汇报| 修改汇报 | 补交汇报 的提交操作
  const confirm = async () => {
    isFirstValidator.current += 1
    const params = await form.validateFields().catch(() => {
      setTimeout(() => {
        const errorList = (wrapRef.current as any).querySelectorAll(
          '.ant-form-item-has-error',
        )
        errorList[0].scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        })
      }, 100)
    })
    let users: any[] = []
    const data: any[] = []
    Object.keys(params).forEach((key: string) => {
      const tempArr = key.split('_')
      if (tempArr[0] === '1') {
        users = params[key]
      } else if (tempArr[0] === '3') {
        data.push({
          conf_id: Number(tempArr[1]),
          content: params[key] || '',
        })
      } else {
        data.push({
          conf_id: Number(tempArr[1]),
          content: params[key] || [],
        })
      }
    })

    let res = null
    // 修改汇报
    if (props?.editId) {
      res = await updateReport({
        id: props?.editId,
        data,
        target_users: users,
      })
    }

    // 写汇报 | 补交汇报
    if (props?.templateId) {
      if (props?.isSupply) {
        res = await supplyReport({
          report_template_id: props?.templateId,
          data,
          target_users: users,
          date: {
            start_time: props?.date?.[0],
            end_time: props?.date?.[1],
          },
        })
      } else {
        res = await writeReport({
          report_template_id: props?.templateId,
          data,
          target_users: users,
        })
      }
    }
    if (res && res.code === 0) {
      getMessage({
        msg: t('report.list.reportSubmittedSuccessfully'),
        type: 'success',
      })
      // 更新List页面
      dispatch(setUpdateList({ isFresh: 1 }))
    }
    close()
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

  // 导入上一篇
  const importPreviousArticle = () => {
    if (reportDetail.prev_report_id) {
      Modal.confirm({
        width: 450,
        title: (
          <span
            style={{
              fontSize: 16,
              fontFamily: 'SiYuanMedium',
              fontWeight: 500,
              color: '#323233',
            }}
          >
            {t('report.list.import')}
          </span>
        ),
        content: (
          <span style={{ color: '#646566' }}>{t('report.list.confirm')}</span>
        ),
        icon: <ExclamationCircleFilled />,
        okText: t('report.list.ok'),
        cancelText: t('report.list.cancel'),
        centered: true,
        closable: true,
        onOk: async () => {
          try {
            setUploadAttachList({})
            const result = await getReportDetailById({
              id: reportDetail?.prev_report_id,
            })
            if (result && result.data) {
              const temp: any = {}
              const attach: any = {}
              setPeopleValue(
                result.data?.target_users?.map((item: any) => {
                  return {
                    avatar: item.user?.avatar,
                    id: item.user?.id,
                    name: item.user?.name,
                    noDel: reportDetail?.report_user_list?.some(
                      (i: any) => i.id === item.user?.id,
                    ),
                  }
                }),
              )

              result.data.report_content?.forEach((v: any) => {
                temp[`${v.type}_${v.id}`] =
                  v.type === 3 ? v?.pivot?.content : v?.pivot?.params
                if (v.type === 2) {
                  attach[`${v.type}_${v.id}`] = v?.pivot?.params
                }
              })
              setUploadAttachList({ ...attach })
              form.setFieldsValue({
                ...temp,
                [`1_${result.data.target_user_config_id}`]:
                  result.data.target_users?.map((u: any) => ({
                    id: u.user?.id,
                    label: u.user?.name,
                  })),
              })
              setRelatedNeedList(
                result.data?.report_content?.filter((k: any) => k.type === 4),
              )
              getMessage({ msg: t('report.list.success'), type: 'success' })
            } else {
              getMessage({
                msg: result?.data?.message || t('report.list.fail'),
                type: 'error',
              })
            }
          } catch (error) {
            getMessage({ msg: t('report.list.fail'), type: 'error' })
          }
        },
      })
    }
  }
  // 通过id查询模板详情
  const getTemplateById = async (id: number) => {
    setReportDetail(null)
    const res = await templateDetail({ id })
    if (res && res.code === 0 && res.data) {
      setReportDetail(res.data)
      // 不是修改态 才需要用模板里面的user
      if (!props?.editId) {
        setPeopleValue(
          res.data?.report_user_list?.map((item: any) => {
            return {
              avatar: item?.avatar,
              id: item.id || item.user_id,
              name: item?.name,
              noDel: true,
            }
          }),
        )
      }
    }
  }

  // 修改态回显
  const setDefaultValue = async () => {
    setDetail(null)
    const result = await getReportDetailById({ id: props?.editId })
    if (result.code === 0 && result.data) {
      setDetail(result.data)
      setPeopleValue(
        result.data?.target_users?.map((item: any) => {
          return {
            avatar: item.user?.avatar,
            id: item.user?.id,
            name: item.user?.name,
            noDel: reportDetail?.report_user_list?.some(
              (i: any) => i.id === item.user?.id,
            ),
          }
        }),
      )
      setRelatedNeedList(
        result.data?.report_content?.filter((k: any) => k.type === 4),
      )
      getTemplateById(result.data.report_template_id)
      const temp: any = {}
      const attach: any = {}
      result.data.report_content?.forEach((v: any) => {
        if (v.type !== 4) {
          temp[`${v.type}_${v.id}`] =
            v.type === 3 ? v?.pivot?.content : v?.pivot?.params
        }
        if (v.type === 2) {
          attach[`${v.type}_${v.id}`] = v?.pivot?.params
        }
      })
      setUploadAttachList({ ...attach })
      form.setFieldsValue({
        ...temp,
      })
    }
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
    if (props.editId && props.visibleEdit) {
      setDefaultValue()
      getList()
    }
  }, [props.editId, props.visibleEdit])

  // 写汇报 初始化
  useEffect(() => {
    if (props?.templateId) {
      getTemplateById(props?.templateId)
      getList()
    }
  }, [props.templateId, props.visibleEdit])

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

  // 自定义校验 汇报对象 || 关联需求
  const onValidatorForPerson = (rule: any, value: any) => {
    if (
      value?.length === 0 &&
      isFirstValidator.current !== 0 &&
      rule?.required
    ) {
      return Promise.reject(new Error(''))
    }
    return Promise.resolve()
  }

  // 根据模板类型生成对应的item
  const getFormItemHtml = (content: any): React.ReactElement => {
    switch (content.type) {
      case 1:
        return (
          <Form.Item
            label={<LabelTitle>{content.name}</LabelTitle>}
            name={`${content.type}_${content.id}`}
            rules={[
              {
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
                    {t('common.pleaseSelect')}
                  </div>
                ),
                validator: onValidatorForPerson,
              },
            ]}
          >
            <ChoosePeople initValue={peopleValue} />
          </Form.Item>
        )
      case 2:
        return (
          <Form.Item
            label={<LabelTitle>{content.name}</LabelTitle>}
            name={`${content.type}_${content.id}`}
            rules={[
              {
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
                    {t('report.list.upload')}
                  </div>
                ),
              },
            ]}
          >
            <UploadAttach
              power
              defaultList={uploadAttachList[`${content.type}_${content.id}`]}
              onChangeAttachment={(res: any) => {
                onChangeAttachment(res, `${content.type}_${content.id}`)
              }}
              addWrap={
                <AddWrap
                  style={{
                    marginBottom: '20px',
                  }}
                  hasColor
                >
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
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitle>{content.name}</LabelTitle>}
            name={`${content.type}_${content.id}`}
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
            />
          </Form.Item>
        )
      case 4:
        return (
          <Form.Item
            label={<LabelTitle>{content.name}</LabelTitle>}
            name={`${content.type}_${content.id}`}
            key={content.id}
            rules={[
              {
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
                    {t('report.list.add')}
                  </div>
                ),
                validator: onValidatorForPerson,
              },
            ]}
          >
            <RelatedNeed
              initValue={
                relatedNeedList?.length
                  ? relatedNeedList
                      .filter((items: any) => content.id === items.id)
                      .map((s: any) => s.pivot.params)
                      .flat()
                      .map((item: any) => ({
                        label: item.name,
                        value: item.id,
                        key: item.id,
                        story_prefix_key: item.story_prefix_key,
                      }))
                  : []
              }
            />
          </Form.Item>
        )
      default:
        return <span />
    }
  }

  // 拼接模板填写时间
  const getReportDateText = (date: any) => {
    return date && date?.some((k: any) => k)
      ? `（${date?.[0]} ${date?.[0] && date?.[1] ? t('report.list.to') : ''} ${
          date?.[1]
        }）`
      : ''
  }

  return (
    <HandleWrap>
      <CommonModal
        hasFooter={!reportDetail}
        width={784}
        title={props.visibleEditText}
        isVisible={props.visibleEdit}
        onClose={close}
        onConfirm={confirm}
        confirmText={t('report.list.submit')}
      >
        <div
          style={{
            height: 'calc(90vh - 136px)',
            overflow: 'scroll',
            padding: ' 0 24px',
          }}
          ref={wrapRef}
        >
          {!reportDetail && (
            <HandleSpin
              spinning={!reportDetail}
              indicator={<NewLoadingTransition />}
            />
          )}
          {reportDetail ? (
            <>
              <HeadWrap isCanImport={reportDetail?.prev_report_id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {userInfo?.avatar ? (
                    <img
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                      }}
                      src={userInfo?.avatar}
                    />
                  ) : (
                    <span>
                      <CommonUserAvatar size="large" />
                    </span>
                  )}

                  <div className="reportTitleWrap">
                    <div className="titleText">
                      {`${userInfo?.name}的${reportDetail?.name ?? ''}`}
                      <span className="dateText">
                        {reportDetail?.submit_cycle === 4
                          ? null
                          : props.isSupply
                          ? getReportDateText(props.date)
                          : props?.editId
                          ? `（${moment(detail?.start_time).format(
                              'YYYY-MM-DD',
                            )} ${t('report.list.to')} ${moment(
                              detail?.end_time,
                            ).format('YYYY-MM-DD')}）`
                          : reportDetail?.submitCycleDate.filter(
                              (v: string) => v,
                            ).length > 0 &&
                            getReportDateText(reportDetail?.submitCycleDate)}
                      </span>
                    </div>
                    <div className="submitTimeText">
                      {reportDetail?.used_created_at
                        ? `${t('report.list.prevDateSubmit')}：${
                            reportDetail?.used_created_at
                          }`
                        : null}
                    </div>
                  </div>
                </div>
                <div className="importText" onClick={importPreviousArticle}>
                  <IconFont
                    style={{
                      transform: 'rotate(180deg)',
                      marginRight: 4,
                      fontSize: 16,
                    }}
                    type="Import"
                  />
                  <span className="notCopy">{t('report.list.import')}</span>
                </div>
              </HeadWrap>
              <Form form={form} layout="vertical">
                {reportDetail?.template_content_configs?.map((item: any) => {
                  return <div key={item.id}>{getFormItemHtml(item)}</div>
                })}
              </Form>
            </>
          ) : null}
        </div>
      </CommonModal>
    </HandleWrap>
  )
}

export default HandleReport
