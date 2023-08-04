import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
import MultipleAvatar from '../MultipleAvatar'

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
    .title {
      color: var(--neutral-n3);
      margin-right: 16px;
    }
  }
`

interface DrawerTopInfoProps {
  details: any
}

const DrawerTopInfo = (props: DrawerTopInfoProps) => {
  return (
    <Wrap>
      <TopInfoWrap>
        <span className="icon">
          <CommonIconFont type="time" size={16} color="var(--neutral-n3)" />
        </span>
        <span className="box">
          <span className="label" style={{ marginRight: 16 }}>
            周期
          </span>
          <div className="box">
            <span className="title">预计开始 时间----</span>
          </div>
          <div className="box">
            <span className="title">预计结束 时间----</span>
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
            处理人
          </span>
          <MultipleAvatar
            max={3}
            list={props.details?.user?.map((i: any) => ({
              id: i.user.id,
              name: i.user.name,
              avatar: i.user.avatar,
            }))}
          />
        </span>
      </TopInfoWrap>
    </Wrap>
  )
}

export default DrawerTopInfo
