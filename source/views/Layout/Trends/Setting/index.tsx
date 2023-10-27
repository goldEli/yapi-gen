import CommonButton from '@/components/CommonButton'
import { CommonIconFont } from '@/components/CommonIconFont'
import {
  CheckboxWrap,
  MainWrap,
  OperationWrap,
  PermissionItem,
  TitleGroup,
} from '@/views/ProjectSetting/components/ProjectSet'
import { Breadcrumb } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { First, Wrap } from './style'
import { useDispatch, useSelector } from '@store/index'
import { editMyAllNoteSet } from '@/services/SiteNotifications'
import { setMyConfiguration } from '@store/SiteNotifications'
import { useNavigate } from 'react-router-dom'
import { getMessage } from '@/components/Message'

const Setting = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
      // selectKeys,
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
      <First>
        <Breadcrumb
          separator={
            <CommonIconFont
              type="right"
              size={14}
              color="var(--neutral-n1-d1)"
            />
          }
        >
          <Breadcrumb.Item>
            <a
              onClick={() => {
                navigate('/SiteNotifications/AllNote/1')
              }}
              style={{ color: 'var(--neutral-n1-d1)' }}
            >
              {t('notification')}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('notification_settings')}</Breadcrumb.Item>
        </Breadcrumb>
        <CommonButton onClick={onSave} type="primary">
          <span>{t('common.save')}</span>
        </CommonButton>
      </First>
      <div>
        <TitleGroup>
          <CheckboxWrap>{t('setting.all')}</CheckboxWrap>
          <OperationWrap>{t('operand')}</OperationWrap>
          <span>{t('common.permission')}</span>
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
      </div>
    </Wrap>
  )
}

export default Setting
