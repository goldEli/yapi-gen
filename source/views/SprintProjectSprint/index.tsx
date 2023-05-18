import React, { useRef, useState } from 'react'
import GuideModal from '@/components/GuideModal'
import guide_1 from './img/guide_1.png'
import guide_2 from './img/guide_2.png'
import guide_3 from './img/guide_3.png'
import { useTranslation } from 'react-i18next'
import { setGuideVisible } from '@store/sprint'
import { useDispatch, useSelector } from '@store/index'
import styled from '@emotion/styled'
import CommonBreadCrumd from '@/components/CommonBreadcrumd'
import InputSearch from '@/components/InputSearch'
import { CloseWrap, DragLine, MouseDom } from '@/components/StyleCommon'
import TabItem from './components/TabItem'
import IconFont from '@/components/IconFont'

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 20px 24px 20px 24px;
`
const ContentWrap = styled.div`
  display: flex;
  height: calc(100vh - 130px);
  position: relative;
`

const Left = styled.div<{ active: boolean }>`
  min-width: 316px;
  box-sizing: border-box;
  padding: 0px 24px;
  height: 100%;
  border-right: ${props =>
    props.active ? '1px solid transparent' : '1px solid var(--neutral-n6-d1)'};
  .header {
    display: flex;
    justify-content: space-between;
  }
`
const TabsWrap = styled.div`
  width: 128px;
  height: 32px;
  box-sizing: border-box;
  padding-left: 2px;
  margin-bottom: 16px;
  background: var(--hover-d2);
  border-radius: 4px 4px 4px 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--neutral-n2);
  cursor: pointer;
  .tab1 {
    width: 56px;
    height: 28px;
    line-height: 28px;
    text-align: center;
  }
  .tab2 {
    line-height: 28px;
    text-align: center;
    width: 68px;
    height: 28px;
  }
  .active {
    background: #ffffff;
    color: var(--primary-d2);
  }
`

const RightIcon = styled.div`
  display: flex;
  align-items: center;
  .line {
    width: 0px;
    height: 16px;
    opacity: 1;
    border: 1px solid var(--neutral-n6-d1);
    margin: 0px 10px;
  }
`

const TabItemWrap = styled.div``

const Right = styled.div``

interface IProps {}
const SprintProjectSprint: React.FC<IProps> = props => {
  const dispatch = useDispatch()
  const { guideVisible } = useSelector(store => store.sprint)
  const [t] = useTranslation()
  const [searchValue, setSearchValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [endWidth, setEndWidth] = useState<any>()
  const leftRef = useRef<any>()
  const [activeKey, setActiveKey] = useState(0)
  const inform = [
    {
      key: 0,
      title: '开始冲刺前的第一步',
      desc: '这里可以为积压的工作创建一个工作目标，提前来规划您的工作',
      img: guide_1,
    },
    {
      key: 1,
      title: '开始冲刺前的第二步',
      desc: '点击编辑冲刺，为您的冲刺团队准备好目标规则，开始工作吧',
      img: guide_2,
    },
    {
      key: 2,
      title: '开始冲刺前的第三步',
      desc: '为冲刺添加积压的工作，并点击开始冲刺来完成冲刺目标；另外您还可以为事务加上长故事定制功能集',
      img: guide_3,
    },
  ]

  // 拖动线条
  const onDragLine = () => {
    const startX = leftRef.current?.getBoundingClientRect()?.x
    let width: any
    document.onmousemove = e => {
      setFocus(true)
      width = e.clientX - startX
      setEndWidth(width - 4 < 316 ? 312 : width - 4)
      leftRef.current.style.transition = '0s'
    }
    document.onmouseup = () => {
      if (leftRef && leftRef.current) {
        leftRef.current.style.width = `${Number(width)}px`
        leftRef.current.style.transition = 'all 0.3s'
      }
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  const changeSprintTab = () => {
    setActiveKey(0)
  }

  const changeStoryTab = () => {
    setActiveKey(1)
  }
  return (
    <div>
      <SearchBox>
        <CommonBreadCrumd></CommonBreadCrumd>
        <div>
          <InputSearch
            onChangeSearch={setSearchValue}
            placeholder="搜索事务或描述"
            leftIcon
          />
        </div>
      </SearchBox>
      <ContentWrap>
        <Left ref={leftRef} active={focus}>
          <MouseDom
            active={focus}
            onMouseDown={onDragLine}
            style={{ left: endWidth ? endWidth : 312 }}
          >
            <DragLine active={focus} className="line" />
          </MouseDom>
          <div className="header">
            <TabsWrap>
              <div
                className={`tab1 ${activeKey === 0 ? 'active' : ''}`}
                onClick={changeSprintTab}
              >
                冲刺
              </div>
              <div
                className={`tab2 ${activeKey === 1 ? 'active' : ''}`}
                onClick={changeStoryTab}
              >
                长故事
              </div>
            </TabsWrap>
            <RightIcon>
              <CloseWrap width={24} height={24}>
                <IconFont
                  style={{
                    fontSize: 18,
                    color: 'var(--neutral-n3)',
                  }}
                  type="plus"
                />
              </CloseWrap>
              <div className="line" />
            </RightIcon>
          </div>
          <TabItemWrap>
            <TabItem />
          </TabItemWrap>
        </Left>
        <Right></Right>
      </ContentWrap>
      <GuideModal
        width={784}
        height={670}
        visible={guideVisible}
        inform={inform}
        close={() => dispatch(setGuideVisible(false))}
      />
    </div>
  )
}
export default SprintProjectSprint
