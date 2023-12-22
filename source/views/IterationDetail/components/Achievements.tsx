// 抽调查看成果弹窗及详情成果展示公共部分

/* eslint-disable complexity */
/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-unstable-nested-components */

import UploadAttach from '@/components/UploadAttach'
import { css } from '@emotion/css'
import { AddWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { getIsPermission } from '@/tools'
import { t } from 'i18next'
import NoData from '@/components/NoData'
import { useDispatch, useSelector } from '@store/index'
import { getAchieveInfo } from '@/services/iterate'
import { setAchieveInfo } from '@store/iterate'
import Editor, { EditorRef } from '@/components/ifunuikit/components/editor'
import { uploadFile } from '@/components/AddWorkItem/CreateWorkItemLeft'
import { Form } from 'antd'
import { getMessage } from '@/components/Message'

const Wrap = styled.div<{ isModal: any }>(
  {
    overflowY: 'auto',
  },
  ({ isModal }) => ({
    height: isModal ? '60vh' : 'calc(100vh - 282px)',
    padding: isModal ? '0 16px 0 24px' : '0 16px 0 0px',
  }),
)

const labelWrap = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`

const label = css`
  font-size: 16px;
  font-family: siyuanmedium;
  margin-bottom: 8px;
  margin-top: 24px;
`

interface Props {
  isEdit?: boolean
  isModal?: boolean
  onRef?: any
  projectId?: any
  id?: any
  // 是否只读（详情迭代成果页面）
  isReadonly: boolean
}

const Achievements = (props: Props) => {
  const [form] = Form.useForm()
  const attachRef = useRef<any>(null)
  const WrapDom = useRef<HTMLInputElement>(null)
  const [attachList, setAttachList] = useState<any>([])
  const [newAttachList, setNewAttachList] = useState<any>([])
  const [html, setHtml] = useState('')
  const { projectInfo } = useSelector(store => store.project)
  const { achieveInfo } = useSelector(store => store.iterate)
  const dispatch = useDispatch()

  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve',
  )

  const setValue = (obj: any) => {
    setHtml(obj.info)
    form.setFieldsValue({
      info: obj.info,
    })
    setAttachList(
      obj.attachList?.map((i: any) => ({
        url: i.attachment.path,
        id: i.id,
        size: i.attachment.size,
        time: i.created_at,
        name: i.attachment.name,
        suffix: i.attachment.ext,
        username: i.user_name ?? '--',
      })),
    )
  }

  const getInfo = async () => {
    const result = await getAchieveInfo({
      projectId: props.projectId,
      id: props.id,
    })
    setValue(result)
    dispatch(setAchieveInfo(result))
  }

  useEffect(() => {
    if (!props.isReadonly) {
      getInfo()
    }
  }, [props.isReadonly])

  useEffect(() => {
    if (props.isReadonly) {
      setValue(achieveInfo)
    }
  }, [achieveInfo])

  // 修改附件编辑或删除
  const onChangeAttachment = (result: any) => {
    const arr = result.map((i: any) => {
      return {
        url: i.url,
        name: i.name,
        size: i.size,
        ext: i.ext,
        ctime: i.ctime,
      }
    })

    setNewAttachList(arr)
  }

  const onBottom = () => {
    const dom: any = WrapDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  // 向父级提交附件及描述
  const onConfirm = () => {
    if (attachRef.current?.getAttachState() > 0) {
      getMessage({
        type: 'warning',
        msg: t('theFileIsBeingPleaseWait'),
      })
      return
    }
    const params = {
      attachList: newAttachList,
      ...form.getFieldsValue(),
    }
    return params
  }

  // 清除附件及描述
  const onReset = () => {
    setHtml('')
    setAttachList([])
    setNewAttachList([])
  }

  useImperativeHandle(props.onRef, () => {
    return {
      confirm: onConfirm,
      reset: onReset,
    }
  })

  return (
    <Wrap ref={WrapDom} isModal={props?.isModal}>
      {props.isEdit ? (
        <div className={labelWrap}>
          <span className={label}>{t('p2.m1') as string}</span>
          <Form form={form}>
            <Form.Item name="info">
              <Editor
                upload={uploadFile}
                getSuggestions={() => {
                  return new Promise(resolve => {
                    setTimeout(() => {
                      resolve([])
                      // resolve(options)
                    }, 1000)
                  })
                }}
              />
            </Form.Item>
          </Form>
        </div>
      ) : html ? (
        <Editor
          value={html || '--'}
          getSuggestions={() => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve([])
                // resolve(options)
              }, 1000)
            })
          }}
          readonly
        />
      ) : null}
      {(attachList?.length || props.isEdit) && (
        <div className={labelWrap}>
          <span className={label}>{t('common.attachment') as string}</span>
          <UploadAttach
            ref={attachRef}
            power
            defaultList={attachList}
            onChangeAttachment={onChangeAttachment}
            onBottom={onBottom}
            isIteration
            isCanUpdate={!isCanEdit && props.isEdit}
            addWrap={
              !isCanEdit && props.isEdit ? (
                <AddWrap
                  hasColor
                  style={{
                    marginBottom: '20px',
                    height: 32,
                  }}
                >
                  <IconFont type="plus" />
                  <div>{t('p2.addAdjunct') as string}</div>
                </AddWrap>
              ) : (
                (null as any)
              )
            }
          />
        </div>
      )}
      {attachList?.length || html || props.isEdit ? null : (
        <div
          style={{
            width: '100%',
            minHeight: 400,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <NoData />
        </div>
      )}
    </Wrap>
  )
}

export default Achievements
