/* eslint-disable react-hooks/rules-of-hooks */
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  InfoItem,
  InfoWrap,
  Menu,
  MenuItem,
  MyDiv,
  NameWrap,
  Side,
} from './style'

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
    console.log('paramsData', paramsData)

    if (isMember) {
      const params = encryptPhp(
        JSON.stringify({
          id: projectId,
          isMember,
          userId,
          type: paramsData?.type,
        }),
      )
      navigate(`/MemberInfo/${value.path}?data=${params}`)
    } else {
      const params = encryptPhp(
        JSON.stringify({
          userId,
          isMember: false,
          id: '',
          type: paramsData?.type,
        }),
      )
      navigate(`/MemberInfo/${value.path}?data=${params}`)
    }
  }

  const onGoBack = () => {
    // debuggers
    if (isMember) {
      const params = encryptPhp(
        JSON.stringify({
          id: projectInfo?.id,
          pageIdx: 'main',
          type: projectInfo.projectType === 1 ? 1 : 'ProjectMember',
        }),
      )
      const url =
        projectInfo.projectType === 1
          ? '/ProjectManagement/ProjectSetting'
          : '/SprintProjectManagement/Setting'
      navigate(`${url}?data=${params}`)
    } else {
      navigate('/AdminManagement/StaffManagement')
    }
  }

  return (
    <Side>
      <InfoWrap>
        <CommonUserAvatar size="large" avatar={mainInfo?.avatar} />
        <InfoItem>
          <div>{mainInfo?.name}</div>
          <span>{mainInfo?.phone}</span>
        </InfoItem>
      </InfoWrap>
      <MyDiv
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
            fontSize: '16px',
          }}
          type="left-md"
        />
        <span
          style={{
            fontSize: '12px',
            fontWeight: 400,

            marginLeft: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {t('back')}
        </span>
      </MyDiv>
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
