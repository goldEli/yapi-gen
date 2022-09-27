/* eslint-disable prefer-template */
/* eslint-disable operator-linebreak */
/* eslint-disable complexity */
/* eslint-disable no-console */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'

const GanttWrap = styled.div({
  '.gantt_grid_head_cell': {
    textAlign: 'left',
    paddingLeft: 10,
  },
  '.gantt_cell': {
    padding: 0,
    paddingLeft: 10,
  },
  '.gantt_layout_cell, .gantt_scale_cell': {
    border: 'none!important',
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
    backgroundColor: ' rgba(40, 119, 255, 0.6)',
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
    'border-right-color': 'white',
  },
  '.gantt_task_cell': {
    borderRight: 'none',
  },

  //   '.gantt_row:nth-child(even), .gantt_task_row:nth-child(even)': {
  //     backgroundColor: ' #f8f9fa',
  //   },
  '#status': {
    padding: '4px 8px',
    borderRadius: 6,
    border: '1px solid #2877ff',
    color: '#2877ff',
    fontSize: 12,
  },
})

interface Props {
  data: any
}

const Gantt = (_props: Props) => {
  const [taskData, setTaskData] = useState({
    data: [
      {
        id: 1,
        text: 'Project #2',
        start_date: '2020-10-01',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
      },
      {
        id: 2,
        text: 'Task #1',
        start_date: '2020-10-04',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
        render: 'split',
      },
      {
        id: 3,
        text: 'Task #2',
        start_date: '2020-10-10',
        end_date: '2020-10-21',
        status: '<span id="status">1212</span>',
      },
      {
        id: 4,
        text: 'Task #2',
        start_date: '2020-10-05',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
        parent: 2,
      },
      {
        id: 5,
        text: 'Task #2',
        start_date: '2020-10-07',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
        parent: 2,
      },
      {
        id: 6,
        text: 'Project #2',
        start_date: '2020-10-01',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
      },
      {
        id: 7,
        text: 'Task #1',
        start_date: '2020-10-04',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
        render: 'split',
      },
      {
        id: 8,
        text: 'Task #2',
        start_date: '2020-10-10',
        end_date: '2020-10-21',
        status: '<span id="status">1212</span>',
      },
      {
        id: 9,
        text: 'Task #2',
        start_date: '2020-10-05',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
      },
      {
        id: 10,
        text: 'Task #2',
        start_date: '2020-10-07',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
      },
      {
        id: 11,
        text: 'Project #2',
        start_date: '2020-10-01',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
      },
      {
        id: 12,
        text: 'Task #1',
        start_date: '2020-10-04',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
      },
      {
        id: 13,
        text: 'Task #2',
        start_date: '2020-10-10',
        end_date: '2020-10-21',
        status: '<span id="status">1212</span>',
      },
      {
        id: 14,
        text: 'Task #2',
        start_date: '2020-10-05',
        end_date: '2020-10-10',
        status: '<span id="status">1212</span>',
      },
    ],
  })

  useEffect(() => {
    gantt.config.date_scale = '%j, %D'
    gantt.config.scale_height = 44
    gantt.config.row_height = 52
    gantt.config.bar_height = 6
    gantt.config.drag_links = false
    gantt.config.details_on_dblclick = false
    gantt.config.drag_progress = false
    gantt.config.date_format = '%Y-%m-%d %H:%i:%s'
    gantt.i18n.setLocale('cn')
    gantt.plugins({
      tooltip: true,
    })
    gantt.templates.tooltip_date_format = function (date) {
      const formatFunc = gantt.date.date_to_str('%Y-%m-%d %H:%i')
      return formatFunc(date)
    }
    gantt.templates.tooltip_text = function (start, end, task) {
      return (
        '<b>需求名称:</b> ' +
        task.text +
        '<br/><b>Start date:</b> ' +
        gantt.templates.tooltip_date_format(start) +
        '<br/><b>End date:</b> ' +
        gantt.templates.tooltip_date_format(end)
      )
    }

    gantt.config.columns = [
      {
        name: 'text',
        label: '任务名称',
        width: '150',
      },
      {
        name: 'start_date',
        label: '计划开始时间',
        width: '90',
      },
      {
        name: 'end_date',
        label: '计划结束时间',
        width: '90',
      },
      {
        name: 'status',
        label: '状态',
        width: 90,
      },
    ]

    gantt.attachEvent(
      'onAfterTaskDrag',
      (id: any, mode: any, e: any) => {
        const task = gantt.getTask(id)
      },
      {},
    )

    gantt.init(document.getElementById('ganttDom') as string | HTMLElement)
    gantt.parse(taskData)
  }, [])

  return (
    <GanttWrap id="ganttDom" style={{ width: '100%', height: 380 }}></GanttWrap>
  )
}

export default Gantt
