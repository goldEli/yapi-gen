import '@wangeditor/editor/dist/css/style.css'
import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor'

export default () => {
  const [editor, setEditor] = useState<IDomEditor | null>(null) // 存储 editor 实例
  const [html, setHtml] = useState('<p>hello</p>') // 编辑器内容
  const toolbarConfig = {}
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  }

  useEffect(
    () => {
      return () => {
        if (editor == null) { return }
        editor.destroy()
        setEditor(null)
      }
    },
    [editor],
  )

  return (
    <div
      style={{ border: '1px solid #EBEDF0',
        zIndex: 100,
        borderRadius: 6 }}
    >
      <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={editor => setHtml(editor.getHtml())}
        mode="default"
        style={{ height: 132,
          overflowY: 'hidden' }}
      />
    </div>
  )
}
