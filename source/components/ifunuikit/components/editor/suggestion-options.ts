import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import MentionList from './mention-list'

const suggestionOptions = {
  allowedPrefixes: null,
  render() {
    let component: any
    let popup: any

    return {
      onBeforeStart(props: any) {
        component = new ReactRenderer(MentionList, {
          props: {
            loading: true,
            options: props.items,
            onSelect: props.command,
          },
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },
      onStart(props: any) {
        component.updateProps({
          loading: false,
          options: props.items,
          onSelect: props.command,
        })
        if (!props.clientRect) {
          return
        }
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },
      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }
        return component.ref?.onKeyDown(props)
      },
      onBeforeUpdate(props: any) {
        component.updateProps({
          loading: true,
          options: props.items,
          onSelect: props.command,
        })
        if (!props.clientRect) {
          return
        }
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },
      onUpdate(props: any) {
        component.updateProps({
          loading: false,
          options: props.items,
          onSelect: props.command,
        })

        if (!props.clientRect) {
          return
        }
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },
      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}

export default suggestionOptions
