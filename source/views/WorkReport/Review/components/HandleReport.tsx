// 写日志
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-handler-names */
import { Form, message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import CommonModal from '@/components/CommonModal'
import ChoosePeople from '@/views/WorkReport/Formwork/ChoosePeople'
import RelatedNeed from '@/views/LogManagement/components//RelatedNeed'
import IconFont from '@/components/IconFont'
import { AddWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import UploadAttach from '@/components/UploadAttach'
import { useSelector } from '@store/index'
import { Editor } from '@xyfe/uikit'
import { getStaffListAll } from '@/services/staff'
import { uploadFile } from '@/components/CreateDemand/CreateDemandLeft'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  getReportDetailById,
  updateReport,
  writeReport,
} from '@/services/report'
import { templateDetail } from '@/services/formwork'

const LabelTitle = styled.span`
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 500;
  color: #323233;
  line-height: 22px;
`
const HeadWrap = styled.div<{ isCanImport: boolean }>`
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  .titleText {
    height: 24px;
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
  .importText {
    font-size: 12px;
    font-family: MiSans-Regular, MiSans;
    font-weight: 400;
    color: ${(props: any) => (props.isCanImport ? '#646566' : '#bbbdbf')};
    cursor: ${(props: any) => (props.isCanImport ? 'pointer' : 'not-allowed')};
  }
`

const HandleReport = (props: any) => {
  const [form] = Form.useForm()
  const [options, setOptions] = useState<any>([])
  const [editDetail, setEditDetail] = useState<any>(null)
  const leftDom: any = useRef<HTMLInputElement>(null)
  const [t] = useTranslation()
  const userInfo = useSelector(state => state.user.userInfo)
  const [reportDetail, setReportDetail] = useState<any>(null)

  const close = () => {
    form.resetFields()
    props.editClose()
  }

  // 写汇报| 修改汇报 | 补交汇报 提交操作
  const confirm = async () => {
    const params: any = await form.validateFields()
    let users: any[] = []
    const data: any[] = []
    Object.keys(params).forEach((key: string) => {
      const tempArr = key.split('_')
      if (tempArr[0] === '1') {
        users = params[key]
      } else if (tempArr[0] === '3') {
        data.push({
          conf_id: Number(tempArr[1]),
          content: params[key],
        })
      } else {
        data.push({
          conf_id: Number(tempArr[1]),
          content: params[key] || [],
        })
      }
    })

    // 修改汇报
    if (props?.editId) {
      const res = await updateReport({
        id: props?.editId,
        data,
        target_users: users,
      })
      console.log(res, 'res')
    }

    // 写汇报
    if (props?.templateId) {
      const res = await writeReport({
        report_template_id: props?.templateId,
        data,
        target_users: users,
      })
      if (res && res.code === 0 && res.data?.id) {
        message.success(t('操作成功'))
      }
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

  const onBottom = () => {
    const dom: any = leftDom?.current
    dom.scrollTop = dom.scrollHeight
  }
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
          // Todo 根据模板详情里的上一篇id 去查询
          const result = await getReportDetailById({
            id: reportDetail?.prev_report_id,
          })
          if (result && result.data) {
            const temp: any = {}
            result.data.report_content?.forEach((v: any) => {
              temp[`${v.type}_${v.id}`] =
                v.type === 3 ? v?.pivot?.content : v?.pivot?.params
            })
            form.setFieldsValue({
              ...temp,
              [`${result?.data?.type || 3}_${
                result?.data?.target_user_config_id
              }`]: result?.data?.target_users,
            })
          }
        },
      })
    }
  }
  // 通过id查询模板详情
  const getTemplateById = async (id: number) => {
    const res = await templateDetail({ id })
    if (res && res.code === 0 && res.data) {
      setReportDetail(res.data)
    }
  }
  // Todo 编辑回显值,补个user的值
  const setDefaultValue = async () => {
    const result = await getReportDetailById({ id: props?.editId })
    if (result.code === 0 && result.data) {
      setEditDetail(result.data)
      getTemplateById(result.data.report_template_id)
      const temp: any = {}
      result.data.report_content?.forEach((v: any) => {
        temp[`${v.type}_${v.id}`] =
          v.type === 3 ? v?.pivot?.content : v?.pivot?.params
      })
      form.setFieldsValue({
        ...temp,
      })
    }
  }
  const getList = async () => {
    const result = await getStaffListAll({ all: 1 })
    setOptions(
      result.map((i: any) => ({
        id: i.id,
        label: i.name,
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
  }, [props.templateId])

  const onValidator = (rule: any, value: any) => {
    if (value === '<p><br></p>' || value === '<p></p>' || value.trim() === '') {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }
    return Promise.resolve()
  }
  if (!props.visibleEdit) {
    return null
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
                required: content.is_required,
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
              },
            ]}
          >
            {props.visibleEdit ? (
              <ChoosePeople
                initValue={reportDetail?.report_user_list?.map((item: any) => {
                  return {
                    avatar: item.avatar,
                    id: item.id,
                    name: item.name,
                    nickname: '',
                    positionName: null,
                    roleName: '',
                  }
                })}
              />
            ) : null}
          </Form.Item>
        )
      case 2:
        return (
          <Form.Item
            label={<LabelTitle>{content.name}</LabelTitle>}
            name={`${content.type}_${content.id}`}
          >
            <UploadAttach
              power
              defaultList={[]}
              onChangeAttachment={(res: any) => {
                onChangeAttachment(res, `${content.type}_${content.id}`)
              }}
              onBottom={onBottom}
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
                required: true,
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
            initialValue={content.tips}
          >
            <Editor upload={uploadFile} getSuggestions={() => options} />
          </Form.Item>
        )
      case 4:
        return (
          <Form.Item
            label={<LabelTitle>{content.name}</LabelTitle>}
            name={`${content.type}_${content.id}`}
          >
            <RelatedNeed initValue={[]} />
          </Form.Item>
        )
      default:
        return <span />
    }
  }

  const getReportDateText = (date: any) => {
    return `（${date?.[0]}${date?.[0] && date?.[1] ? '至' : ''}${date?.[1]}）`
  }

  return (
    <CommonModal
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
        ref={leftDom}
      >
        <HeadWrap isCanImport={reportDetail?.prev_report_id}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {userInfo.avatar ? (
              <img
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                }}
                src={userInfo.avatar}
              />
            ) : (
              <span>
                <CommonUserAvatar size="large" />
              </span>
            )}
            <div className="titleText">
              {`${userInfo?.name}的${reportDetail?.name}`}
              <span className="dateText">
                {getReportDateText(reportDetail?.submitCycleDate)}
              </span>
            </div>
          </div>
          <div className="importText" onClick={importPreviousArticle}>
            <IconFont
              style={{ transform: 'rotate(180deg)', marginRight: 4 }}
              type="Import"
            />
            <span>{t('report.list.import')}</span>
          </div>
        </HeadWrap>
        <Form
          form={form}
          onFinish={confirm}
          layout="vertical"
          onFinishFailed={() => {
            setTimeout(() => {
              const errorList = (document as any).querySelectorAll(
                '.ant-form-item-has-error',
              )
              errorList[0].scrollIntoView({
                block: 'center',
                behavior: 'smooth',
              })
            }, 100)
          }}
        >
          {reportDetail?.template_content_configs?.map((item: any) => {
            return <div key={item.id}>{getFormItemHtml(item)}</div>
          })}
        </Form>
      </div>
    </CommonModal>
  )
}

export default HandleReport