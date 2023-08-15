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
import { useDispatch, useSelector } from '@store/index'
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
    const { id, url, title, config, name, type, viewType } = props
    const { projectInfo } = useSelector(store => store.project)
    const [needSave, setNeedSave] = useState(false)
    const [form] = Form.useForm()
    const [t] = useTranslation()
    const [fail, setFail] = useState(false)
    const [searchParams] = useSearchParams()
    const paramsData = getParamsData(searchParams)
    const projectId = paramsData?.id ?? projectInfo?.id
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
            id: projectId,
            isOpenScreenDetail: true,
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
            id: projectId,
            isOpenScreenDetail: true,
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
        config: { ...(config || {}), ...(props.otherConfig || {}) },
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
      try {
        let tempId: any = 0
        let tempUrl = ''
        if (id && needSave) {
          if (viewType === 2) {
            // 系统视图，走创建接口
            tempId = await getCopyLink()
          } else {
            // 更新视图
            await viewsUpdate(saveViewsParams)
          }

          if (viewType === 2 && tempId) {
            tempUrl = `${location.origin}${location.pathname}?data=${encryptPhp(
              JSON.stringify({
                ...paramsData,
                valueId: tempId,
                otherConfig: props.otherConfig,
                id: projectId,
                isOpenScreenDetail: true,
              }),
            )}`
          }
        }
        const result = await shareView({
          ...params,
          url: viewType === 2 && tempId ? tempUrl : params.url,
        })
        if (result && result.code === 0) {
          getMessage({
            msg: t('sprint.shareSuccess'),
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
        //
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
          //
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
        return Promise.reject(new Error(t('sprint.shareInputTip')))
      }
      setFail(false)
      return Promise.resolve()
    }

    // 点击获取链接
    const getCopyLink = async () => {
      const saveViewsParams = {
        use_type: type,
        name: viewType === 2 ? t('other.shareView') : name ?? '',
        config: { ...(config || {}), ...(props.otherConfig || {}) },
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
        title={t('share')}
        isVisible={visible}
        onClose={() => onClose(viewType, type)}
        onConfirm={onsubmit}
        confirmText={t('share')}
      >
        <ModalContentBox>
          {needSave ? <WarnTips>{t('sprint.noSaveView')}</WarnTips> : null}
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
                placeholder={t('sprint.shareErrorTip1')}
                fail={fail}
                changeFirstState={() => {
                  notFirst.current = true
                }}
                setFail={setFail}
              />
            </Form.Item>
            <Tips>{t('sprint.shareTip1')}</Tips>
            <Form.Item
              rules={[
                { required: true, message: t('sprint.pleaseInputMessage') },
              ]}
              label=""
              name="content"
            >
              <Input.TextArea
                placeholder={t('sprint.shareErrorTip2')}
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
              <span>{t('copy_Link')}</span>
            </CopyButton>
          ) : loading ? (
            <LoadingButton>
              <img
                width={16}
                src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/shareLoading.gif"
              />
              <span>{t('sprint.acquiring')}</span>
            </LoadingButton>
          ) : (
            <GetCopyButton onClick={getCopyLink}>
              <IconFont type="link" />
              {t('sprint.getLink')}
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
            <span>{t('copy_Link')}</span>
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
