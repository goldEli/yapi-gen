// 颜色选择组件
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-handler-names */
import IconFont from '@/components/IconFont'
import { getMessage } from '@/components/Message'
import { uploadFileByTask } from '@/services/cos'
import styled from '@emotion/styled'
import { message, Popover, Space, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
const ChooseColorUpload = styled.div({
  width: 56,
  height: 56,
  borderRadius: 6,
  cursor: 'pointer',
  border: '1px solid var(--neutral-n6-d2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 888,
  '.ant-upload.ant-upload-select': {
    width: '56px',
    height: '24px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 999,
  },
  '& img': {
    width: '32px',
    height: '32px',
  },
})
const TextStyle1 = styled.span`
  width: 56px;
  text-align: center;
  line-height: 24px;
  border-radius: 0 0 6px 6px;
  display: inline-block;
  height: 24px;
  background-color: var(--neutral-n2);
  font-size: 12px;
  color: var(--neutral-white-d7);
  position: absolute;
  bottom: -0px;
  left: -0px;
  opacity: 0.4;
`
const ChooseColorWrap = styled.div({
  width: 80,
  height: 80,
  borderRadius: 6,
  cursor: 'pointer',
  border: '1px solid var(--neutral-n6-d2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '40px',
    height: '40px',
  },
})
const TextStyle = styled.span`
  width: 80px;
  text-align: center;
  line-height: 24px;
  border-radius: 0 0 6px 6px;
  display: inline-block;
  height: 24px;
  background-color: var(--neutral-n2);
  font-size: 12px;
  color: var(--neutral-white-d7);
  position: absolute;
  bottom: 0;
  opacity: 0.4;
`
const ColorWrap = styled.div({
  width: '56px',
  height: '56px',
  borderRadius: '6px 6px 6px 6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: '1px solid var(--neutral-n6-d2)',
  position: 'relative',
})
const ColorWrapIcon = styled.div({
  width: '56px',
  height: '56px',
  borderRadius: '6px 6px 6px 6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: '1px solid var(--neutral-n6-d2)',
  position: 'relative',
  color: 'var(--neutral-n2)',
  fontSize: 20,
  '&:hover': {
    background: 'var(--hover-d2) !important',
    color: 'var(--primary-d2)',
    border: '1px solid var(--hover-d2)',
  },
})
const ImgStyle = styled.img`
  width: 32px;
  height: 32px;
`
const IconFontStyle = styled(IconFont)({
  position: 'absolute',
  right: 0,
  top: 0,
  fontSize: 22,
  color: 'var(--neutral-n3)',
})
const IconFontStyle1 = styled(IconFont)({
  position: 'absolute',
  right: 0,
  top: 0,
  fontSize: 22,
})
interface ChooseColorProps {
  color?: any
  onChange?(value?: string): void
  onChangeValue?(value?: any, state?: any): void
  colorList: any
  hiddenUpload: boolean
}
const ChooseIconOrUpload = (props: ChooseColorProps) => {
  const [isChooseColor, setIsChooseColor] = useState(false)
  const [t] = useTranslation()
  const [cover, setCover] = useState()

  useEffect(() => {
    props.hiddenUpload && setIsChooseColor(false)
  }, [props.hiddenUpload])

  const onChangeColor = (val: any) => {
    props?.onChangeValue?.(val, 2)
    setIsChooseColor(false)
  }
  const onCustomRequest = async (file: any) => {
    if (!file.file.type?.includes('image')) {
      getMessage({ msg: t('please_upload_a_picture'), type: 'warning' })
      return
    }
    const data: any = await uploadFileByTask(file.file, '2')
    if (data) {
      setCover(data.url)
      props?.onChangeValue?.(data.url, 2)
    }
  }

  const activeChoose = (event: any, img: any) => {
    event.preventDefault()
    event.stopPropagation()
    props?.onChangeValue?.(img, 1)
  }

  const colorStatus = (
    <Space
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 16,
        flexWrap: 'wrap',
        maxWidth: 349,
      }}
      size={8}
    >
      {props.colorList?.map((i: any) => (
        <ColorWrap key={i.id ?? i} onClick={() => onChangeColor(i)}>
          <ImgStyle src={i.path ?? i} />
          <IconFontStyle
            hidden={i.path ?? i !== props?.color}
            type="anglemark"
          />
        </ColorWrap>
      ))}

      {cover ? (
        <ChooseColorUpload onClick={e => activeChoose(e, cover)}>
          <img src={cover} />
          <IconFontStyle1 hidden={cover !== props?.color} type="anglemark" />
          <Upload
            fileList={[]}
            customRequest={(file: any) => onCustomRequest(file)}
          >
            <TextStyle1>{t('reupload')}</TextStyle1>
          </Upload>
        </ChooseColorUpload>
      ) : (
        <Upload
          fileList={[]}
          customRequest={(file: any) => onCustomRequest(file)}
        >
          <ColorWrapIcon>
            <IconFont type="plus" />
          </ColorWrapIcon>
        </Upload>
      )}
    </Space>
  )

  const onVisibleChange = (visible: any) => {
    setIsChooseColor(visible)
  }

  return (
    <Popover
      visible={isChooseColor}
      placement="bottomLeft"
      trigger="click"
      content={colorStatus}
      onVisibleChange={onVisibleChange}
    >
      <ChooseColorWrap onClick={() => setIsChooseColor(true)}>
        <img src={props?.color} />
        <TextStyle>{t('demandSettingSide.iconText')}</TextStyle>
      </ChooseColorWrap>
    </Popover>
  )
}

export default ChooseIconOrUpload
