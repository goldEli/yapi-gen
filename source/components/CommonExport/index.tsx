// 需求主页-导出需求

import FieldsTemplate from '@/components/CommonImport/FieldsTemplate'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useState } from 'react'
import { useSelector } from '@store/index'

interface Props {
  // 是否是导出功能
  isShowExport?: any
  onClose(state: boolean): void
  searchGroups: any
  otherParams: any
  // 导出窗口需要的接口
  interfaces: any
  // 模板modal需要的接口
  templateInterfaces: any
  // 导出按钮的文案
  exportText: string
}

const CommonExport = (props: Props) => {
  const {
    templateInterfaces,
    interfaces: { getExportExcel },
    exportText,
  } = props
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo } = useSelector(store => store.project)
  const [isSpin, setIsSpin] = useState(false)

  // 下载导出模板
  const onConfirmTemplate = async (arr: any) => {
    const params = {
      projectId,
      fields: arr,
      ...props.otherParams,
      ...props.searchGroups,
    }
    setIsSpin(true)
    const result = await getExportExcel(params)
    const blob = new Blob([result.body], {
      type: result.headers['content-type'],
    })
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = `${projectInfo?.name}.xlsx`
    a.href = blobUrl
    a.click()
    props.onClose(false)
    setIsSpin(false)
  }

  return (
    <FieldsTemplate
      exportText={exportText}
      visible={props.isShowExport}
      title={`${exportText}${t('p2.exportFields')}`}
      onClose={() => props.onClose(false)}
      onConfirm={onConfirmTemplate}
      isExport
      isSpin={isSpin}
      interfaces={templateInterfaces}
    />
  )
}

export default CommonExport
