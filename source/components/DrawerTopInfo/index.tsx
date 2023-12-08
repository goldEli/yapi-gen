/* eslint-disable react/jsx-no-leaked-render */
import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
import MultipleAvatar from '../MultipleAvatar'
import { useSelector } from '@store/index'
import TableQuickEdit from '../TableQuickEdit'
import { useTranslation } from 'react-i18next'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`

const TopInfoWrap = styled.div<{ isEmployeeProfilePage: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 16px;
  font-size: 14px;
  .icon {
    margin-right: 8px;
    display: inline;
    margin-top: 2px;
  }
  .label {
    font-family: SiYuanMedium;
  }
  .box {
    display: flex;
    align-items: ${props =>
      props.isEmployeeProfilePage ? 'flex-start' : 'center'};
    min-height: 32px;
    .title {
      color: var(--neutral-n3);
      margin-right: 8px;
    }
  }
`

const ParticipantsWrap = styled.div`
  display: flex;
  flex-direction: column;
`

const UserAvatarWrap = styled.div`
  display: flex;
  align-items: center;
  height: max-content;
  margin-bottom: 8px;
  cursor: pointer;
  .name {
    display: flex;
    align-items: center;
    line-height: 24px;
    border-bottom: 1px solid transparent;
  }
  &:hover {
    .name {
      border-bottom: 1px solid var(--primary-d1);
    }
  }
`

const AvatarBox = styled.div`
  border-radius: 50%;
  display: flex;
  width: 24px;
  height: 24px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`

const NameWrap = styled.div`
  margin-left: 8px;
  font-size: 14px;
  font-family: SiYuanRegular;
  color: var(--primary-d2);
  max-width: 304px;
  white-space: wrap;
`

interface DrawerTopInfoProps {
  details: any
  onUpdate?(): void
  isPreview?: boolean
  // 用于员工概况查看过滤当前处理人
  userId?: number
}

interface ParticipantsUserProps {
  avatar?: string
  name?: string
  id?: number
  // 当前任务详情数据
  details?: any
  userInfo?: any
}

const ParticipantsUser = (props: ParticipantsUserProps) => {
  const { theme } = useSelector(store => store.global)
  const [openDemandDetail] = useOpenDemandDetail()

  // 打开任务详情弹层
  const onToDetail = () => {
    openDemandDetail(
      {
        ...props.details,
        ...{
          projectId: props.details.project_id ?? props.details?.projectId,
          employeeCurrentId: props?.id,
        },
      },
      props.details.project_id ?? props.details?.projectId,
      props.details.id,
      props.details.project_type === 2 ? 1 : props.details.is_bug === 1 ? 2 : 3,
      true,
      true,
    )
  }

  return (
    <UserAvatarWrap onClick={onToDetail}>
      <AvatarBox>
        {props.avatar && <img src={props.avatar} />}
        {!props.avatar && theme === 1 && (
          <img src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/dark.pnp" />
        )}
        {!props.avatar && theme === 0 && (
          <img src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/light.png" />
        )}
      </AvatarBox>
      <div className="name">
        {props.name && <NameWrap>{props?.name}</NameWrap>}
        {props.userInfo?.user?.department?.id && (
          <NameWrap style={{ marginLeft: 0 }}>
            -{props.userInfo?.user?.department?.name}
          </NameWrap>
        )}
        {props.userInfo?.user?.position?.id && (
          <NameWrap style={{ marginLeft: 0 }}>
            -{props.userInfo?.user?.position?.name}
          </NameWrap>
        )}
      </div>
    </UserAvatarWrap>
  )
}

