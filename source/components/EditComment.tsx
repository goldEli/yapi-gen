/* eslint-disable camelcase */
//  评论的弹框
/* eslint-disable no-cond-assign */
import { uploadFileByTask } from '@/services/cos'
import { onPaste } from '@/tools'
import { LabelTitle } from '@/views/Information/components/WhiteDay'
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import { ChoosePerson } from '@/views/Project/Detail/Setting/DemandSet/Workflow/components/ExamineItem'
import styled from '@emotion/styled'
import { Form, Popover, Upload } from 'antd'
import { t } from 'i18next'
import React, { useState } from 'react'
import CommonModal from './CommonModal'
import IconFont from './IconFont'
import { AddWrap } from './StyleCommon'

const Wrap = styled.div<{ pl: string }>`
  padding: 12px;
  padding-top: 0px;
  width: 100%;
  min-height: 240px;
  opacity: 1;
  border: 1px solid #ecedef;
  border-top: none;
  img {
    width: 100%;
  }
  &:focus {
    outline: none;
    content: none;
  }
  &:empty:before {
    content: '${({ pl }) => pl}';

    color: gray;
  }
`
const arr = [
  {
    avatar: '',
    id: 17,
    name: 'dawenwen-ceshi ',
    nickname: '',
    positionName: null,
    roleName: '参与者',
  },
  {
    avatar: '',
    id: 18,
    name: 'dawenwen-ceshi ',
    nickname: '',
    positionName: null,
    roleName: '参与者',
  },
  {
    avatar: '',
    id: 19,
    name: 'dawenwen-ceshi ',
    nickname: '',
    positionName: null,
    roleName: '参与者',
  },
  {
    avatar: '',
    id: 20,
    name: 'dawenwen-ceshi ',
    nickname: '',
    positionName: null,
    roleName: '参与者',
  },
  {
    avatar: '',
    id: 21,
    name: 'dawenwen-ceshi ',
    nickname: '',
    positionName: null,
    roleName: '参与者',
  },
]
const EditComment = (props: any) => {
  const [form] = Form.useForm()
  const [isOpen, setIsOpen] = useState(false)
  const [plan, setPlan] = useState(false)
  const [focusNode, setFocusNode] = useState<any>(null)
  const [focusOffset, setFocusOffset] = useState<any>(null)

  // 复制事件
  const handlePaste = async (event: any) => {
    // 阻止默认图片的复制
    event.preventDefault()
    const result: any = await onPaste(event)
    const imgs = await uploadFileByTask(result.data, result.data.name, 'file')
    if (result.type === 'string') {
      // 粘贴文本
      document.execCommand('insertText', false, result.data)
    } else {
      // 替换图片src
      const sel = window.getSelection()
      if (sel && sel.rangeCount === 1 && sel.isCollapsed) {
        const range2 = sel.getRangeAt(0)
        const img = new Image()
        img.src = imgs.url

        range2.insertNode(img)
        range2.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range2)
      }
    }
  }

  const onSend = () => {
    const inner = document.getElementById('inner')
  }

  const onUpload = async ({ file }: { file: any }) => {
    const result: any = await uploadFileByTask(file, file.name, 'file')
    const img = new Image()
    img.src = result.url
    const inner = document.getElementById('inner')
    inner?.appendChild(img)
  }

  const onChangeAttachment = (result: any) => {
    const arrs = result.map((i: any) => {
      return {
        url: i.url,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        created_at: i.ctime,
        configurations: {
          name: i.name,
          ext: i.ext,
          size: i.size,
        },
      }
    })
    form.setFieldsValue({
      attachments: arrs,
    })
  }

  const onClose = () => {
    props.editClose()
  }

  const confirm = async () => {
    const inner = document.getElementById('inner')
    // console.log(inner?.innerHTML, '内容')
    // console.log(form.getFieldsValue())
  }
  const addAta = (value: any) => {
    const selection: any = window.getSelection()
    const range: any = window.getSelection()?.getRangeAt(0)
    range.setStart(focusNode, focusOffset - 1)
    range.setEnd(focusNode, focusOffset)
    range.deleteContents()

    const spanNode1 = document.createElement('span')
    const spanNode2 = document.createElement('span')
    spanNode1.style.color = '#2877FF'
    spanNode1.innerHTML = `@${value.roleName}`

    spanNode1.contentEditable = false as unknown as string

    spanNode1.setAttribute('data-userId', value.roleName)
    spanNode2.innerHTML = '&nbsp;'
    let frag = document.createDocumentFragment(),
      node,
      lastNode
    frag.appendChild(spanNode1)
    while ((node = spanNode2.firstChild)) {
      lastNode = frag.appendChild(node)
      range.insertNode(frag)
      selection.extend(lastNode, 1)
      selection.collapseToEnd()
    }
  }

  const onAddPerson = (value: any) => {
    setIsOpen(false)
    const inner = document.getElementById('inner')

    if (plan) {
      const spanNode1 = document.createElement('span')
      const spanNode2 = document.createElement('span')
      spanNode1.style.color = '#2877FF'
      spanNode1.innerHTML = `@${value.roleName}`
      spanNode1.contentEditable = false as unknown as string

      spanNode1.setAttribute('data-userId', value.roleName)
      spanNode2.innerHTML = '&nbsp;'
      inner?.appendChild(spanNode1)
      inner?.appendChild(spanNode2)
    } else {
      addAta(value)
    }
    setPlan(false)
  }

  function changeTalkContent(e: any) {
    if (e.nativeEvent.data === '@') {
      setIsOpen(true)
      const selection: any = window.getSelection()
      setFocusNode(selection.focusNode)
      setFocusOffset(selection.focusOffset)
    }
  }

  return (
    <CommonModal
      width={784}
      title={t('new_p1.a4')}
      isVisible={props.visibleEdit}
      onClose={onClose}
      onConfirm={confirm}
      confirmText={t('newlyAdd.submit')}
    >
      <div
        style={{
          height: 'calc(90vh - 136px)',
          overflow: 'scroll',
          paddingRight: '24px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #ecedef',
              borderBottom: 'none',
              padding: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <Upload fileList={[]} customRequest={onUpload}>
                <IconFont
                  style={{
                    cursor: 'pointer',
                  }}
                  type="image"
                />
              </Upload>

              <Popover
                key={isOpen.toString()}
                visible={isOpen}
                placement="bottomLeft"
                trigger="click"
                onVisibleChange={visible => setIsOpen(visible)}
                getTooltipContainer={node => node}
                content={
                  <ChoosePerson
                    onChangeValue={obj => onAddPerson(obj)}
                    options={arr}
                  />
                }
                getPopupContainer={node => node}
              >
                <IconFont
                  onClick={() => {
                    setPlan(true)
                  }}
                  style={{
                    cursor: 'pointer',
                  }}
                  type="mention"
                />
              </Popover>
            </div>
          </div>
          <Wrap
            id="inner"
            onPaste={handlePaste}
            onInput={changeTalkContent}
            contentEditable
            pl={t('new_p1.a5')}
          />
        </div>
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
          <Form.Item
            label={<LabelTitle title={t('common.attachment')} />}
            name="attachments"
          >
            <UploadAttach
              key={1}
              power
              canUpdate={false}
              onChangeAttachment={onChangeAttachment}
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
        </Form>
      </div>
    </CommonModal>
  )
}

export default EditComment
