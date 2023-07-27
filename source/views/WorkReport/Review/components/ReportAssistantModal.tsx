import CommonModal from '@/components/CommonModal'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import styled from '@emotion/styled'
import { Form, Spin } from 'antd'
import React, { useState } from 'react'
import { getMessage } from '@/components/Message'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import NoPermissionModal from './NoPermissionModal'
import ChoosePeople from './ChoosePeople'
import { useTranslation } from 'react-i18next'
import UploadAttach from '@/components/UploadAttach'
import { AddWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import CustomSelect from '@/components/CustomSelect'

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
      padding: 0px;
    }
    .project {
      display: flex;
      align-items: center;
      margin-top: 8px;
    }
    .rateText {
      font-size: 14px;
      font-family: SiYuanRegular;
      color: var(--neutral-n2);
      display: flex;
      align-items: center;
      margin-top: 8px;
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
const AgainButton = styled.span`
  width: 72px;
  height: 32px;
  text-align: center;
  font-size: 14px;
  border-radius: 6px 6px 6px 6px;
  font-family: SiYuanRegular;
  color: var(--primary-d1);
  line-height: 32px;
  white-space: nowrap;
  margin-left: 8px;
  cursor: pointer;
  &:hover {
    background: var(--hover-d2);
  }
  &:active {
    background: var(--auxiliary-b6);
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
  const [peopleValue, setPeopleValue] = useState<any>([])
  const [uploadAttachList, setUploadAttachList] = useState<any>({})
  const { close, visible } = props
  const confirm = () => {
    getMessage({
      type: 'success',
      msg: '已通知管理员开启该功能',
    })
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

  const generatorHtmlByData = (content: any): React.ReactElement => {
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
          <div>
            <LabelTitle>{content.name}：20%</LabelTitle>
            <div className="rateText">昨日新增：10个</div>
            <div className="rateText">
              <span>任务完成度：10/50</span>
              <span className="line" />
              <span>已完成 10个</span>
            </div>
          </div>
        )
      default:
        return <div></div>
    }
  }

  return (
    <>
      <CommonModal
        width={784}
        title="日报助手"
        isVisible={visible}
        onClose={close}
        onConfirm={confirm}
        confirmText="发送"
      >
        <div
          style={{
            height: 'calc(90vh - 136px)',
            overflow: 'scroll',
            padding: ' 0 24px',
          }}
        >
          <HandleSpin spinning={false} indicator={<NewLoadingTransition />} />
          <ContentWrap>
            <div className="head">
              <div className="tips">项目管理员已配置自动生成并发送规则</div>
              <div className="userBox">
                {false ? (
                  <img className="avatar" src="" />
                ) : (
                  <CommonUserAvatar size="large" />
                )}
                <div className="desc">
                  <div className="title">
                    李钟硕的工作日报
                    <span className="date">（2022-08-21）</span>
                  </div>
                  <div className="department">
                    IFUN Games - 研发部 - 前端开发
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <Form form={form} layout="vertical">
                <Form.Item
                  label={<LabelTitle>请选择项目</LabelTitle>}
                  name="project"
                >
                  <div className="project">
                    <CustomSelect /> <AgainButton>重新生成</AgainButton>
                  </div>
                </Form.Item>
                <div>{generatorHtmlByData({ type: 3, name: '总体进度' })}</div>
              </Form>
            </div>
          </ContentWrap>
        </div>
      </CommonModal>
      <NoPermissionModal
        visible={havePermission}
        close={() => {
          setHavePermission(false)
        }}
      />
    </>
  )
}

export default ReportAssistantModal
