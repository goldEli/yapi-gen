/**
 * 通用文件上传工具，结合了 COS 的 API
 */
import React, {
  createContext,
  memo,
  type ReactNode,
  type PropsWithChildren,
  useMemo,
  useState,
  useRef,
} from 'react'
import COS, { type COSOptions } from 'cos-js-sdk-v5'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Context = createContext<{
  cos: COS
  taskNameMap: Record<string, string>
  taskStatusMap: Record<string, ReactNode>
  removeTaskIds: string[]
  setTaskStatusMap: React.Dispatch<
    React.SetStateAction<Record<string, ReactNode>>
  >
  resetCOS(): void
} | null>(null)

type FilesTransferProviderProps = PropsWithChildren<{
  cosOptions: COSOptions
}>

const FilesTransferProvider = (props: FilesTransferProviderProps) => {
  const taskNameMapRef = useRef<Record<string, string>>({})
  const removeTaskIdsRef = useRef<string[]>([])
  const [taskStatusMap, setTaskStatusMap] = useState<Record<string, ReactNode>>(
    {},
  )
  const [changeCount, setChangeCount] = useState(0)
  const cos = useMemo(
    () => new COS(props.cosOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.cosOptions, changeCount],
  )
  const value = useMemo(
    () => ({
      cos,
      taskNameMap: taskNameMapRef.current,
      removeTaskIds: removeTaskIdsRef.current,
      taskStatusMap,
      setTaskStatusMap,
      resetCOS() {
        setChangeCount(i => i + 1)
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.cosOptions, taskStatusMap],
  )

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default memo(FilesTransferProvider)
