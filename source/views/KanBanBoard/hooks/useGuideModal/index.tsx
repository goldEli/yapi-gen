import GuideModal from '@/components/GuideModal'
import { useDispatch, useSelector } from '@store/index'
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
      img: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/mianban/guide_1.jpg',
    },
    {
      key: 1,
      title: t('grouped_view'),
      desc: t('at_the_same_time'),
      img: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/mianban/guide_2.png',
    },
    {
      key: 2,
      title: t('columns_and_status'),
      desc: t(
        'vertical_filtering_can_be_performed_according_to_different_workflows',
      ),
      img: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/mianban/guide_3.jpg',
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
