import { Editor } from '@tiptap/react'
import { Menu } from 'antd'
import { Wrap } from './style'

export const MENU_ID = '0'

const enum MenuType {
  MERGE,
  SPLIT,
  INSERT_ROW_BEFORE,
  INSERT_ROW_AFTER,
  INSERT_COLUMN_BEFORE,
  INSERT_COLUMN_AFTER,
  DELETE_ROWS,
  DELETE_COLUMNS,
  DELETE_TABLE,
}

const menuOptions = [
  {
    label: '合并单元格',
    key: MenuType.MERGE,
  },
  {
    label: '拆分单元格',
    key: MenuType.SPLIT,
  },
  {
    label: '上方插入一行',
    key: MenuType.INSERT_ROW_BEFORE,
  },
  {
    label: '下方插入一行',
    key: MenuType.INSERT_ROW_AFTER,
  },
  {
    label: '左侧插入一列',
    key: MenuType.INSERT_COLUMN_BEFORE,
  },
  {
    label: '右侧插入一列',
    key: MenuType.INSERT_COLUMN_AFTER,
  },
  {
    label: '删除所在行',
    key: MenuType.DELETE_ROWS,
  },
  {
    label: '删除所在列',
    key: MenuType.DELETE_COLUMNS,
  },
  {
    label: '删除表格',
    key: MenuType.DELETE_TABLE,
  },
]

type WordTableContextMenuProps = {
  editor?: Editor | null
  id: number
}

const WordTableContextMenu = (props: WordTableContextMenuProps) => {
  const onClick = ({ key }: { key: string }) => {
    const commands = props.editor?.chain().focus()
    switch (+key) {
      case MenuType.MERGE:
        commands?.mergeCells()
        break
      case MenuType.SPLIT:
        commands?.splitCell()
        break
      case MenuType.INSERT_ROW_BEFORE:
        commands?.addRowBefore()
        break
      case MenuType.INSERT_ROW_AFTER:
        commands?.addRowAfter()
        break
      case MenuType.INSERT_COLUMN_BEFORE:
        commands?.addColumnBefore()
        break
      case MenuType.INSERT_COLUMN_AFTER:
        commands?.addColumnAfter()
        break
      case MenuType.DELETE_ROWS:
        commands?.deleteRow()
        break
      case MenuType.DELETE_COLUMNS:
        commands?.deleteColumn()
        break
      case MenuType.DELETE_TABLE:
        commands?.deleteTable()
        break
    }
    commands?.run()
  }

  return (
    <Wrap id={props.id}>
      <Menu items={menuOptions} onClick={onClick} />
    </Wrap>
  )
}

export default WordTableContextMenu
