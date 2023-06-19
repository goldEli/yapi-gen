// 关联工作项下拉菜单
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
}

const RelationDropdownMenu = (props: Props) => {
  const [t] = useTranslation()

  // 复制需求id
  const onCopyId = () => {
    copyLink(`${props?.record.storyPrefixKey}`, '复制成功！', '复制失败！')
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: props.record.project_id,
        demandId: props.record.id,
      }),
    )
    const url = `/ProjectManagement/DemandDetail?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(text, t('common.copySuccess'), t('common.copyFail'))
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
      label: <div onClick={onCopyId}>复制编号</div>,
    },
    {
      key: '3',
      label: <div onClick={onCopyLink}>复制链接</div>,
    },
  ]

  return <MenuWrap style={{ minWidth: 56 }} items={menuItems} />
}

export default RelationDropdownMenu
