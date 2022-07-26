import '@wangeditor/editor/dist/css/style.css'
import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor'

interface Props {
  value: string
  onChangeValue(value: string): void
}

const EditorBox = (props: Props) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const toolbarConfig = {}
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  }

  useEffect(() => {
    return () => {
      if (editor === null) {
        return
      }
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  const onChange = (e: any) => {
    props.onChangeValue(e.getHtml())
  }

  return (
    <div style={{ border: '1px solid #EBEDF0', zIndex: 100, borderRadius: 6 }}>
      <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" />
      <Editor
        defaultConfig={editorConfig}
        value={props.value}
        onCreated={setEditor}
        onChange={onChange}
        mode="default"
        style={{ height: 132, overflowY: 'hidden' }}
      />
    </div>
  )
}

export default EditorBox
