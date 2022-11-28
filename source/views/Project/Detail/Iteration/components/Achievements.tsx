/* eslint-disable complexity */
// 抽调查看成果弹窗及详情成果展示公共部分

/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-unstable-nested-components */

import Editor from '@/components/Editor'
import UploadAttach from '../../Demand/components/UploadAttach'
import { css } from '@emotion/css'
import { AddWrap, ProgressWrapUpload } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useModel } from '@/models'
import styled from '@emotion/styled'
import { getIsPermission } from '@/tools'
import { t } from 'i18next'
import NoData from '@/components/NoData'
import EditorInfoReview from '@/components/EditorInfoReview'

const Wrap = styled.div<{ isModal: any }>(
  {
    overflowY: 'auto',
    paddingRight: 16,
  },
  ({ isModal }) => ({
    height: isModal ? '60vh' : 'calc(100% - 40px)',
  }),
)

const labelWrap = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`

const label = css`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
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

interface ChildrenProps {
  percentShow: any
  percentVal: any
  uploadStatus: any
}

const Children = (props: ChildrenProps) => {
  return (
    <ProgressWrapUpload
      status={props.uploadStatus}
      percent={props.percentVal}
      size="small"
      style={{ display: props.percentShow ? 'block' : 'none' }}
    />
  )
}

const Achievements = (props: Props) => {
  const WrapDom = useRef<HTMLInputElement>(null)
  const [attachList, setAttachList] = useState<any>([])
  const [newAttachList, setNewAttachList] = useState<any>([])
  const [html, setHtml] = useState('')
  const { getAchieveInfo, achieveInfo } = useModel('iterate')
  const { projectInfo } = useModel('project')

  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/achieve',
  )

  const setValue = (obj: any) => {
    setHtml(obj.info)

    setAttachList(
      obj.attachList?.map((i: any) => ({
        url: i.attachment.path,
        id: i.id,
        size: i.attachment.size,
        time: i.created_at,
        name: i.attachment.name,
        suffix: i.attachment.ext,
        username: i.user_name ?? '--',
      })) || [],
    )
  }

  const getInfo = async () => {
    const result = await getAchieveInfo({
      projectId: props.projectId,
      id: props.id,
    })

    setValue(result)
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
    const params = {
      attachList: newAttachList,
      info: html,
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
          <Editor
            value={html}
            onChangeValue={setHtml}
            height={280}
            placeholder={t('p2.pleaseEditText')}
          />
        </div>
      ) : html ? (
        <EditorInfoReview info={html || '--'} />
      ) : null}
      {(attachList?.length || props.isEdit) && (
        <div className={labelWrap}>
          <span className={label}>{t('common.attachment') as string}</span>
          <UploadAttach
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
