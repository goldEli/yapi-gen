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
import { getReportDetailById, writeReport } from '@/services/report'
import { templateDetail } from '@/services/formwork'

const LabelTitle = styled.span`
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 500;
  color: #323233;
  line-height: 22px;
`
const HeadWrap = styled.div`
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
    color: #bbbdbf;
    cursor: pointer;
  }
`

const HandleReport = (props: any) => {
  const [form] = Form.useForm()
  const [attachList, setAttachList] = useState<any>([])
  const [options, setOptions] = useState<any>([])
  const leftDom: any = useRef<HTMLInputElement>(null)
  const [t] = useTranslation()
  const userInfo = useSelector(state => state.user.userInfo)
  const [reportDetail, setReportDetail] = useState<any>(null)
  const [EditDetail, setEditDetail] = useState<any>(null)

  const close = () => {
    form.resetFields()
    props.editClose()
    setAttachList([])
  }

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
    const res = await writeReport({
      report_template_id: props?.templateId,
      data,
      target_users: users,
    })
    if (res && res.code === 0 && res.data?.id) {
      message.success(t('操作成功'))
    }
    close()
  }

  const onChangeAttachment = (result: any, name: string) => {
    const arr = result.map((i: any) => {
      return {
        url: i.url,
        created_at: i.ctime,
        configurations: {
          name: i.name,
          ext: i.ext,
          size: i.size,
        },
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
          导入上一篇
        </span>
      ),
      content: (
        <span style={{ color: '#646566' }}>
          确认导入上一篇汇报内容，导入后将覆盖当前编辑内容
        </span>
      ),
      icon: <ExclamationCircleFilled />,
      okText: '确定',
      cancelText: '取消',
      centered: true,
      closable: true,
      onOk: () => {
        console.log(2222222)
      },
    })
  }

  const setDefaultValue = async () => {
    const result = await getReportDetailById({ id: props?.editId })
    if (result.code === 0 && result.data) {
      setEditDetail(result.data)
    }
    // setAttachList(
    //     res.data.files.map((item: any) => {
    //       return {
    //         url: item.associate,
    //         id: item.id,
    //         size: item.configurations.size,
    //         time: item.created_at,
    //         name: item.configurations.name,
    //         suffix: item.configurations.ext,
    //         username: res.data.info.user_name,
    //       }
    //     }),
    //   )
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

  const getTemplateById = async () => {
    const res = await templateDetail({ id: props?.templateId })
    if (res && res.code === 0 && res.data) {
      setReportDetail(res.data)
    }
  }

  useEffect(() => {
    if (props.editId && props.visibleEdit) {
      setDefaultValue()
    }
    getList()
  }, [props.editId, props.visibleEdit])

  useEffect(() => {
    getTemplateById()
    getList()
  }, [props.templateId])

  const scrollToBottom = () => {
    setTimeout(() => {
      leftDom.current.scrollTo({
        top: leftDom.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }
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
              defaultList={attachList}
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
            {props.visibleEdit ? (
              <RelatedNeed onBootom={scrollToBottom} initValue={[]} />
            ) : null}
          </Form.Item>
        )
      default:
        return <span />
    }
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
        <HeadWrap>
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
              {`${userInfo?.name}的工作${
                props.editId ? EditDetail?.name : reportDetail?.name
              }`}
              <span className="dateText">（2022-08-21至2022-08-27）</span>
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
          {props?.editId
            ? EditDetail?.report_content?.map((item: any) => {
                return <div key={item.id}>{getFormItemHtml(item)}</div>
              })
            : reportDetail?.template_content_configs?.map((item: any) => {
                return <div key={item.id}>{getFormItemHtml(item)}</div>
              })}
        </Form>
      </div>
    </CommonModal>
  )
}

export default HandleReport
