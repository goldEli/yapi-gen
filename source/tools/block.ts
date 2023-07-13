/**
 * Prompts a user when they exit the page
 */

import { openConfirmModal } from '@/components/DeleteConfirmGlobal'
import { useCallback, useContext, useEffect, useState } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

function useConfirmExit(confirmExit: () => Promise<boolean>, when = true) {
  const { navigator } = useContext(NavigationContext)

  useEffect(() => {
    if (!when) {
      return
    }

    const push = navigator.push

    navigator.push = async (...args: Parameters<typeof push>) => {
      const result = await confirmExit()
      if (result) {
        push(...args)
      }
    }

    return () => {
      navigator.push = push
    }
  }, [navigator, confirmExit, when])
}

export function usePrompt(props: {
  title: string
  text: string
  when: boolean
  okText?: string
  cancelText?: string
  onConfirm: () => void
}) {
  const { title, text, when, onConfirm, okText, cancelText } = props
  // useEffect(() => {
  //   if (when) {
  //     window.onbeforeunload = function () {
  //       return message
  //     }
  //   }

  //   return () => {
  //     window.onbeforeunload = null
  //   }
  // }, [message, when])

  const confirmExit = useCallback(async () => {
    // const confirm = window.confirm(message)
    // if (confirm) {
    //   onConfirm()
    // }
    return new Promise<boolean>((resolve, reject) => {
      openConfirmModal({
        title,
        text,
        okText,
        cancelText,
        onConfirm: () => {
          resolve(true)
          onConfirm()
          return Promise.resolve()
        },
        onCancel: () => {
          resolve(true)
        },
      })
    })
  }, [title, text])
  useConfirmExit(confirmExit, when)
}
