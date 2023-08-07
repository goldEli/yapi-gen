import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
import MultipleAvatar from '../MultipleAvatar'
import { useDispatch, useSelector } from '@store/index'
import TableQuickEdit from '../TableQuickEdit'
import { useTranslation } from 'react-i18next'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`

const TopInfoWrap = styled.div`
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
    align-items: center;
    min-height: 32px;
    .title {
      color: var(--neutral-n3);
      margin-right: 8px;
    }
  }
`

interface DrawerTopInfoProps {
  details: any
  onUpdate?(): void
}

const DrawerTopInfo = (props: DrawerTopInfoProps) => {
  const [t] = useTranslation()
  const { drawerCanOperation } = useSelector(store => store.project)

  return (
    <Wrap>
      <TopInfoWrap>
        <span className="icon">
          <CommonIconFont type="time" size={16} color="var(--neutral-n3)" />
        </span>
        <span className="box">
          <span className="label" style={{ marginRight: 16 }}>
            {t('common.cycle')}
          </span>
          <div className="box" style={{ marginRight: 80 }}>
            <span className="title">{t('common.start')}</span>
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
          </div>
          <div className="box">
            <span className="title">{t('common.end')}</span>
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
          </div>
        </span>
      </TopInfoWrap>
      <TopInfoWrap>
        <span className="icon">
          <CommonIconFont
            type="user-alone"
            size={16}
            color="var(--neutral-n3)"
          />
        </span>
        <span className="box">
          <span className="label" style={{ marginRight: 16 }}>
            {t('common.dealName')}
          </span>
          <span>
            <TableQuickEdit
              item={{
                ...props.details,
                ...{ categoryConfigList: drawerCanOperation },
              }}
              isInfo
              keyText="users"
              type="fixed_select"
              defaultText={props.details?.user.map((i: any) => i.user_id) || []}
              onUpdate={props.onUpdate}
            >
              <MultipleAvatar
                max={3}
                list={props.details?.user?.map((i: any) => ({
                  id: i.user.id,
                  name: i.user.name,
                  avatar: i.user.avatar,
                }))}
              />
            </TableQuickEdit>
          </span>
        </span>
      </TopInfoWrap>
    </Wrap>
  )
}

export default DrawerTopInfo
