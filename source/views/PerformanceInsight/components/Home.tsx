import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import Header from '../Header'
import {
  Col,
  RightRow,
  Time,
  TitleCss,
  Text,
  DataWrap,
  LotBox,
  TextNum,
  LotBoxRow,
  LotIcon,
} from '../Header/Style'
interface Props {
  title: string
  time: string
  type: string
  data: Array<{ num: number; icon: string; type: string }>
}
const WorkingStatus = (props: Props) => {
  return (
    <>
      <Col>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.time}</Time>
          </Space>
        </RightRow>
        <Text size={'12px'} onClick={() => 123}>
          <Space size={4}>
            <span>查看明细</span>
            <CommonIconFont
              type={'right'}
              size={14}
              color="var(--auxiliary-text-t2-d2)"
            />
          </Space>
        </Text>
      </Col>
      <DataWrap>
        {props.data.map(el => (
          <LotBox key={el.num}>
            <LotBoxRow>
              <LotIcon>
                <CommonIconFont
                  type={el.icon}
                  size={16}
                  color="var(--auxiliary-text-t2-d2)"
                />
              </LotIcon>
              <div>
                <TextNum>
                  <span>{el.num}</span>
                  <span>项</span>
                </TextNum>
                <Text
                  size={'12px'}
                  color={'var(--neutral-n2)'}
                  onClick={() => 123}
                >
                  <Space size={4}>
                    <span>{el.type}</span>
                    <CommonIconFont
                      type={'right'}
                      size={12}
                      color="var(--neutral-n2)"
                    />
                  </Space>
                </Text>
              </div>
            </LotBoxRow>
          </LotBox>
        ))}
      </DataWrap>
    </>
  )
}
const Home = () => {
  return (
    <>
      <Header />
      <WorkingStatus
        data={[
          { num: 120, type: '待修复', icon: 'right' },
          { num: 120, type: '待修复', icon: 'right' },
          { num: 120, type: '待修复', icon: 'right' },
        ]}
        title={'工作项现状'}
        time={'2023-03-01 ~ 2023-03-14'}
        type="Progress"
      />
      <div style={{ margin: '32px 0' }}>
        <WorkingStatus
          data={[{ num: 40, type: '缺陷修复露', icon: 'right' }]}
          title={'缺陷现状'}
          time={'2023-03-01 ~ 2023-03-14'}
          type="Defect"
        />
      </div>
    </>
  )
}
export default Home
