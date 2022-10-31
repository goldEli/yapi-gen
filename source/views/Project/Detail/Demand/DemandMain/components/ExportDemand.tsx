import styled from '@emotion/styled'
import FieldsTemplate from './FieldsTemplate'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useModel } from '@/models'

interface Props {
  // 是否是导出功能
  isShowExport?: any
  onClose(state: boolean): void
}

const ExportDemand = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { exportExcel, getExportExcel } = useModel('demand')

  // 下载导出模板
  const onConfirmTemplate = async (arr: any) => {
    const result = await getExportExcel({
      projectId,
      fields: arr.join(','),
    })
  }

  return (
    <FieldsTemplate
      visible={props.isShowExport}
      title={t('newlyAdd.importChoose')}
      importState={2}
      onClose={() => props.onClose(false)}
      onConfirm={onConfirmTemplate}
      isExport
    />
  )
}

export default ExportDemand
