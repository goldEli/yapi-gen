/* eslint-disable react/jsx-no-leaked-render */
import { Popover, Space, Tooltip, message } from 'antd'
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
  PersonalHead,
  LineBox,
  Line,
  Line2,
  MenuItemBox,
  MineCreate,
  CompanyCard,
  RobotButton,
  NumberBox,
  PopOverBox,
  NumberWrap,
} from '../style'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import CommonIconFont from '@/components/CommonIconFont'
import { useDispatch, useSelector } from '@store/index'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LocaleKeys, changeLanguage } from '@/locals'
import { getMessage } from '@/components/Message'
import { getLoginDetail } from '@store/user/user.thunk'
import { setIsRefresh } from '@store/user'
import CommonModal from '@/components/CommonModal'
import { getCompanyList, loginOut, updateCompany } from '@/services/user'
import { changeKeyBoardVisible } from '@store/SiteNotifications'
import { changeFreedVisibleVisible } from '@store/feedback'
import SystemFeedback from '@/components/SystemFeedback/SystemFeedback'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useNavigate } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import KeyBoardDrawer from '../Trends/components/KeyBoardDrawer/KeyBoardDrawer'
import { setLayoutSecondaryMenuRightWidth } from '@store/global'
import TodoDrawer from './TodoDrawer'
import RecomendDrawer from './RecomendDrawer'
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

interface LayoutHeaderRightProps {
  onChangeReportAssistantModalObj(value: any): void
}

