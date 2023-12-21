/* eslint-disable consistent-return */
/* eslint-disable no-undefined */
import type { NodeViewRendererProps } from '@tiptap/react'
import { useEffect } from 'react'
import generateTransparentSVG from '../../../../utils/generate-transparent-svg'
import ImageResizer from '../../components/image-resizer'
import { Wrap, Video } from './style'

type ViewProps = NodeViewRendererProps & {
  // eslint-disable-next-line react/boolean-prop-naming
  selected: boolean
  updateAttributes(options: unknown): void
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

  return (
    <Wrap as="span">
      <Video
        className="drag-handle"
        draggable
        data-drag-handle
        src={
          isLoading
            ? generateTransparentSVG({ width, height })
            : props.node.attrs.src
        }
        title={props.node.attrs.title}
        width={width}
        height={height}
        controls
        data-loading={isLoading}
        data-src-key={props.node.attrs.srcKey}
      />
    </Wrap>
  )
}

export default View
