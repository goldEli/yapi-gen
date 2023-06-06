import MyBreadcrumb from '@/components/MyBreadcrumb'
import {
  ButtonGroup,
  DetailTabItem,
  DetailText,
  DetailTitle,
  DetailTop,
  ItemNumber,
  Wrap,
} from './style'
import CommonButton from '@/components/CommonButton'
import { Tabs, TabsProps, Tooltip } from 'antd'
import CommonIconFont from '@/components/CommonIconFont'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { useState } from 'react'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { copyLink, getIdByUrl, getProjectIdByUrl } from '@/tools'
import { getIterateInfo } from '@store/iterate/iterate.thunk'
import ChangeRecord from './components/ChangeRecord'
import Achieve from './components/Achieve'
import Flaw from './components/Flaw'
import Demand from './components/Demand'
import Overview from './components/Overview'

const IterationDetail = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [tabActive, setTabActive] = useState('1')
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { iterateInfo } = useSelector(store => store.iterate)

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    if (value === '1') {
      dispatch(
        getIterateInfo({
          projectId: getProjectIdByUrl(),
          id: getIdByUrl('iterateId'),
        }),
      )
    }
  }

  // 复制标题
  const onCopy = () => {
    copyLink(iterateInfo.name, '复制成功！', '复制失败！')
  }

  // 返回
  const onBack = () => {
    history.go(-1)
  }

  // 编辑
  const onEdit = () => {
    //
  }

  // 删除
  const onDelete = () => {
    //
  }

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <DetailTabItem>
          <span>迭代概况</span>
        </DetailTabItem>
      ),
      children: <Overview activeKey={tabActive} />,
    },
    {
      key: '2',
      label: (
        <DetailTabItem>
          <span>需求</span>
          <ItemNumber isActive={tabActive === '2'}>
            {iterateInfo?.childCount || 0}
          </ItemNumber>
        </DetailTabItem>
      ),
      children: <Demand activeKey={tabActive} />,
    },
    {
      key: '3',
      label: (
        <DetailTabItem>
          <span>缺陷</span>
        </DetailTabItem>
      ),
      children: <Flaw activeKey={tabActive} />,
    },
    {
      key: '4',
      label: (
        <DetailTabItem>
          <span>迭代成果</span>
        </DetailTabItem>
      ),
      children: <Achieve activeKey={tabActive} />,
    },
    {
      key: '5',
      label: (
        <DetailTabItem>
          <span>变更记录</span>
          <ItemNumber isActive={tabActive === '5'}>
            {iterateInfo?.changeCount || 0}
          </ItemNumber>
        </DetailTabItem>
      ),
      children: <ChangeRecord activeKey={tabActive} />,
    },
  ]
  return (
    <Wrap>
      <DetailTop>
        <MyBreadcrumb />
        <ButtonGroup size={16}>
          <CommonButton type="icon" icon="left-md" onClick={onBack} />
          <CommonButton type="icon" icon="edit" onClick={onEdit} />
          <CommonButton type="icon" icon="delete" onClick={onDelete} />
        </ButtonGroup>
      </DetailTop>
      <DetailTitle>
        <DetailText>
          <span className="name">{iterateInfo.name}</span>
          <span className="icon" onClick={onCopy}>
            <CommonIconFont type="copy" color="var(--neutral-n3)" />
          </span>
        </DetailText>
      </DetailTitle>
      <Tabs
        className="tabs"
        activeKey={tabActive}
        items={tabItems}
        onChange={onChangeTabs}
      />
    </Wrap>
  )
}

export default IterationDetail
