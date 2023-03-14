import IconFont from '@/components/IconFont'
import { SecondButton } from '@/components/StyleCommon'
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
          <SecondButton onClick={props.onCreateDemand}>
            <IconFont type="plus" />
            <div>{t('common.createDemand')}</div>
          </SecondButton>
        </div>
      )}
    </>
  )
}

export default CreateDemandButton
