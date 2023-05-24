import { useState } from 'react'
import CommonModal from '@/components/CommonModal'
import CommonImport from '@/components/CommonImport'
import {
  getImportDownloadModel,
  getImportExcel,
  getImportExcelUpdate,
  getExportFields,
  getLoadListFields,
  getExportExcel,
} from '@/services/demand'
import CommonExport from '@/components/CommonExport'
import { useTranslation } from 'react-i18next'

const Index = (props: any) => {
  const [t, i18n] = useTranslation()
  const [isShow, setIsShow] = useState(false)
  const [isShow2, setIsShow2] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  const [isShowImport, setIsShowImport] = useState(false)
  const [isShowExport, setIsShowExport] = useState(false)
  const [filterState, setFilterState] = useState(true)
  const [defaultValue, setDefaultValue] = useState({})
  const [searchGroups, setSearchGroups] = useState<any>({
    statusId: [],
    priorityId: [],
    iterateId: [],
    tagId: [],
    userId: [],
    usersnameId: [],
    usersCopysendNameId: [],
    createdAtId: [],
    expectedStartAtId: [],
    expectedendat: [],
    updatedat: [],
    finishAt: [],
    searchValue: '',
  })
  const onImportClose = () => {
    setIsShowImport(false)
  }

  return (
    <div>
      <CommonModal
        isVisible={true}
        width={784}
        title={t('common.importDefect')}
        isShowFooter
        onClose={onImportClose}
      >
        <CommonImport
          templateTitle={t('defect.importChoose')}
          interfaces={{
            getImportDownloadModel,
            getImportExcel,
            getImportExcelUpdate,
          }}
          templateInterfaces={{
            getExportFields,
            getLoadListFields,
          }}
          stepText={t('common.uploadDefect')}
          tips={{
            tab1: (
              <>
                <span>{t('defect.importText1')}</span>
                <span>{t('defect.importText2')}</span>
                <span>{t('defect.importText3')}</span>
                <span>{t('defect.importText4')}</span>
                <span>{t('defect.importText5')}</span>
                <span>{t('defect.importText6')}</span>
                <span>{t('defect.importText7')}</span>
                <span>{t('defect.importText8')}</span>
              </>
            ),
            tab2: (
              <>
                <span>{t('defect.importText9')}</span>
                <span>{t('defect.importText10')}</span>
                <span>{t('defect.importText11')}</span>
                <span>{t('defect.importText12')}</span>
                <span>{t('defect.importText13')}</span>
                <span>{t('defect.importText14')}</span>
                <span>{t('defect.importText15')}</span>
                <span>{t('defect.importText16')}</span>
              </>
            ),
          }}
        />
      </CommonModal>

      <CommonExport
        interfaces={{ getExportExcel }}
        isShowExport={isShowExport}
        onClose={setIsShowExport}
        searchGroups={searchGroups}
        otherParams={props.otherParams}
        templateInterfaces={{ getExportFields, getLoadListFields }}
      />
    </div>
  )
}

export default Index
