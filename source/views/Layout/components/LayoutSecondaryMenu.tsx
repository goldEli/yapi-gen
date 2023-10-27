import CommonIconFont from '@/components/CommonIconFont'
import { LayoutMenuWrap, MoreMenuWrap } from '../style'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useSelector } from '@store/index'
import { useLocation, useNavigate } from 'react-router-dom'

interface LayoutSecondaryMenuProps {
  width: number
}

const LayoutSecondaryMenu = (props: LayoutSecondaryMenuProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [items, setItems] = useState<any>([])
  const { currentMenu } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)

  // 点击切换tab
  const handleModeChange = (e: any) => {
    navigate(items?.filter((i: any) => i.id ?? i.key === Number(e))[0]?.url)
  }

  useEffect(() => {
    // 如果有第二级菜单显示
    if (currentMenu?.children?.length > 0) {
      setItems([...currentMenu?.children])
    } else if (routerPath.pathname.includes('/ProjectDetail')) {
      // 显示项目下的菜单，例需求
      const resultMenu = [
        // { key: 'map', name: '导图', url: '', isPermisson: true  },
        {
          key: 'iteration',
          name: '迭代',
          url: '',
          isPermisson:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('迭代'),
            ).length > 0,
        },
        {
          key: 'demand',
          name: '需求',
          url: '',
          isPermisson:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('需求'),
            ).length > 0,
        },
        {
          key: 'defect',
          name: '缺陷',
          url: '',
          isPermisson:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('缺陷'),
            ).length > 0,
        },
        {
          key: 'affairs',
          name: '事务',
          url: '',
          isPermisson:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('事务'),
            ).length > 0,
        },
        {
          key: 'sprint',
          name: '冲刺',
          url: '',
          isPermisson:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('冲刺'),
            ).length > 0,
        },
        {
          key: 'kanBan',
          name: 'Kanban',
          url: '',
          isPermisson:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('Kanban'),
            ).length > 0,
        },
        // { key: 'gatte', name: '甘特图', url: '', isPermisson: true  },
        { key: 'workTime', name: '工时', url: '', isPermisson: true },
        { key: 'report', name: '报表', url: '', isPermisson: true },
        {
          key: 'member',
          name: '成员',
          url: '',
          isPermisson:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.identity).includes('b/project/member'),
            ).length > 0,
        },
        {
          key: 'set',
          name: '设置',
          url: '',
          isPermisson:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('项目设置'),
            ).length > 0,
        },
      ]
      setItems(resultMenu?.filter((i: any) => i.isPermisson))
      console.log(projectInfo)
    } else {
      setItems([])
    }
  }, [currentMenu, routerPath])

  return (
    <LayoutMenuWrap
      defaultActiveKey="1"
      tabPosition="top"
      getPopupContainer={n => n}
      onChange={handleModeChange}
      width={props.width + 120}
      moreIcon={
        <MoreMenuWrap>
          <div>{t('more')}</div>
          <CommonIconFont type="down" size={16} />
        </MoreMenuWrap>
      }
      items={items.map((i: any) => {
        return {
          label: i.name,
          key: i.id ? String(i.id) : i.key,
        }
      })}
    />
  )
}

export default LayoutSecondaryMenu
