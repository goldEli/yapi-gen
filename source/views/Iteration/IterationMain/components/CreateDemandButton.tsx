import CommonButton from '@/components/CommonButton'
import { useTranslation } from 'react-i18next'

interface Props {
  onCreateDemand(): void
  hasCreate: boolean
}

const CreateDemandButton = (props: Props) => {
  const [t] = useTranslation()
  return (
    <>
      {props.hasCreate && (
        <div style={{ padding: '16px 0 4px 16px', background: 'white' }}>
          <CommonButton type="primaryText" icon="plus" iconPlacement="left">
            <div>{t('common.createDemand')}</div>
          </CommonButton>
        </div>
      )}
    </>
  )
}

export default CreateDemandButton
