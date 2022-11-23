// 需求主页-导出需求

import FieldsTemplate from './FieldsTemplate'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useModel } from '@/models'
import { useState } from 'react'

interface Props {
  // 是否是导出功能
  isShowExport?: any
  onClose(state: boolean): void
  searchGroups: any
  otherParams: any
}

const ExportDemand = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { getExportExcel } = useModel('demand')
  const { projectInfo } = useModel('project')
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
    a.download = projectInfo?.name
    a.href = blobUrl
    a.click()
    props.onClose(false)
    setIsSpin(false)
  }

  return (
    <FieldsTemplate
      visible={props.isShowExport}
      title={t('p2.exportFields')}
      importState={2}
      onClose={() => props.onClose(false)}
      onConfirm={onConfirmTemplate}
      isExport
      isSpin={isSpin}
    />
  )
}

export default ExportDemand
