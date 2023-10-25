/* eslint-disable react/jsx-no-leaked-render */
import { Popover, Space } from 'antd'
import {
  LayoutHeaderRightWrap,
  MenuItem,
  MenuItems,
  MenuLeft,
  MenuRight,
  NameWrap,
  PhoneWrap,
  Provider,
  UserInfoBox,
  UserInfoTop,
  UserInfoWrap,
  ChangeItems,
  ChangeItem,
  CompanyCards,
  HeaderUserInfoWrap,
  HeaderItemWrap,
} from '../style'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import CommonIconFont from '@/components/CommonIconFont'
import { useDispatch, useSelector } from '@store/index'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LocaleKeys, changeLanguage } from '@/locals'
import { getMessage } from '@/components/Message'
import { getLoginDetail } from '@store/user/user.thunk'
import { setIsRefresh } from '@store/user'
import CommonModal from '@/components/CommonModal'
import { CompanyCard } from '@/views/Container/style'
import { getCompanyList, updateCompany } from '@/services/user'
import { changeKeyBoardVisible } from '@store/SiteNotifications'
import { changeFreedVisibleVisible } from '@store/feedback'
import SystemFeedback from '@/components/SystemFeedback/SystemFeedback'
import KeyBoardDrawer from '@/views/SiteNotifications/components/KeyBoardDrawer/KeyBoardDrawer'

const ChangeComponent = (props: { item: any; onClose(): void }) => {
  const [t] = useTranslation()
  const { language } = useSelector(store => store.global)
  const { isRefresh } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const [isChangeVisible, setIsChangeVisible] = useState(false)

  const languageList = [
    { name: '简体中文', key: 'zh' },
    { name: 'English', key: 'en' },
  ]

  const onClose = () => {
    props.onClose()
    setIsChangeVisible(false)
  }

  // 可切换的内容
  const changeContent = (key: number) => {
    // 切换语言
    const onChangeLanguage = async (type: string) => {
      if (type === language) return
      onClose()
      await changeLanguage(type as LocaleKeys)
      getMessage({ msg: t('common.localsSwitching'), type: 'success' })
      dispatch({
        type: 'global/setLanguage',
        payload: type,
      })
      dispatch(getLoginDetail())
      dispatch(setIsRefresh(!isRefresh))
    }
    return (
      <>
        {key === 0 && (
          <ChangeItems>
            {languageList.map((i: any) => (
              <ChangeItem
                isActive={language === i.key}
                key={i.key}
                onClick={() => onChangeLanguage(i.key)}
              >
                {i.name}
                {language === i.key && <CommonIconFont type="check" />}
              </ChangeItem>
            ))}
          </ChangeItems>
        )}
      </>
    )
  }

  return (
    <Popover
      content={changeContent(props.item.key)}
      placement="left"
      open={isChangeVisible}
      onOpenChange={setIsChangeVisible}
    >
      <MenuItem key={props.item.key}>
        <MenuLeft className="menuLeft">
          <CommonIconFont type={props.item.icon} />
          <span>{props.item.name}</span>
        </MenuLeft>
        {props.item.isRight && (
          <MenuRight>
            {!props.item.key && (
              <span>{language === 'zh' ? '简体中文' : 'English'}</span>
            )}
            <CommonIconFont type="right" />
          </MenuRight>
        )}
      </MenuItem>
    </Popover>
  )
}

