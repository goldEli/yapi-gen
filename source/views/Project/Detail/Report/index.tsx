import { useTranslation } from 'react-i18next'

const ReportMain = () => {
  const [t] = useTranslation()
  return <>{t('version2.2.1.report')}</>
}

export default ReportMain
