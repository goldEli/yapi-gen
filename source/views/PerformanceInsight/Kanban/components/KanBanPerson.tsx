import MoreSelect from '@/components/MoreSelect'
import { KanBanPersonHeader, KanBanPersonWrap } from '../style'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'

interface KanBanPersonProps {
  onClose(): void
}

const KanBanPerson = (props: KanBanPersonProps) => {
  const [t] = useTranslation()
  return (
    <KanBanPersonWrap>
      <KanBanPersonHeader>
        <div className="input">
          <MoreSelect
            placeholder={t('searchMembers')}
            onConfirm={() => null}
            onChange={() => {}}
            value={[]}
            options={[]}
          />
        </div>
        <CloseWrap width={32} height={32} onClick={props.onClose}>
          <CommonIconFont size={20} type="outdent" />
        </CloseWrap>
      </KanBanPersonHeader>
    </KanBanPersonWrap>
  )
}

export default KanBanPerson
