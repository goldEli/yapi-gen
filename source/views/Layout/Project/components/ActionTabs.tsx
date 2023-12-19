import { ActionTabsWrap, ActionTabsMenuWrap, ActionTabsContent } from '../style'
import LabelEditor from './LabelEditor'

type ActionTabs = {
  activeKey: string
  items: Array<{ label: string; key: string; children: any }>
  onChange(key: string): void
}

const ActionTabs = (props: ActionTabs) => {
  const { activeKey, items, onChange } = props
  return (
    <ActionTabsWrap>
      <ActionTabsMenuWrap>
        {items.map((s: any) => (
          <LabelEditor
            onChange={onChange}
            item={s}
            activeKey={activeKey}
            key={s.key}
          />
        ))}
      </ActionTabsMenuWrap>
      <ActionTabsContent>
        {items.find((i: any) => i.key === activeKey)?.children}
      </ActionTabsContent>
    </ActionTabsWrap>
  )
}
export default ActionTabs
