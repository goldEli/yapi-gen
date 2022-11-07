import FieldsTemplate from './FieldsTemplate'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useModel } from '@/models'

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

  // 下载导出模板
  const onConfirmTemplate = async (arr: any) => {
    const params = {
      projectId,
      fields: arr,
      ...props.otherParams,
      ...props.searchGroups,
    }
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
  }

  return (
    <FieldsTemplate
      visible={props.isShowExport}
      title="导出需求字段选择"
      importState={2}
      onClose={() => props.onClose(false)}
      onConfirm={onConfirmTemplate}
      isExport
    />
  )
}

export default ExportDemand
