/* eslint-disable react-hooks/rules-of-hooks */
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { InfoItem, InfoWrap, Menu, MenuItem, NameWrap, Side } from './style'

const index = () => {
  const [t] = useTranslation()
  const { mainInfo } = useSelector(store => store.memberInfo)
  const { projectInfo } = useSelector(store => store.project)
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const navigate = useNavigate()
  const { isMember, userId } = paramsData
  const projectId = paramsData.id
  const menuList = [
    {
      id: 1,
      name: t('newlyAdd.hisSurvey'),
      path: 'Profile',
    },
    {
      id: 2,
      name: t('newlyAdd.hisAbeyance'),
      path: 'Carbon',
    },
    {
      id: 3,
      name: t('newlyAdd.hisCreate'),
      path: 'Create',
    },
    {
      id: 4,
      name: t('newlyAdd.hisFinish'),
      path: 'Finished',
    },
  ]

  const changeActive = (value: any) => {
    if (isMember) {
      const params = encryptPhp(
        JSON.stringify({ id: projectId, isMember, userId }),
      )
      navigate(`/ProjectManagement/MemberInfo/${value.path}?data=${params}`)
    } else {
      const params = encryptPhp(
        JSON.stringify({ userId, isMember: false, id: '' }),
      )
      navigate(`/AdminManagement/MemberInfo/${value.path}?data=${params}`)
    }
  }

  const onGoBack = () => {
    if (location.pathname.includes('/AdminManagement')) {
      navigate('/AdminManagement/StaffManagement')
    } else {
      const params = encryptPhp(
        JSON.stringify({ id: projectInfo?.id, pageIdx: 'main', type: 1 }),
      )
      navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
    }
  }

  return (
    <Side>
      <InfoWrap>
        {mainInfo?.avatar ? (
          // <img
          //   src={mainInfo?.avatar}
          //   style={{
          //     width: 40,
          //     height: 40,
          //     borderRadius: '50%',
          //     marginRight: 8,
          //   }}
          //   alt=""
          // />
          <CommonUserAvatar size="large" avatar={mainInfo?.avatar} />
        ) : (
          <CommonUserAvatar size="large" avatar={mainInfo?.avatar} />
        )}
        <InfoItem>
          <div>{mainInfo?.name}</div>
          <span>{mainInfo?.phone}</span>
        </InfoItem>
      </InfoWrap>
      <div
        onClick={onGoBack}
        style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--neutral-n6-d1)',
          margin: ' 0 16px',
          cursor: 'pointer',
        }}
      >
        <IconFont
          style={{
            color: 'var(--neutral-n3)',
            fontSize: '16px',
          }}
          type="left-md"
        />
        <span
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'var(--neutral-n3)',
            marginLeft: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {t('back')}
        </span>
      </div>
      <Menu>
        {menuList.map(item => (
          <MenuItem
            active={pathname.includes(item.path)}
            onClick={() => changeActive(item)}
            key={item.id}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </Side>
  )
}

export default index