const DrawerTopInfo = (props: DrawerTopInfoProps) => {
  const [t] = useTranslation()
  const { drawerCanOperation } = useSelector(store => store.project)
  const isEmployeeProfilePage = location.pathname === '/EmployeeProfile'
  return (
    <Wrap>
      <TopInfoWrap
        style={{
          backgroundColor: 'white',
          margin: 0,
          padding: '0px 24px 0px 24px',
        }}
        isEmployeeProfilePage={isEmployeeProfilePage}
      >
        <span className="icon">
          <CommonIconFont type="time" size={16} color="var(--neutral-n3)" />
        </span>
        <span className="box">
          <span className="label" style={{ marginRight: 16 }}>
            {t('common.cycle')}
          </span>
          <div className="box" style={{ marginRight: 80 }}>
            <span className="title">{t('common.start')}</span>
            {props.isPreview ? (
              <span>{props.details?.expectedStart || '--'}</span>
            ) : (
              <span>
                <TableQuickEdit
                  item={{
                    ...props.details,
                    ...{ categoryConfigList: drawerCanOperation },
                  }}
                  isInfo
                  keyText="expected_start_at"
                  type="date"
                  value={['datetime']}
                  defaultText={props.details?.expectedStart || null}
                  onUpdate={props.onUpdate}
                >
                  <span>{props.details?.expectedStart || '--'}</span>
                </TableQuickEdit>
              </span>
            )}
          </div>
          <div className="box">
            <span className="title">{t('common.end')}</span>
            {props.isPreview ? (
              <span>{props.details?.expectedEnd || '--'}</span>
            ) : (
              <span>
                <TableQuickEdit
                  item={{
                    ...props.details,
                    ...{ categoryConfigList: drawerCanOperation },
                  }}
                  isInfo
                  keyText="expected_end_at"
                  type="date"
                  value={['datetime']}
                  defaultText={props.details?.expectedEnd || null}
                  onUpdate={props.onUpdate}
                >
                  <span>{props.details?.expectedEnd || '--'}</span>
                </TableQuickEdit>
              </span>
            )}
          </div>
        </span>
      </TopInfoWrap>
      {props?.userId &&
      props.details?.user?.filter((k: any) => k.user.id !== props?.userId)
        ?.length ? (
        <TopInfoWrap
          style={{
            backgroundColor: 'white',
            margin: 0,
            padding: '12px 24px 0px 24px',
            alignItems: 'flex-start',
          }}
          isEmployeeProfilePage={isEmployeeProfilePage}
        >
          <span className="icon">
            <CommonIconFont type="user" size={16} color="var(--neutral-n3)" />
          </span>
          <span className="box">
            {/* 如果有当前处理人id则显示参与人 */}
            {props?.userId && (
              <>
                <span className="label" style={{ marginRight: 16 }}>
                  {t('participants')}
                </span>
                <ParticipantsWrap>
                  {(
                    props.details?.user?.filter(
                      (k: any) => k.user.id !== props?.userId,
                    ) ?? []
                  )?.map((i: any) => (
                    <ParticipantsUser
                      key={i.user.id}
                      name={i.user.name}
                      avatar={i.user?.avatar}
                      details={props.details}
                      id={i.user.id}
                      userInfo={i}
                    />
                  ))}
                </ParticipantsWrap>
              </>
            )}
            {!props?.userId && (
              <>
                <span className="label" style={{ marginRight: 16 }}>
                  {t('common.dealName')}
                </span>
                {props.isPreview ? (
                  <MultipleAvatar
                    max={3}
                    list={(props.details?.user ?? [])?.map((i: any) => ({
                      id: i.user.id,
                      name: i.user.name,
                      avatar: i.user.avatar,
                    }))}
                  />
                ) : (
                  <span>
                    <TableQuickEdit
                      item={{
                        ...props.details,
                        ...{ categoryConfigList: drawerCanOperation },
                      }}
                      isInfo
                      keyText="users"
                      type="fixed_select"
                      defaultText={
                        props.details?.user?.map((i: any) => i.user.id) || []
                      }
                      onUpdate={props.onUpdate}
                    >
                      <MultipleAvatar
                        max={3}
                        list={(props.details?.user ?? [])?.map((i: any) => ({
                          id: i.user.id,
                          name: i.user.name,
                          avatar: i.user.avatar,
                        }))}
                      />
                    </TableQuickEdit>
                  </span>
                )}
              </>
            )}
          </span>
        </TopInfoWrap>
      ) : null}
    </Wrap>
  )
}

export default DrawerTopInfo
