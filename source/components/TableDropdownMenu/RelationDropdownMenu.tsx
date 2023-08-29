// 关联任务下拉菜单
import { copyLink, getIsPermission } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Menu } from 'antd'
import { useTranslation } from 'react-i18next'

const MenuWrap = styled(Menu)`
  border-radius: 6px;
  padding: 4px 0;
  li {
    height: 32px !important;
    line-height: 32px !important;
    margin: 0 !important;
    color: var(--neutral-n2) !important;
    background: var(---neutral-white-d3) !important;
  }
  li:hover {
    color: var(--neutral-n1-d1) !important;
    background: var(--hover-d3) !important;
  }
`

interface Props {
  record: any
  onDeleteChange(row: any): void
  // 1是事务，2是缺陷，3是需求
  type: 1 | 2 | 3
}

const RelationDropdownMenu = (props: Props) => {
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const pid = useSelector(store => store.project.projectInfo.id)

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  // 复制需求id
  const onCopyId = () => {
    copyLink(
      `${props?.record.story_prefix_key ?? props?.record.storyPrefixKey} `,
      t('copysuccess'),
      t('copyfailed'),
    )
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: pid,
        detailId: props.record.id,
        specialType: props.type,
        isOpenScreenDetail: true,
      }),
    )
    let url
    if (props.type === 1) {
      url = `/SprintProjectManagement/Affair?data=${params}`
    } else if (props.type === 2) {
      url = `/ProjectManagement/Defect?data=${params}`
    } else {
      url = `/ProjectManagement/Demand?data=${params}`
    }
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${
        props?.record.story_prefix_key ?? props?.record.storyPrefixKey
      }】${text}`,
      t('common.copySuccess'),
      t('common.copyFail'),
    )
  }

  let menuItems = [
    {
      key: '1',
      label: (
        <div onClick={() => props.onDeleteChange(props.record)}>
          {t('common.del')}
        </div>
      ),
    },
    {
      key: '2',
      label: <div onClick={onCopyId}>{t('copy_requirement_number')}</div>,
    },
    {
      key: '3',
      label: <div onClick={onCopyLink}>{t('copy_title_link')}</div>,
    },
  ]

  return (
    <MenuWrap
      style={{ minWidth: 56 }}
      items={isEnd ? menuItems?.filter((i: any) => i.key !== '1') : menuItems}
    />
  )
}

export default RelationDropdownMenu
