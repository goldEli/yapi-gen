import GuideModal from '@/components/GuideModal'
import { useDispatch, useSelector } from '@store/index'
import guide_1 from './img/guide_1.jpg'
import guide_2 from './img/guide_2.png'
import guide_3 from './img/guide_3.jpg'
import useI18n from '@/hooks/useI18n'
import { updateCompanyUserPreferenceConfig } from '@/services/user'
import { getLoginDetail } from '@store/user/user.thunk'

const useGuideModal = () => {
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { t } = useI18n()
  const dispatch = useDispatch()
  const inform = [
    {
      key: 0,
      title: t('status_of_Kanban_work_items'),
      desc: t(
        'the_card_state_changes_the_final_state_of_ta_according_to_the_draggable_destination',
      ),
      img: guide_1,
    },
    {
      key: 1,
      title: t('grouped_view'),
      desc: t('at_the_same_time'),
      img: guide_2,
    },
    {
      key: 2,
      title: t('columns_and_status'),
      desc: t(
        'vertical_filtering_can_be_performed_according_to_different_workflows',
      ),
      img: guide_3,
    },
  ]
  const guildModalEl = (
    <GuideModal
      width={784}
      height={670}
      inform={inform}
      close={async () => {
        await updateCompanyUserPreferenceConfig({
          id: userPreferenceConfig?.id,
          previewModel: userPreferenceConfig.previewModel,
          guidePageConfig: {
            kanban: 2,
          },
        })
        dispatch(getLoginDetail())
      }}
    />
  )
  return {
    guildModalEl,
  }
}

export default useGuideModal
