/**
 * 另存为视图  编辑视图弹窗
 */

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'
import SearchInput from './SearchInput'
import {
  CopyButton,
  ModalContentBox,
  Tips,
  WarnTips,
  GetCopyButton,
  LoadingButton,
} from './styled'
import { shareView, checkUpdates } from '@/services/sprint'
import { viewsUpdate, createViewList } from '@/services/efficiency'
import { EMAIL_REGEXP } from '@/constants'
import { copyLink, getParamsData } from '@/tools'
import { getMessage } from '@/components/Message'
import { useSearchParams } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useDispatch } from '@store/index'
import { getStoryViewList } from '@store/kanBan/kanBan.thunk'

interface ShareModalProps {
  // 检查视图是否保存的 视图id
  id?: number
  // 修改后的视图的配置参数
  config?: object
  // 复制链接所需要的url
  url: string
  // 用于分享后展示的标题
  title: string
  // 用于分享的数据
  otherConfig?: any
  // 判断视图是否系统视图（2）还是其他视图 （1）
  viewType?: number
  // 名字 name
  name?: string
  // type:用途，1：需求列表，2：看板，3：报表
  type?: number
}

interface Options {
  onOk(): Promise<any>
}

const useShareModal = () => {
  const [visible, setVisible] = useState(false)
  const notFirst = useRef(false)
  const dispatch = useDispatch()
  const updateViewListForKanBan = async () => {
    await dispatch(getStoryViewList(null))
  }
  const onClose = (val1: any, val2: any) => {
    setVisible(false)
    notFirst.current = false
    // 分享系统视图需要更新下视图列表
    if (val1 === 2 && val2 === 2) {
      updateViewListForKanBan()
    }
  }

  const onOkRef = useRef<Options['onOk'] | null>(null)
  const open = (options: Options) => {
    onOkRef.current = options.onOk
    setVisible(true)
  }

  const ShareModal: React.FC<ShareModalProps> = props => {
    // debugger
    const { id, url, title, config, name, type, viewType } = props
    const [needSave, setNeedSave] = useState(false)
    const [form] = Form.useForm()
    const [t] = useTranslation()
    const [fail, setFail] = useState(false)
    const [searchParams] = useSearchParams()
    const paramsData = getParamsData(searchParams)
    const projectId = paramsData?.id
    const [copyId, setCopyId] = useState(0)
    const [loading, setLoading] = useState(false)

    const new_url = useMemo(() => {
      if (id && config) {
        const paramsData = getParamsData(searchParams)
        return `${location.origin}${location.pathname}?data=${encryptPhp(
          JSON.stringify({
            ...paramsData,
            valueId: id,
            otherConfig: props.otherConfig,
          }),
        )}`
      }
      return ''
    }, [id, config])

    const copyUrl = useMemo(() => {
      if (copyId && config && type) {
        const paramsData = getParamsData(searchParams)
        return `${location.origin}${location.pathname}?data=${encryptPhp(
          JSON.stringify({
            ...paramsData,
            valueId: copyId,
            otherConfig: props.otherConfig,
          }),
        )}`
      }
      return ''
    }, [copyId, config, type])

    useEffect(() => {
      if (!visible) {
        setCopyId(0)
      }
    }, [visible])

    // 确认分享
    const confirm = async () => {
      // return
      const saveViewsParams = {
        id: id ?? 0,
        name: name ?? '',
        config: config,
      }
      const data = await form.validateFields()
      // 判断是人员还是邮箱
      const params: API.Sprint.ShareView.Params = {
        title,
        url: id && config ? new_url : url,
        content: data.content,
      }
      if (data?.name?.id) {
        params.user_id = data.name.id
      } else {
        params.email = data.name
      }
      if (id && needSave) {
        let tempId: any = 0
        try {
          if (viewType === 2) {
            // 系统视图，走创建接口
            tempId = await getCopyLink()
          } else {
            // 更新视图
            await viewsUpdate(saveViewsParams)
          }
          let tempUrl = ''
          if (viewType === 2 && tempId) {
            tempUrl = `${location.origin}${location.pathname}?data=${encryptPhp(
              JSON.stringify({
                ...paramsData,
                valueId: tempId,
                otherConfig: props.otherConfig,
              }),
            )}`
          }
          const result = await shareView({
            ...params,
            url: viewType === 2 && tempId ? tempUrl : params.url,
          })
          if (result && result.code === 0) {
            getMessage({
              msg: '分享成功',
              type: 'success',
            })
            await onOkRef.current?.()
            onClose(viewType, type)
          } else {
            getMessage({
              msg: result?.msg,
              type: 'error',
            })
          }
        } catch (error) {
          // console.log(error)
        }
      }
    }

    const onsubmit = () => {
      form.submit()
    }
    const setIsNeedSave = async () => {
      if (id) {
        try {
          const res = await checkUpdates({
            id,
            config,
          })
          if (res && res.is_update === 1) {
            setNeedSave(true)
          } else {
            setNeedSave(false)
          }
        } catch (error) {
          // console.log(error)
        }
      }
    }
    useEffect(() => {
      if (id && config && visible) {
        setIsNeedSave()
      }
    }, [id, config])

    const onValidator = (rule: any, value: any) => {
      if (
        !(typeof value === 'string' && !!value && EMAIL_REGEXP.test(value)) &&
        !(typeof value === 'object' && !!value) &&
        notFirst.current
      ) {
        return Promise.reject(new Error('请输入正确的用户名或邮箱'))
      }
      setFail(false)
      return Promise.resolve()
    }

    // 点击获取链接
    const getCopyLink = async () => {
      const saveViewsParams = {
        use_type: 2,
        name: name ?? '',
        config: config,
        project_id: projectId,
      }
      setLoading(true)
      const res: any = await createViewList(saveViewsParams)
      if (res?.id) {
        setTimeout(() => {
          setCopyId(res?.id)
          setLoading(false)
        }, 500)
      } else {
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
      return res?.id
    }

    return (
      <CommonModal
        width={528}
        title="分享"
        isVisible={visible}
        onClose={() => onClose(viewType, type)}
        onConfirm={onsubmit}
        confirmText="分享"
      >
        <ModalContentBox>
          {needSave ? (
            <WarnTips>当前视图未保存，分享时将为您保存为“视图”</WarnTips>
          ) : null}
          <Form
            form={form}
            onFinish={confirm}
            layout="vertical"
            onFinishFailed={({ values }) => {
              if (!values.name) {
                setFail(true)
              }
            }}
            onValuesChange={(changedValues, allValues) => {
              const value = allValues.name
              if (
                changedValues.name &&
                ((typeof allValues === 'string' &&
                  !!value &&
                  EMAIL_REGEXP.test(value)) ||
                  (typeof value === 'object' && !!value))
              ) {
                setFail(false)
              } else if (
                notFirst.current &&
                !(
                  typeof value === 'string' &&
                  !!value &&
                  EMAIL_REGEXP.test(value)
                ) &&
                !(typeof value === 'object' && !!value)
              ) {
                setFail(true)
              }
            }}
          >
            <Form.Item
              style={{ marginBottom: '8px' }}
              rules={[
                {
                  required: true,
                  validator: onValidator,
                },
              ]}
              label=""
              name="name"
            >
              <SearchInput
                placeholder="请输入用户名或邮箱地址(必填)"
                fail={fail}
                changeFirstState={() => {
                  notFirst.current = true
                }}
                setFail={setFail}
              />
            </Form.Item>
            <Tips>接收人将会收到分享的站内消息</Tips>
            <Form.Item
              rules={[{ required: true, message: '请输入消息' }]}
              label=""
              name="content"
            >
              <Input.TextArea
                placeholder="添加消息(必填)"
                style={{ height: 148 }}
              />
            </Form.Item>
          </Form>
        </ModalContentBox>
        {viewType === 2 ? (
          copyId ? (
            <CopyButton
              onClick={() => {
                copyLink(
                  `${title}${copyUrl} `,
                  t('common.copySuccess'),
                  t('common.copyFail'),
                )
              }}
            >
              <IconFont type="link" />
              <span>复制链接</span>
            </CopyButton>
          ) : loading ? (
            <LoadingButton>
              <img width={16} src="/shareLoading.gif" />
              <span>获取中...</span>
            </LoadingButton>
          ) : (
            <GetCopyButton onClick={getCopyLink}>
              <IconFont type="link" />
              获取链接
            </GetCopyButton>
          )
        ) : (
          <CopyButton
            onClick={() => {
              copyLink(
                `${title}${id && config ? new_url : url} `,
                t('common.copySuccess'),
                t('common.copyFail'),
              )
            }}
          >
            <IconFont type="link" />
            <span>复制链接</span>
          </CopyButton>
        )}
      </CommonModal>
    )
  }

  return {
    ShareModal,
    open,
  }
}

export default useShareModal
