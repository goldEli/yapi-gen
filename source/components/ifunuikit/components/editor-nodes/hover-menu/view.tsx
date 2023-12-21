/* eslint-disable new-cap */
/* eslint-disable no-duplicate-imports */
/* eslint-disable consistent-return */
import type { HoverMenuPluginProps } from './plugin'
import { HoverMenuPlugin } from './plugin'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type HoverMenuProps = Omit<
  Optional<HoverMenuPluginProps, 'pluginKey'>,
  'element'
> & {
  className?: string
  children: React.ReactNode
}

export const HoverMenu = (props: HoverMenuProps) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const domRef = useRef<HTMLAnchorElement>()

  useEffect(() => {
    if (!element) {
      return
    }

    if (props.editor.isDestroyed) {
      return
    }

    const {
      pluginKey = 'hoverMenu',
      editor,
      tippyOptions = {},
      shouldShow = null,
    } = props

    const plugin = HoverMenuPlugin({
      pluginKey,
      editor,
      element,
      tippyOptions,
      shouldShow,
    })

    editor.registerPlugin(plugin)
    return () => editor.unregisterPlugin(pluginKey)
  }, [props.editor, element])

  const onEdit = () => {
    if (!domRef.current) {
      return
    }
    const from = props.editor.view.posAtDOM(domRef.current, 0)
    const to = props.editor.view.posAtDOM(
      domRef.current,
      domRef.current.textContent?.length || 0,
    )

    props.editor
      .chain()
      .focus(from)
      .deleteRange({ from, to })
      .insertContent(
        {
          type: 'text',
          text: '666',
          marks: [
            {
              type: 'link',
              attrs: {
                href: '000',
              },
            },
          ],
        },
        {
          updateSelection: true,
        },
      )
      .focus()
      .run()
  }

  return (
    <div
      ref={setElement}
      className={props.className}
      style={{ visibility: 'hidden' }}
    >
      {props.children}
    </div>
  )
}
