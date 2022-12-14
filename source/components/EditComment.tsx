/* eslint-disable consistent-return */
/* eslint-disable camelcase */
//  评论的弹框
/* eslint-disable no-cond-assign */
import { uploadFileByTask } from '@/services/cos'
import { getStaffList2 } from '@/services/staff'
import { onPaste } from '@/tools'
import { LabelTitle } from '@/views/Information/components/WhiteDay'
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import { ChoosePerson } from '@/views/Project/Detail/Setting/DemandSet/Workflow/components/ExamineItem'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, message, Popover, Upload } from 'antd'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
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
  border-radius: 0px 0px 8px 8px;
  img {
    width: 100px;
    /* height: 100px; */
    object-fit: contain;
    margin-right: 5px;
  }
  &:focus {
    outline: none;
    content: none;
  }
  &:empty:before {
    content: '${({ pl }) => pl}';

    color: #bbbdbf;
  }
`
const Hov = styled(IconFont)`
  & :focus {
    color: #2877ff;
  }
`
const GrepDiv = styled.div`
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  display: inline-block;
  border-radius: 6px 6px 6px 6px;
  &:hover {
    background: #f4f5f5;
  }
`
const EditComment = (props: any) => {
  const [form] = Form.useForm()
  const [isOpen, setIsOpen] = useState(false)
  const [plan, setPlan] = useState(false)
  const [focusNode, setFocusNode] = useState<any>(null)
  const [focusOffset, setFocusOffset] = useState<any>(null)
  const [arr, setArr] = useState<any>(null)

  // 复制事件
  const handlePaste = async (event: any) => {
    event.preventDefault()
    const result: any = await onPaste(event)
    // 阻止默认图片的复制

    if (result.type === 'string') {
      // 粘贴文本
      document.execCommand('insertText', false, result.data)
    } else {
      const imgs = await uploadFileByTask(result.data, result.data.name, 'file')
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

  const init = async () => {
    const companyList = await getStaffList2({ all: 1 })

    const filterCompanyList = companyList.map((item: any) => ({
      id: item.id,
      name: item.name,
      avatar: item.avatar,
      nickname: item.nickname,
      positionName: null,
      roleName: item.roleName,
    }))
    setArr(filterCompanyList)
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
        ctime: i.ctime,
        username: i.user_name,
        name: i.name,
        ext: i.ext,
        size: i.size,
      }
    })
    form.setFieldsValue({
      attachments: arrs,
    })
  }

  const onClose = () => {
    props.editClose()
  }

  const onBeforeUpload = (file: any) => {
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isLt2M) {
      message.warning({
        content: `${file.name} ${t('new_p1.a7')}`,
        duration: 2,
      })
      return Upload.LIST_IGNORE
    }
    const isPNG = file.type.includes('image')
    if (!isPNG) {
      message.warning({
        content: `${file.name} ${t('new_p1.a6')}`,
        duration: 2,
      })
    }
    return isPNG || Upload.LIST_IGNORE
  }
  const confirm = async () => {
    const inner = document.getElementById('inner')
    if (!String(inner?.innerHTML).trim()) {
      message.warning('请输入评论')
      return
    }

    props.editConfirm({
      content: String(inner?.innerHTML),
      attachment: form.getFieldsValue().attachments,
    })
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
    spanNode1.innerHTML = `@${value.name}`

    spanNode1.contentEditable = false as unknown as string

    spanNode1.setAttribute('data-userId', value.id)
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
      spanNode1.innerHTML = `@${value.name}`
      spanNode1.contentEditable = false as unknown as string

      spanNode1.setAttribute('data-userId', value.name)
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
  useEffect(() => {
    init()
  }, [])

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
          height: 'calc(90vh - 190px)',
          overflow: 'scroll',
          paddingRight: '24px',
        }}
      >
        <div
          style={{
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #ecedef',
              borderBottom: 'none',
              padding: '12px',
              marginTop: '8px',
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Upload
                style={{
                  display: 'inline-block',
                }}
                beforeUpload={onBeforeUpload}
                fileList={[]}
                customRequest={onUpload}
              >
                <GrepDiv>
                  <Hov
                    style={{
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: '#969799',
                    }}
                    type="image"
                  />
                </GrepDiv>
              </Upload>

              <Popover
                style={{
                  display: 'inline',
                }}
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
                <GrepDiv>
                  <Hov
                    onClick={() => {
                      setPlan(true)
                    }}
                    style={{
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: isOpen ? '#2877ff' : '#969799',
                    }}
                    type="mention"
                  />
                </GrepDiv>
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
