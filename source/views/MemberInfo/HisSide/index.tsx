/* eslint-disable react-hooks/rules-of-hooks */
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { InfoItem, InfoWrap, Menu, MenuItem, BackBox, Side } from './style'

const HisSide = () => {
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
        JSON.stringify({
          id: projectId,
          isMember,
          userId,
          type: paramsData?.type,
        }),
      )
      navigate(`/ProjectDetail/MemberInfo/${value.path}?data=${params}`)
    } else {
      const params = encryptPhp(
        JSON.stringify({
          userId,
          isMember: false,
          id: '',
          type: paramsData?.type,
        }),
      )
      navigate(
        `/AdminManagement/OrganizationInformation/MemberInfo/${value.path}?data=${params}`,
      )
    }
  }

  const onGoBack = () => {
    if (isMember) {
      const params = encryptPhp(
        JSON.stringify({
          id: projectInfo?.id,
          pageIdx: 'main',
          type: projectInfo.projectType === 1 ? 1 : 'ProjectMember',
        }),
      )
      const url = '/ProjectDetail/Member'
      navigate(`${url}?data=${params}`)
    } else {
      navigate('/AdminManagement/OrganizationInformation/StaffManagement')
    }
  }

  return (
    <Side style={{ padding: `${isMember ? 0 : 20}px 16px 0` }}>
      <BackBox onClick={onGoBack}>
        <IconFont
          style={{
            fontSize: '18px',
          }}
          type="left-md"
        />
        <span className="label">{t('back')}</span>
      </BackBox>
      <InfoWrap>
        <CommonUserAvatar size="large" avatar={mainInfo?.avatar} />
        <InfoItem>
          <div>{mainInfo?.name}</div>
          <span>{mainInfo?.phone}</span>
        </InfoItem>
      </InfoWrap>

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

export default HisSide
