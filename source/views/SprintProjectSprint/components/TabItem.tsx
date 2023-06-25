import styled from '@emotion/styled'
import { Checkbox, Progress } from 'antd'
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { setCheckList } from '@store/sprint'

const Item = styled.div`
  cursor: pointer;
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid var(--neutral-n6-d1);
  box-sizing: border-box;
  padding: 16px;
  margin-bottom: 16px;
  &:hover {
    border: 1px solid var(--primary-d1);
  }
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: var(--neutral-n1-d1);
    line-height: 22px;
    margin-right: 5px;
  }
  .date {
    font-size: 12px;
    font-family: MiSans-Regular, MiSans;
    color: var(--neutral-n4);
    line-height: 20px;
  }
  .progress {
    display: flex;
    justify-content: space-between;
    .iconBox {
      display: flex;
      align-items: center;
    }
    .text {
      color: var(--neutral-n2);
      font-size: 14px;
      font-family: MiSans-Regular, MiSans;
    }
  }
`
const NoSprintButton = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  height: 52px;
  background: var(--neutral-white-d4);
  border-radius: 6px 6px 6px 6px;
  border: ${(props: any) =>
    props?.isActive
      ? '1px solid var(--primary-d1)'
      : '1px solid var(--neutral-n6-d1)'};
  line-height: 52px;
  text-align: center;
  font-size: 14px;
  font-family: MiSans-Regular, MiSans;
  font-weight: 400;
  color: var(--neutral-n2);
  &:hover {
    border: 1px solid var(--primary-d1);
  }
`

const TabItem = (props: any) => {
  const { data } = props
  const { checkList } = useSelector(state => state.sprint)
  const dispatch = useDispatch()
  return (
    <div>
      {data?.list?.map((item: any, idx: number) => (
        <Item
          key={item.id}
          onClick={() => {
            const temp = [...checkList]
            temp[idx] = !temp[idx]
            dispatch(setCheckList(temp))
          }}
        >
          <div className="title">
            <span>{item.name}</span>
            <Checkbox
              checked={checkList[idx]}
              // onChange={e => {
              //   const temp = [...checkList]
              //   temp[idx] = e.target.checked
              //   dispatch(setCheckList(temp))
              //   // // 存储本地缓存 上次操作选中的
              //   // localStorage.setItem(
              //   //   encryptPhp(JSON.stringify({ id: userInfo.id })),
              //   //   JSON.stringify({
              //   //     checkList: temp,
              //   //     activeKey,
              //   //     currentFilter,
              //   //   }),
              //   // )
              // }}
            />
          </div>
          <div className="date">
            {item.start_at && item.end_at
              ? `${item.start_at} ~ ${item.end_at}`
              : '--'}
          </div>
          <div className="progress">
            <div className="iconBox">
              <IconFont
                type="recover"
                style={{
                  fontSize: 16,
                  marginLeft: 2,
                  color: 'var(--neutral-n3)',
                }}
              />
              <span className="text">{`${item.story_finish_count}/${item.story_count}`}</span>
              <IconFont
                type="branch"
                style={{
                  fontSize: 16,
                  marginLeft: 12,
                  marginRight: 5,
                  color: 'var(--neutral-n3)',
                }}
              />
              <span className="text">{item.child_story_total}</span>
            </div>
            <div style={{ width: 76 }}>
              <Progress
                strokeColor="var(--function-success)"
                percent={
                  item.story_finish_count === 0
                    ? 0
                    : Number(
                        (
                          (item.story_finish_count / item.story_count) *
                          100
                        ).toFixed(0),
                      )
                }
                size="small"
                trailColor="var(--neutral-n6-d2)"
              />
            </div>
          </div>
        </Item>
      ))}
      <NoSprintButton
        isActive={props?.checkCommission}
        onClick={() => props?.setCheckCommission?.(!props?.checkCommission)}
      >{`未创建冲刺的事务（${data.unassigned_count}）`}</NoSprintButton>
    </div>
  )
}

export default TabItem
