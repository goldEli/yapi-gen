import CommonButton from '@/components/CommonButton'
import { useEffect, useImperativeHandle, useState } from 'react'
import { PermissionItem } from '@/views/ProjectSetting/components/ProjectSet'
import { useTranslation } from 'react-i18next'
import {
  Wrap,
  MainWrap,
  FooterWrap,
  CheckboxWrap,
  OperationWrap,
  TitleGroup,
} from './style'
import { useDispatch, useSelector } from '@store/index'
import { editMyAllNoteSet } from '@/services/SiteNotifications'
import { setMyConfiguration } from '@store/SiteNotifications'
import { getMessage } from '@/components/Message'

const Setting = (props: { onClose(): void }) => {
  const [t, i18n] = useTranslation()
  const dispatch = useDispatch()
  const { language } = useSelector(store => store.global)
  const [selectKeys, setSelectKeys] = useState<any>()
  const configurations = useSelector(
    store => store.siteNotifications.configuration,
  )
  const myConfiguration = useSelector(
    store => store.siteNotifications.myConfiguration,
  )
  const myEmailConfiguration = useSelector(
    store => store.siteNotifications.myEmailConfiguration,
  )
  const [activeDetail, setActiveDetail] = useState<any>({})

  const onSave = async () => {
    const res = await editMyAllNoteSet(
      Array.from(new Set([...myEmailConfiguration, ...selectKeys])),
    )

    if (res.code === 0) {
      getMessage({ msg: t('succeed') as string, type: 'success' })
    }
    dispatch(setMyConfiguration(selectKeys))
  }

  useEffect(() => {
    setSelectKeys(myConfiguration)
  }, [myConfiguration])

  return (
    <Wrap>
      <TitleGroup isZh={language === 'zh'}>
        <OperationWrap>{t('application')}</OperationWrap>
        <CheckboxWrap>{t('setting.all')}</CheckboxWrap>
        <span>{t('notificationItems')}</span>
      </TitleGroup>
      <MainWrap>
        {configurations.map((i: any) => {
          return (
            <PermissionItem
              key={i.name}
              item={i}
              onChange={setSelectKeys}
              value={selectKeys}
              activeDetail={activeDetail}
            />
          )
        })}
      </MainWrap>
      <FooterWrap>
        <CommonButton onClick={props.onClose} type="light">
          <span>{t('common.cancel')}</span>
        </CommonButton>
        <CommonButton onClick={onSave} type="primary">
          <span>{t('common.save')}</span>
        </CommonButton>
      </FooterWrap>
    </Wrap>
  )
}

export default Setting