const LayoutHeaderRight = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { userInfo } = useSelector(store => store.user)
  const { language } = useSelector(store => store.global)
  // 帮助中心展开
  const [isHelpVisible, setIsHelpVisible] = useState(false)
  // 头像展开
  const [isVisible, setIsVisible] = useState(false)
  // 打开个人资料
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  // 退出登录
  const [isConfirmLogout, setIsConfirmLogout] = useState(false)
  // 切换公司
  const [isChangeCompany, setIsChangeCompany] = useState(false)
  // 公司列表
  const [companyList, setCompanyList] = useState<any[]>([])
  // 选中的公司id
  const [activeId, setActiveId] = useState('')
  const [companyParams, setCompanyParams] = useState({
    companyId: '',
    companyUserId: '',
  })

  const userList = [
    { name: userInfo?.company_name, isRight: true, icon: 'enterprise', key: 1 },
    { name: t('language'), isRight: true, icon: 'earth', key: 0 },
    { name: t('personal_data'), isRight: false, icon: 'user', key: 2 },
    { name: t('container.logout'), isRight: false, icon: 'login', key: 3 },
  ]

  // 帮助中心下拉列表
  const helpList = [
    {
      name: t('videoTutorial'),
      key: 'video-on',
      icon: 'video-on',
    },
    {
      name: t('helpManual'),
      key: 'question',
      icon: 'question',
    },
    {
      name: t('usageFeedback'),
      key: 'draft',
      icon: 'draft',
    },
    {
      name: t('operationShortcutKeys'),
      key: 'keyboard',
      icon: 'keyboard',
    },
  ]

  // 点击下拉 key:2 个人资料，3：退出登录
  const onClickMenu = (key: number) => {
    switch (key) {
      case 2:
        setIsInfoVisible(true)
        break
      case 3:
        setIsConfirmLogout(true)
        break
      default:
        setIsChangeCompany(true)
        break
    }
    setIsVisible(false)
  }

  // 获取公司列表
  const getCompanyData = async () => {
    const res2 = await getCompanyList()
    setActiveId(userInfo.company_id)
    setCompanyList(res2)
  }

  // 展开用户popover
  const onChangeUserPopover = (state: boolean) => {
    setIsVisible(state)
    if (state) {
      getCompanyData()
    }
  }

  // 切换公司卡片
  const onClickCompany = (value: any) => {
    setActiveId(value.id)
    setCompanyParams({
      companyId: value.id,
      companyUserId: value.companyUserId,
    })
  }

  // 点击切换公司
  const onConfirmChange = async () => {
    if (activeId === userInfo.company_id) return
    await updateCompany(companyParams)
    sessionStorage.removeItem('saveRouter')
    setIsChangeCompany(false)
    // 切换公司后调整到哪里菜单呢？？？？
    location.reload()
  }

  // 点击帮助中心
  const onClickHelp = (key: string) => {
    setIsHelpVisible(false)
    switch (key) {
      case 'video-on':
        window.open('/videoTeach')
        break
      case 'question':
        window.open(
          'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/Agile.pdf',
        )
        break
      case 'draft':
        dispatch(changeFreedVisibleVisible(true))
        break
      default:
        dispatch(changeKeyBoardVisible(true))
        break
    }
  }

  const userContent = (
    <UserInfoWrap>
      <UserInfoTop>
        <div style={{ marginLeft: 10 }}>
          <CommonUserAvatar avatar={userInfo.avatar} size="large" />
        </div>

        <UserInfoBox>
          <NameWrap>{userInfo.name}</NameWrap>
          <PhoneWrap>{userInfo.phone}</PhoneWrap>
        </UserInfoBox>
      </UserInfoTop>
      <Provider />
      <MenuItems>
        {userList.map((i: any) => (
          <div key={i.icon}>
            {i.isRight && !i.key && (
              <ChangeComponent item={i} onClose={() => setIsVisible(false)} />
            )}
            {i.key !== 0 && (
              <MenuItem key={i.key} onClick={() => onClickMenu(i.key)}>
                <MenuLeft className="menuLeft">
                  <CommonIconFont type={i.icon} />
                  <span>{i.name}</span>
                </MenuLeft>
                {i.key === 1 && (
                  <MenuRight>
                    <CommonIconFont type="swap" />
                  </MenuRight>
                )}
              </MenuItem>
            )}
          </div>
        ))}
      </MenuItems>
    </UserInfoWrap>
  )

  const helpContent = (
    <ChangeItems>
      {helpList.map((i: any) => (
        <ChangeItem
          key={i.key}
          height={40}
          onClick={(e: any) => {
            e.stopPropagation()
            onClickHelp(i.key)
          }}
        >
          <Space size={8}>
            <CommonIconFont type={i.icon} color="var(--neutral-n3)" />
            {i.name}
          </Space>
        </ChangeItem>
      ))}
    </ChangeItems>
  )

  return (
    <LayoutHeaderRightWrap>
      <KeyBoardDrawer />
      <SystemFeedback />
      {/* 切换公司 */}
      <CommonModal
        isVisible={isChangeCompany}
        title={t('components.changeCompany')}
        onClose={() => setIsChangeCompany(false)}
        onConfirm={onConfirmChange}
      >
        <CompanyCards>
          <div style={{ padding: '0 8px' }}>
            {companyList.map((i: any) => (
              <CompanyCard
                key={i.id}
                isActive={i.id === activeId}
                onClick={() => onClickCompany(i)}
              >
                <div className="info">
                  <img src={i.logo} alt="" />
                  <span>{i.name}</span>
                </div>
                {i.id === activeId && (
                  <CommonIconFont
                    type="check"
                    size={20}
                    color="var(--primary-d2)"
                  />
                )}
              </CompanyCard>
            ))}
          </div>
        </CompanyCards>
      </CommonModal>

      <Popover
        content={helpContent}
        open={isHelpVisible}
        onOpenChange={setIsHelpVisible}
        placement="bottomLeft"
      >
        <HeaderItemWrap isActive={isHelpVisible}>
          <div>{t('helpCenter')}</div>
          <CommonIconFont type="down" size={16} />
        </HeaderItemWrap>
      </Popover>

      <Popover
        content={userContent}
        open={isVisible}
        onOpenChange={onChangeUserPopover}
        placement="bottomRight"
      >
        <HeaderUserInfoWrap isActive={isVisible}>
          <CommonUserAvatar avatar={userInfo.avatar} size="large" />
          <CommonIconFont type="down-icon" size={12} />
        </HeaderUserInfoWrap>
      </Popover>
    </LayoutHeaderRightWrap>
  )
}

export default LayoutHeaderRight
