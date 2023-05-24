import React, { useEffect, useRef, useState } from 'react'
import GuideModal from '@/components/GuideModal'
import guide_1 from './img/guide_1.png'
import guide_2 from './img/guide_2.png'
import guide_3 from './img/guide_3.png'
import { useTranslation } from 'react-i18next'
import { setGuideVisible } from '@store/sprint'
import { useDispatch, useSelector } from '@store/index'
import styled from '@emotion/styled'
import InputSearch from '@/components/InputSearch'
import {
  CloseWrap,
  DragLine,
  MouseDom,
  SelectWrapBedeck,
} from '@/components/StyleCommon'
import TabItem from './components/TabItem'
import IconFont from '@/components/IconFont'
import { Popover, Tooltip } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import DndKitTable from './components/DndKitTable'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CreateSprintModal from './components/CreateSprintModal'
import CompleteSprintModal from './components/CompleteSprintModal'

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
  height: 100%;
  border-right: ${props =>
    props.active ? '1px solid transparent' : '1px solid var(--neutral-n6-d1)'};
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0px 24px;
  }
  padding-bottom: 52px;
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
  width: 84px;
  height: 32px;
  display: flex;
  align-items: center;
  .line {
    width: 0px;
    height: 16px;
    opacity: 1;
    border: 1px solid var(--neutral-n6-d1);
    margin: 0px 10px;
  }
  .filter {
    width: 120px;
    height: 104px;
    background: #ffffff;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    border-radius: 6px 6px 6px 6px;
    cursor: pointer;
    .item {
      height: 32px;
      padding: 0px 16px;
      font-size: 14px;
      font-family: MiSans-Regular, MiSans;
      font-weight: 400;
      color: var(--neutral-n2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover {
        background: var(--hover-d3);
      }
    }
    .active {
      color: var(--primary-d2);
    }
  }
`
const IconWrap = styled(IconFont)<{ isActive: any }>(
  {
    fontSize: 20,
    color: 'var(--neutral-n3)',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    '&: hover': {
      color: 'var(--neutral-n1-d1)',
      background: 'var(--hover-d3)',
    },
  },
  ({ isActive }) => ({
    color: isActive ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)',
    background: isActive ? 'var(--hover-d3)' : 'white',
  }),
)

const IconBox = styled(IconFont)({
  fontSize: 20,
  color: 'var(--neutral-n3)',
  cursor: 'pointer',
  padding: 6,
  borderRadius: 6,
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--hover-d3)',
  },
})

const TabItemWrap = styled.div`
  height: 100%;
  padding: 0px 24px;
  overflow: scroll;
`

const Right = styled.div`
  padding: 0px 24px;
  overflow-y: scroll;
  flex: 1;
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 24px;
  }
`
const SelectWrapForList = styled(SelectWrapBedeck)`
  margin-left: 16px;
`
const ClearButton = styled.div`
  width: 56px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--primary-d2);
  line-height: 22px;
  margin-left: 24px;
  white-space: nowrap;
  cursor: pointer;
`
const DragContent = styled.div``

const filterList = [
  {
    id: 0,
    name: '未完成的',
  },
  {
    id: 1,
    name: '已完成的',
  },
  {
    id: 2,
    name: '全部冲刺',
  },
]

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
  const [isExpand, setIsExpand] = useState(true)
  const [isFilter, setIsFilter] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(filterList[0])
  const [sprintModal, setSprintModal] = useState<{
    visible: boolean
    type: any
  }>({
    visible: false,
    type: 'create',
  })
  const [completeVisible, setCompleteVisible] = useState(true)

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

  const onChangeFilter = (item: any) => {
    setCurrentFilter(item)
    setIsFilter(false)
  }

  const filterContent = (
    <div className="filter">
      {filterList.map((item: any) => (
        <div
          className={`item ${item.id === currentFilter.id ? 'active' : ''}`}
          key={item.id}
          onClick={() => onChangeFilter(item)}
        >
          {item.name}
          <IconFont
            className="icon"
            type={currentFilter.id === item.id ? 'check' : ''}
          />
        </div>
      ))}
    </div>
  )

  const onVisibleChange = (visible: any) => {
    setIsFilter(visible)
  }

  return (
    <div>
      <SearchBox>
        <MyBreadcrumb />
        <div>
          <InputSearch
            onChangeSearch={setSearchValue}
            placeholder="搜索事务或描述"
            leftIcon
          />
        </div>
      </SearchBox>
      <ContentWrap>
        {isExpand ? (
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
                <CloseWrap
                  width={24}
                  height={24}
                  onClick={() => {
                    setSprintModal({
                      visible: true,
                      type: 'create',
                    })
                  }}
                >
                  <IconFont
                    style={{
                      fontSize: 18,
                      color: 'var(--neutral-n3)',
                    }}
                    type="plus"
                  />
                </CloseWrap>
                <div className="line" />
                <Popover
                  trigger="click"
                  placement="bottomRight"
                  content={filterContent}
                  getPopupContainer={node => node}
                  visible={isFilter}
                  onVisibleChange={onVisibleChange}
                >
                  <Tooltip title={t('common.search')}>
                    <IconWrap type="filter" isActive={isFilter} />
                  </Tooltip>
                </Popover>
              </RightIcon>
            </div>
            <TabItemWrap>
              <TabItem />
            </TabItemWrap>
          </Left>
        ) : null}
        <Right>
          <div className="header">
            {isExpand ? (
              <Tooltip
                style={{ display: isExpand ? 'block' : 'none' }}
                onVisibleChange={() => {}}
                getTooltipContainer={node => node}
                title={isExpand ? t('common.collapseMenu') : ''}
              >
                <IconBox
                  onClick={() => {
                    setIsExpand(false)
                  }}
                  type="outdent"
                  color="black"
                />
              </Tooltip>
            ) : (
              <Tooltip
                style={{ display: isExpand ? 'none' : 'block' }}
                onVisibleChange={() => {}}
                getTooltipContainer={node => node}
                title={isExpand ? '' : t('common.openMenu')}
              >
                <IconBox
                  onClick={() => {
                    setIsExpand(true)
                  }}
                  type="indent"
                  color="black"
                />
              </Tooltip>
            )}
            <SelectWrapForList>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>经办人</span>
              <CustomSelect
                style={{ width: 148 }}
                getPopupContainer={(node: any) => node}
                allowClear
                optionFilterProp="label"
                showArrow
                showSearch
                value=""
                options={[]}
                onChange={() => {}}
                onConfirm={() => null}
              />
            </SelectWrapForList>
            <SelectWrapForList>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                事务类型
              </span>
              <CustomSelect
                style={{ width: 148 }}
                getPopupContainer={(node: any) => node}
                allowClear
                optionFilterProp="label"
                showArrow
                showSearch
                value=""
                options={[]}
                onChange={() => {}}
                onConfirm={() => null}
              />
            </SelectWrapForList>
            <ClearButton onClick={() => {}}>
              {t('common.clearForm')}
            </ClearButton>
          </div>
          <DragContent>
            <DndKitTable />
          </DragContent>
        </Right>
      </ContentWrap>
      <GuideModal
        width={784}
        height={670}
        visible={guideVisible}
        inform={inform}
        close={() => dispatch(setGuideVisible(false))}
      />
      <CreateSprintModal
        type={sprintModal.type}
        visible={sprintModal.visible}
        onClose={() =>
          setSprintModal({
            visible: false,
            type: 'create',
          })
        }
      />
      <CompleteSprintModal
        visible={completeVisible}
        onClose={() => {
          setCompleteVisible(false)
        }}
      />
    </div>
  )
}
export default SprintProjectSprint