import { useEffect, useRef } from 'react'
import { MapContentBox } from '@/views/Encephalogram/styles'
import {
  haveProjectData,
} from '@/views/Encephalogram/until/DbHelper'
import useProjectId from '@/views/Encephalogram/hook/useProjectId'
import useMapData from '../../hook/useMapData'
import init from '@/views/Encephalogram/until/MapFun'
import { getMapList } from '@/services/map'
import { useSelector } from '@store/index'

// type MapContentPropsType = {}

const MapContent = (props: any) => {
  const { projectId } = useProjectId()
  const { fullScreen } = useSelector(store => store.kanBan)
  const mapRef = useRef<any>(null)
  const { data } = useMapData()
  console.log(data, 'datadatadata')
  const addTask = async () => {
    const hasId: any = await haveProjectData(projectId)
    if (!hasId) {
      const result = await getMapList({
        project_id: projectId,
        group_by: 'task',
      })
      console.log(result, 'resultresultresult')

      // addTaskForTable(projectId, {
      //   id: 516,
      //   name: '分类1',
      //   parent_id: 0,
      //   project_id: projectId,
      //   children: [
      //     {
      //       id: 1002929,
      //       story_id: 1002929,
      //       name: '个人中心（jxl）',
      //       schedule: 100,
      //       class_id: 516,
      //       iterate_id: 538,
      //       project_id: 321,
      //       category_status_id: 1643,
      //       expected_start_at: '2023-11-08',
      //       expected_end_at: '2023-11-30',
      //       parent_id: 0,
      //       handlers: [
      //         {
      //           id: 689,
      //           name: '蒋晓龙',
      //           avatar: '',
      //           department_id: '1542006488750587906',
      //           job_id: '1542006731630149634',
      //           department_name: 'php',
      //           position_name: 'php工程师',
      //         },
      //       ],
      //       node_type: 'story',
      //       progress_status: 'ended',
      //       expect_duration: 17,
      //       real_duration: 0,
      //       all_iterate_ids: [191, 538],
      //       all_category_status_ids: [1822, 1643],
      //       all_handler_ids: [689],
      //       min_expected_start_at: '2023-10-28',
      //       max_expected_end_at: '2023-11-30',
      //       children_count: 1,
      //       children: [
      //         {
      //           id: 1003712,
      //           story_id: 1003712,
      //           name: '测试关联工作项',
      //           schedule: 53,
      //           class_id: 0,
      //           iterate_id: 191,
      //           project_id: 321,
      //           category_status_id: 1822,
      //           expected_start_at: '2023-10-28',
      //           expected_end_at: '2023-11-03',
      //           parent_id: 1002929,
      //           handlers: [
      //             {
      //               id: 689,
      //               name: '蒋晓龙',
      //               avatar: '',
      //               department_id: '1542006488750587906',
      //               job_id: '1542006731630149634',
      //               department_name: 'php',
      //               position_name: 'php工程师',
      //             },
      //           ],
      //           node_type: 'story',
      //           progress_status: 'processing',
      //           expect_duration: 5,
      //           real_duration: 0,
      //           all_iterate_ids: [191],
      //           all_category_status_ids: [1822],
      //           all_handler_ids: [689],
      //           min_expected_start_at: '2023-10-28',
      //           max_expected_end_at: '2023-11-03',
      //           children_count: 0,
      //         },
      //       ],
      //     },
      //   ],
      // })
    }
  }

  useEffect(() => {
    if (projectId) {
      addTask()
    }
  }, [projectId])
  const datas = {
    id: '1',
    name: 'SLG框架开发',
    extra: [
      '美术组 12天（12天）',
      '3D设计组 4天（3天）',
      '服务器组 4天（-）',
      '客服端组 4天（-）',
      '客服端组 77天（-）',
      '客服端组 45天（-）',
    ],
    style: {
      color: '#323233',
      fontWeight: 500,
      fontFamily: 'SiYuanMedium',
      fontSize: 18,
      fill: '#FFFFFF',
    },
    children: [
      {
        id: '11',
        name: '主分类-英雄',
        style: {
          color: '#323233',
          fontWeight: 500,
          fontFamily: 'SiYuanMedium',
          fontSize: 16,
          fill: '#FFFFFF',
        },
        children: [
          {
            id: '111',
            name: '子分类-等级',
            style: {
              fill: '#FFFFFF',
            },
            children: [
              {
                id: '111-1',
                name: '父级任务-英雄养成',
                style: {
                  fill: '#FFF383',
                },
                children: [
                  {
                    id: '1111-1',
                    name: '子任务-UE 2.0',
                    style: {
                      fill: '#BBFFBA',
                    },
                    children: [
                      {
                        id: '11111-1',
                        name: '美术组UED1',
                      },
                    ],
                  },
                  {
                    id: '1111-2',
                    name: '子任务-UE 2.1',
                    style: {
                      fill: '#BBFFBA',
                    },
                    children: [
                      {
                        id: '1111-2-1',
                        name: '美术组UED2',
                      },
                    ],
                  },
                  {
                    id: '1111-3',
                    name: '子任务-UE 2.2',
                    style: {
                      fill: '#E4D8FF',
                    },
                    children: [
                      {
                        id: '1111-3-1',
                        name: '美术组UED3',
                      },
                    ],
                  },
                  {
                    id: '1111-4',
                    name: '子任务-UE 2.3',
                    style: {
                      fill: '#FFC8A0',
                    },
                    children: [
                      {
                        id: '1111-4-1',
                        name: '3D设计组',
                      },
                    ],
                  },
                  {
                    id: '1111-5',
                    name: '子任务-UE 2.4',
                    style: {
                      fill: '#E4D8FF',
                    },
                    children: [
                      {
                        id: '1111-5-1',
                        name: '3D设计组',
                      },
                    ],
                  },
                  {
                    id: '1111-6',
                    name: '子任务-UE 2.5',
                    style: {
                      fill: '#FFC8A0',
                    },
                    children: [
                      {
                        id: '1111-6-1',
                        name: '客户端组',
                      },
                    ],
                  },
                ],
              },
              {
                id: '111-2',
                name: '父级任务-英雄等级',
                style: {
                  fill: '#BBFFBA',
                },
              },
              {
                id: '111-3',
                name: '父级任务-英雄主界面',
                style: {
                  fill: '#FFC8A0',
                },
              },
            ],
          },
          {
            id: '112',
            name: '子分类-天赋',
            style: {
              fill: '#FFFFFF',
            },
            children: [
              {
                id: '112-1',
                name: '父级任务-天赋-ui2.0',
                style: {
                  fill: '#FFF383',
                },
              },
              {
                id: '112-2',
                name: '父级任务-天赋-ue2.0',
                style: {
                  fill: '#BBFFBA',
                },
              },
            ],
          },
          {
            id: '113',
            name: '子分类-星际',
            style: {
              fill: '#FFFFFF',
            },
            children: [
              {
                id: '113-1',
                name: '父级任务-天赋-ui2.0',
                style: {
                  fill: '#BBFFBA',
                },
              },
              {
                id: '113-2',
                name: '父级任务-天赋-ue2.0',
                style: {
                  fill: '#E4D8FF',
                },
              },
            ],
          },
        ],
      },
      {
        id: '22',
        name: '副分类-练级',
        style: {
          color: '#323233',
          fontWeight: 500,
          fontFamily: 'SiYuanMedium',
          fontSize: 16,
          fill: '#FFFFFF',
        },
      },
    ],
  }

  useEffect(() => {
    const graph = init()

    mapRef.current = graph
    graph.data(datas)
    graph.render()
    graph.fitCenter()
  }, [])
  useEffect(() => {
    if (mapRef.current) {
      if (fullScreen) {
        setTimeout(() => {
          mapRef.current.changeSize(window.innerWidth, window.innerHeight)
        }, 2000)
      } else {
        // mapRef.current.fitCenter()
        // mapRef.current.render()
      }
    }
  }, [fullScreen])
  return <MapContentBox id="MapContentMountNode" />
}
export default MapContent
