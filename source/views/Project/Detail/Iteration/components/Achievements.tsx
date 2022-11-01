// 抽调查看成果弹窗及详情成果展示公共部分

/* eslint-disable complexity */
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

const Wrap = styled.div<{ isModal: any }>(
  {
    minHeight: 400,
    overflowY: 'auto',
    paddingRight: 16,
  },
  ({ isModal }) => ({
    maxHeight: isModal ? 680 : '100%',
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

const EditorBox = styled.div({
  margin: '8px 0 24px 0',
  p: {
    marginBottom: '0px!important',
  },
})

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
  const { uploadStatus, percentShow, percentVal } = useModel('demand')
  const [attachList, setAttachList] = useState<any>([])
  const [isShow, setIsShow] = useState(false)
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
        path: i.attachment.path,
        id: i.id,
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
  const onChangeAttachment = (result: any, type: string) => {
    if (type === 'add') {
      result.path = result.url
      setAttachList([...attachList, ...[result]])
    } else {
      const arr = attachList
      const comResult = arr.filter((i: any) => i.id !== result.uid)
      setAttachList(comResult)
    }
  }

  const onBottom = () => {
    const dom: any = WrapDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  // 向父级提交附件及描述
  const onConfirm = () => {
    const params = {
      attachList,
      info: html,
    }
    return params
  }

  // 清除附件及描述
  const onReset = () => {
    setHtml('')
    setAttachList([])
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
          <span className={label}>描述</span>
          <Editor value={html} onChangeValue={setHtml} height={280} />
        </div>
      ) : (
        <EditorBox
          dangerouslySetInnerHTML={{
            __html: html || '--',
          }}
        />
      )}
      <div className={labelWrap}>
        <span className={label}>附件</span>
        <UploadAttach
          child={
            isShow ? (
              <Children
                uploadStatus={uploadStatus}
                percentShow={percentShow}
                percentVal={percentVal}
              />
            ) : null
          }
          onChangeShow={setIsShow}
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
                }}
              >
                <IconFont type="plus" />
                <div>添加附件</div>
              </AddWrap>
            ) : (
              (null as any)
            )
          }
        />
      </div>
    </Wrap>
  )
}

export default Achievements
