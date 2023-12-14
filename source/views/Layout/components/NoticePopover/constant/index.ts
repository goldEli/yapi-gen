/**
 * 1项目管理 2 系统通知 3 日程管理  4 工作汇报
 */
interface Props {
  [key: number]: string
}
export const ICON_TYPE_DATA = new Map([
  [
    'project',
    {
      icon: 'folder-open-sel',
      color: '#6688FF',
      type: 'project',
      text: '项目管理',
    },
  ],
  [
    'sys',
    { icon: 'bell-sel', color: '#FA9746', type: 'sys', text: '系统通知' },
  ],
  [
    'calendar',
    {
      icon: 'calendar-sel',
      color: '#A176FB',
      type: 'calendar',
      text: '日程管理',
    },
  ],
  [
    'report',
    { icon: 'log-sel', color: '#43BA9A', type: 'report', text: '工作汇报' },
  ],
])
