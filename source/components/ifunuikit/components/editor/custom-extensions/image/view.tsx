/* eslint-disable consistent-return */
/* eslint-disable no-undefined */
/* eslint-disable react/boolean-prop-naming */
import type { NodeViewRendererProps } from '@tiptap/react'
import { useEffect } from 'react'
import generateTransparentSVG from '../../../../utils/generate-transparent-svg'
import ImageResizer from '../../components/image-resizer'
import { Wrap, Image, Progress } from './style'

type ViewProps = NodeViewRendererProps & {
  selected: boolean
  updateAttributes(options: any): void
}

const View = (props: ViewProps) => {
  const isLoading = props.node.attrs.loading
  const key = props.node.attrs.srcKey

  const onUploading = (event: { key: string; progress: number }) => {
    if (event.key !== key) {
      return
    }
    props.updateAttributes?.({
      progress: event.progress,
    })
  }

  const onUpload = (event: { key: string; url: string }) => {
    if (event.key !== key) {
      return
    }
    props.updateAttributes?.({
      src: event.url,
      loading: undefined,
      srcKey: undefined,
      progress: undefined,
    })
  }

  useEffect(() => {
    if (!isLoading) {
      return
    }

    props.editor.on('file_uploading' as any, onUploading)
    props.editor.on('file_uploaded' as any, onUpload)

    return () => {
      props.editor.off('file_uploading' as any, onUploading)
      props.editor.off('file_uploaded' as any, onUpload)
    }
  }, [isLoading, key, props.updateAttributes, props.editor])

  const { width } = props.node.attrs
  const { height } = props.node.attrs

  const onDoubleClick = (event: any) => {
    const editorCopy: any = props.editor
    editorCopy?.emit('double_click_image', event.target)
  }

  return (
    <Wrap as="span">
      <Image
        className="drag-handle"
        draggable
        data-drag-handle
        alt=""
        src={
          isLoading
            ? generateTransparentSVG({ width, height })
            : props.node.attrs.src
        }
        title={props.node.attrs.title}
        width={width}
        height={height}
        data-loading={isLoading}
        onClick={onDoubleClick}
      />
      {/* <Progress>{props.node.attrs.progress * 100}%</Progress> */}
      {props.selected && !isLoading ? (
        <ImageResizer
          imageURL={props.node.attrs.src}
          // eslint-disable-next-line react/jsx-handler-names
          onResize={props.updateAttributes}
        />
      ) : null}
    </Wrap>
  )
}

export default View
