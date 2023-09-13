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
        <div style={{ margin: '16px 0' }}>
          <CommonButton
            type="primaryText"
            icon="plus"
            iconPlacement="left"
            onClick={props.onCreateDemand}
          >
            <div>{t('common.createDemand')}</div>
          </CommonButton>
        </div>
      )}
    </>
  )
}

export default CreateDemandButton
