/* eslint-disable require-unicode-regexp */
// 我的模块和他的模块甘特图

/* eslint-disable prefer-template */
/* eslint-disable operator-linebreak */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */

import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const GanttWrap = styled.div({
  '.gantt_split_parent': {
    opacity: 0,
  },
  '.gantt_tree_content': {
    display: 'flex',
    alignItems: 'center',
  },
  '.gantt_grid_head_cell': {
    textAlign: 'left',
    paddingLeft: 10,
    fontSize: 14,
    fontFamily: 'SiYuanMedium',
  },
  '.gantt_cell': {
    padding: 0,
    paddingLeft: 10,
    fontSize: 14,
  },
  '.gantt_layout_cell, .gantt_scale_cell': {
    border: 'none!important',
    fontSize: '14px!important',
    fontFamily: 'SiYuanMedium !important',
  },
  '.gantt_task_line.gantt_selected': {
    boxShadow: 'none',
  },
  '.gantt_grid_scale, .gantt_task_scale': {
    borderBottom: '1px solid rgba(235, 237, 240, 1)',
  },
  '.gantt_task_content': {
    display: 'none',
  },
  '.gantt_task_line': {
    border: 'none',
    backgroundColor: ' var(--primary-d1)',
    borderRadius: 3,
  },
  '.gantt_row, .gantt_task_row': {
    borderBottom: 'none',
  },
  '.gantt_layout_cell_border_right': {
    borderRight: 'none',
  },
  '.gantt_grid_data .gantt_row.odd:hover, .gantt_grid_data .gantt_row:hover': {
    backgroundColor: 'white',
  },
  '.gantt_grid_data .gantt_row.gantt_selected, .gantt_grid_data .gantt_row.odd.gantt_selected, .gantt_task_row.gantt_selected':
    {
      backgroundColor: 'transparent',
    },
  '.gantt_task_row.gantt_selected .gantt_task_cell': {
    borderRightColor: 'white',
  },
  '.gantt_task_cell': {
    borderRight: 'none',
  },
  '.gantt_grid_head_text': {
    paddingLeft: 26,
  },
  '#status': {
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid var(--primary-d2)',
    color: 'var(--primary-d2)',
    fontSize: 12,
  },
})

interface Props {
  data: any
  height?: any
  minHeight?: any
}

const Gantt = (props: Props) => {
  const [t, i18n] = useTranslation()

  const getC = (str: string) => {
    return str.replace(/[^\u4e00-\u9fa5]/g, '')
  }

  const init = () => {
    gantt.config.date_scale = '%m/%j, %D'
    gantt.config.scale_height = 44
    gantt.config.row_height = 52
    gantt.config.bar_height = 6
    gantt.config.drag_links = false
    gantt.config.details_on_dblclick = false
    gantt.config.drag_progress = false
    gantt.config.readonly = true
    gantt.config.date_format = '%Y-%m-%d %H:%i:%s'
    gantt.i18n.setLocale(i18n.language === 'zh' ? 'cn' : 'en')
    gantt.plugins({
      tooltip: true,
    })
    gantt.templates.tooltip_date_format = function (date) {
      const formatFunc = gantt.date.date_to_str('%Y-%m-%d %H:%i:%s')
      return formatFunc(date)
    }
    gantt.templates.tooltip_text = function (start, end, task) {
      console.log(task)

      return (
        `<b>${
          i18n.language === 'zh' ? t('common.title') + '：' : 'Title:'
        }</b> ` +
        (task.demandText || '--') +
        '<br/>' +
        String(
          task.statusTitle
            ? `<span style="color: ${task.statusColor}">${getC(
                task.statusName,
              )}</span>`
            : `<span style="color: var(--neutral-n3);text-decoration:line-through">${t(
                'newlyAdd.statusDel',
              )}</span>`,
        ) +
        `${
          task.parent
            ? `<br/><b>${
                i18n.language === 'zh'
                  ? t('common.startTime') + '：'
                  : 'Star date:'
              }</b> ` + gantt.templates.tooltip_date_format(start)
            : ''
        }` +
        `${
          task.parent
            ? `<br/><b>${
                i18n.language === 'zh'
                  ? t('common.endTime') + '：'
                  : 'End date:'
              }</b> ` + gantt.templates.tooltip_date_format(end)
            : ''
        }`
      )
    }

    gantt.config.columns = [
      {
        name: 'text',
        label: t('common.title'),
        width: '280',
      },

      {
        name: 'start_date',
        label: t('common.startTime'),
        width: 140,
      },
      {
        name: 'end_date',
        label: t('common.endTime'),
        width: 140,
      },
      {
        name: 'statusName',
        label: t('common.status'),
        width: 140,
      },
    ]

    gantt.init(document.getElementById('ganttDom') as string | HTMLElement)
  }

  useEffect(() => {
    init()
    gantt.clearAll()
    gantt.parse({ data: props?.data })

    // 需优化
    return () => {
      const tooltips: any = document.querySelectorAll('.gantt_tooltip')
      if (tooltips || tooltips?.length) {
        Array.from(tooltips).forEach((element: any) => {
          element.remove()
        })
      }
    }
  }, [props?.data, i18n.language])

  return (
    <GanttWrap
      id="ganttDom"
      style={{
        width: '100%',
        height: props.height,
        minHeight: props?.minHeight,
        // paddingLeft: 16,
      }}
    ></GanttWrap>
  )
}

export default Gantt