const LayoutHeaderRight = (props: LayoutHeaderRightProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const todoDrawerRef = useRef<any>()
  // 待办
  const [todoDrawerOpen, setTodoDrawerOpen] = useState(false)
  // 为你推荐
  const [recomendDrawerOpen, setRecomendDrawerOpen] = useState(false)
  const { userInfo, isRefresh } = useSelector(store => store.user)
  const { msgStatics } = useSelector(store => store.mine)
  const { todoStatistics } = msgStatics ?? {}
  const { total } = todoStatistics ?? {}
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
    // { name: t('container.logout'), isRight: false, icon: 'login', key: 3 },
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

  // 个人资料字段
  const labelList = [
    {
      label: t('head_portrait'),
      key: 'avatar',
      value: userInfo.avatar,
    },
    {
      label: t('common.phone'),
      value: userInfo.account,
    },
    {
      label: t('common.email'),
      value: userInfo.email,
    },
    {
      label: t('common.nickname'),
      value: userInfo.nickname,
    },
    {
      label: t('common.name'),
      value: userInfo.name,
    },
    {
      label: t('common.sex'),
      value: userInfo.gender === 1 ? t('common.male') : t('common.female'),
    },
    {
      label: t('container.department'),
      value: userInfo.department_name,
    },
    {
      label: t('common.job'),
      value: userInfo?.position_name,
    },
    {
      label: t('team'),
      value: userInfo?.teams?.join(';'),
    },
    {
      label: t('permission_group'),
      value: userInfo.group_name,
    },
  ]

  // 点击下拉 key:2 个人资料，3：退出登录
  const onClickMenu = (key: number, e: any) => {
    setIsVisible(false)
    e.stopPropagation()
    switch (key) {
      case 2:
        setIsInfoVisible(true)
        break
      case 3:
        setIsConfirmLogout(true)
        break
      case 4:
        dispatch(changeFreedVisibleVisible(true))
        break
      default:
        setIsChangeCompany(true)
        break
    }
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
    navigate('/Project')
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
      default:
        dispatch(changeKeyBoardVisible(true))
        break
    }
  }

  // 退出登录
  const onToLoginOut = async () => {
    message.destroy()
    sessionStorage.removeItem('saveRouter')
    const res = await loginOut()
    if (res.code === 0) {
      localStorage.clear()
      navigate('/login')
    }
  }

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

  const userContent = (
    <UserInfoWrap>
      <UserInfoTop>
        <div style={{ marginLeft: 10 }}>
          <CommonUserAvatar avatar={userInfo.avatar} size="large" />
        </div>

        <UserInfoBox>
          <NameWrap>
            {userInfo.name}（{userInfo?.position_name}）
          </NameWrap>
          <PhoneWrap>{userInfo?.department_name}</PhoneWrap>
        </UserInfoBox>
      </UserInfoTop>
      <Provider />
      <MenuItems style={{ margin: '12px 0 8px' }}>
        {userList.map((i: any) => (
          <div key={i.icon}>
            {i.isRight && !i.key && (
              <ChangeComponent item={i} onClose={() => setIsVisible(false)} />
            )}
            {i.key !== 0 && (
              <MenuItem key={i.key} onClick={(e: any) => onClickMenu(i.key, e)}>
                <MenuLeft className="menuLeft" style={{ width: '80%' }}>
                  <CommonIconFont type={i.icon} />
                  <div>{i.name}</div>
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
      <Provider />
      <MenuItems style={{ marginTop: '8px' }}>
        <MenuItem onClick={e => onClickMenu(4, e)}>
          <MenuLeft className="menuLeft" style={{ width: '80%' }}>
            <CommonIconFont type="draft" />
            <div>{t('usageFeedback')}</div>
          </MenuLeft>
        </MenuItem>
      </MenuItems>
      <Popover
        content={helpContent}
        open={isHelpVisible}
        onOpenChange={setIsHelpVisible}
        placement="leftTop"
        trigger="hover"
      >
        <MenuItems style={{ margin: '0 0 8px 0' }}>
          <MenuItem>
            <MenuLeft className="menuLeft" style={{ width: '80%' }}>
              <CommonIconFont type="question" />
              <div>{t('helpCenter')}</div>
            </MenuLeft>
            <MenuRight>
              <CommonIconFont type="right" />
            </MenuRight>
          </MenuItem>
        </MenuItems>
      </Popover>
      <Provider />
      <MenuItems style={{ marginTop: '8px' }}>
        <MenuItem onClick={e => onClickMenu(3, e)}>
          <MenuLeft className="menuLeft" style={{ width: '80%' }}>
            <CommonIconFont type="login" />
            <div>{t('container.logout')}</div>
          </MenuLeft>
        </MenuItem>
      </MenuItems>
    </UserInfoWrap>
  )

  // 日报机器人
  const contents = (
    <div style={{ padding: '4px 0px' }}>
      <MenuItemBox
        onClick={() =>
          props?.onChangeReportAssistantModalObj?.({
            visible: true,
            type: 'project',
          })
        }
      >
        <IconFont
          style={{
            fontSize: 16,
            color: 'var(--neutral-n3) !important',
            marginRight: 8,
          }}
          type="folder-open-nor"
        />
        <span>{t('projectDaily')}</span>
      </MenuItemBox>
      <MenuItemBox
        onClick={() =>
          props?.onChangeReportAssistantModalObj?.({
            visible: true,
            type: 'user',
          })
        }
      >
        <IconFont
          style={{
            fontSize: 16,
            marginRight: 8,
            color: 'var(--neutral-n3) !important',
          }}
          type="user"
        />
        <span>{t('singleDaily')}</span>
      </MenuItemBox>
    </div>
  )

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(
        setLayoutSecondaryMenuRightWidth(
          document.getElementById('LayoutHeaderRightWrap')?.clientWidth || 0,
        ),
      )
    }
  }, [isRefresh, userInfo])
  /**
   * 待办和为你推荐
   */
  const operateClick = (type: number) => {
    console.log('type', type)
    if (type === 1) {
      setRecomendDrawerOpen(false)
      setTodoDrawerOpen(true)
      return
    }
    setTodoDrawerOpen(false)
    setRecomendDrawerOpen(true)
  }
  useEffect(() => {
    window.addEventListener('click', (e: any) => {})
    return () => {
      window.removeEventListener('click', () => {})
    }
  }, [])
  return (
    <LayoutHeaderRightWrap id="LayoutHeaderRightWrap">
      <KeyBoardDrawer />
      <SystemFeedback />
      <TodoDrawer
        open={todoDrawerOpen}
        onCancel={() => {
          setTodoDrawerOpen(false)
        }}
        ref={todoDrawerRef}
      />

      <RecomendDrawer
        open={recomendDrawerOpen}
        onCancel={() => {
          setRecomendDrawerOpen(false)
        }}
      />
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

      {/* 个人资料 */}
      <CommonModal
        onClose={() => {
          setIsInfoVisible(false)
          setIsVisible(false)
        }}
        isVisible={isInfoVisible}
        title={t('personal_data') as string}
        isShowFooter
        width={420}
      >
        <div style={{ padding: '0 24px 32px' }}>
          <div>
            {labelList?.map((i: any) => (
              <LineBox key={i.label}>
                <Line key={i.label}>{i.label ? i.label : '-'}</Line>
                {i.key === 'avatar' && (
                  <PersonalHead>
                    <CommonUserAvatar size="large" avatar={userInfo.avatar} />
                  </PersonalHead>
                )}
                {i.key !== 'avatar' && (
                  <Tooltip title={i.value} placement="topRight">
                    <Line2 key={i.label}>{i.value || '--'}</Line2>
                  </Tooltip>
                )}
              </LineBox>
            ))}
          </div>
        </div>
      </CommonModal>

      {/* 退出登录 */}
      <DeleteConfirm
        title={t('confirmation_prompt') as string}
        text={t('are_you_sure_you_want_to_log_out') as string}
        isVisible={isConfirmLogout}
        onChangeVisible={() => setIsConfirmLogout(!isConfirmLogout)}
        onConfirm={onToLoginOut}
      />
      {/* 待办 */}
      <PopOverBox
        onClick={(e: any) => {
          e.stopPropagation()
        }}
      >
        <Popover
          placement="bottomLeft"
          trigger="hover"
          getPopupContainer={() => document.body}
          overlayClassName="popover_yang"
        >
          <RobotButton onClick={() => operateClick(1)}>
            <img
              className="img"
              src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1702543680935/icon1.png"
            />
            <div className="name">待办</div>
            {total ? (
              <NumberWrap>
                <NumberBox>{total > 100 ? '99+' : total}</NumberBox>
              </NumberWrap>
            ) : null}
          </RobotButton>
        </Popover>
      </PopOverBox>
      {/* 为你推荐 */}
      <PopOverBox
        onClick={(e: any) => {
          e.stopPropagation()
        }}
      >
        <Popover
          placement="bottomLeft"
          trigger="hover"
          getPopupContainer={() => document.body}
          overlayClassName="popover_yang"
        >
          <RobotButton onClick={() => operateClick(2)}>
            <img
              className="img"
              src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1702543715733/icon2.png"
            />
            <div className="name">为你推荐</div>
          </RobotButton>
        </Popover>
      </PopOverBox>
      <Space size={8}>
        {/* 日报机器人 只有项目内部和汇报才有机器人 */}
        {location.href.includes('/ProjectDetail/') ||
        location.href.includes('/Report') ? (
          <PopOverBox>
            <Popover
              placement="bottomLeft"
              content={contents}
              trigger="hover"
              getPopupContainer={() => document.body}
              overlayClassName="popover_yang"
            >
              <RobotButton>
                <img
                  className="img"
                  src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/reportAssistant.png"
                />
                <div className="name">{t('dailyAssistant')}</div>
              </RobotButton>
            </Popover>
          </PopOverBox>
        ) : null}

        <Popover
          content={userContent}
          open={isVisible}
          onOpenChange={onChangeUserPopover}
          placement="bottomRight"
          trigger="click"
        >
          <HeaderUserInfoWrap isActive={isVisible}>
            <div className="avatar">
              <CommonUserAvatar
                avatar={userInfo.avatar}
                size="large"
                notBorder
              />
            </div>
            <CommonIconFont type="down-icon" size={12} />
          </HeaderUserInfoWrap>
        </Popover>
      </Space>
    </LayoutHeaderRightWrap>
  )
}

export default LayoutHeaderRight
