import { useTranslation } from 'react-i18next'

const DefectMain = () => {
  const [t] = useTranslation()
  return <>{t('version2.2.1.defect')}</>
}

export default DefectMain
