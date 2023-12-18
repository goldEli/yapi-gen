import { useRoutes, Navigate } from 'react-router-dom'
import React from 'react'
import Loading from '@/components/Loading'
import Login from '@/views/Login'
import VideoTeaching from '@/views/VideoTeaching'
import VideoTeachingDetail from '@/views/VideoTeaching/detail'
const lazy = (
  component: () => Promise<{
    default: any
  }>,
) => {
  const LazyComponent = React.lazy(component)
  return (
    <React.Suspense fallback={<Loading />}>
      <LazyComponent />
    </React.Suspense>
  )
}

const routes = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'videoTeach',
    element: <VideoTeaching />,
  },
  {
    path: 'videoTeachDetail',
    element: <VideoTeachingDetail />,
  },
  {
    path: '/ScheduleSearch',
    element: lazy(() => import('@/views/ScheduleSearch')),
  },

  {
    path: '',
    element: lazy(() => import('@/views/Layout')),
    children: [
      {
        path: '*',
        element: lazy(() => import('@/components/ErrorPage/404')),
      },
      {
        path: 'Project',
        element: lazy(() => import('@/views/Layout/Project')),
      },
      {
        path: 'Report',
        element: lazy(() => import('@/views/Layout/Report')),
        children: [
          {
            // 汇报
            path: 'Review',
            element: lazy(() => import('@/views/Layout/Report')),
            children: [
              {
                path: 'List/:id',
                element: lazy(
                  () => import('@/views/Layout/Report/Review/components/List'),
                ),
              },
            ],
          },
          {
            path: 'Census',
            element: lazy(() => import('@/views/Layout/Report/Statistics')),
          },
          {
            path: 'Formwork',
            element: lazy(() => import('@/views/Layout/Report/Formwork')),
          },
        ],
      },
      {
        path: 'CalendarManager',
        element: lazy(() => import('@/views/Layout/CalendarManager')),
      },
      {
        path: 'EmployeeProfile',
        element: lazy(() => import('@/views/Layout/EmployeeProfile')),
      },
      {
        path: 'Statistics',
        element: lazy(() => import('@/views/Layout/Statistics')),
        children: [
          {
            path: 'Task',
            element: lazy(() => import('@/views/Layout/Statistics/Kanban')),
          },
          {
            path: 'Company',
            element: lazy(() => import('@/views/Layout/Statistics/Situation')),
          },
        ],
      },
      {
        path: 'Trends',
        element: lazy(() => import('@/views/Layout/Trends')),
        children: [
          {
            path: 'AllNote/:id',
            element: lazy(
              () => import('../views/Layout/Trends/AllNotes/index'),
            ),
          },
        ],
      },
      {
        path: 'Mine',
        element: lazy(() => import('@/views/Layout/Mine')),
        children: [
          {
            path: 'Agenda',
            element: lazy(() => import('@/views/Layout/Mine/Agenda')),
          },
          {
            path: 'Carbon',
            element: lazy(() => import('@/views/Layout/Mine/Carbon')),
          },
          {
            path: 'Create',
            element: lazy(() => import('@/views/Layout/Mine/Create')),
          },
          {
            path: 'Finished',
            element: lazy(() => import('@/views/Layout/Mine/Finished')),
          },
          {
            path: 'Examine',
            element: lazy(() => import('@/views/Layout/Mine/Examine')),
          },
          // {
          //   path: 'Profile',
          //   element: lazy(() => import('@/views/Layout/Mine/Profile')),
          // },
        ],
      },
      {
        path: '/AdminManagement',
        element: lazy(() => import('@/views/Layout/AdminManagement')),
        children: [
          {
            path: 'CompanyInfo',
            element: lazy(
              () => import('@/views/Layout/AdminManagement/CompanyInfo'),
            ),
          },
          {
            path: 'OrganizationInformation',
            element: lazy(
              () =>
                import(
                  '@/views/Layout/AdminManagement/OrganizationInformation'
                ),
            ),
            children: [
              {
                path: 'StaffManagement',
                element: lazy(
                  () =>
                    import('@/views/Layout/AdminManagement/StaffManagement'),
                ),
              },
              {
                path: 'TeamManagement',
                element: lazy(
                  () => import('@/views/Layout/AdminManagement/TeamManagement'),
                ),
              },
              {
                path: 'MemberInfo',
                element: lazy(() => import('@/views/MemberInfo')),
                children: [
                  {
                    path: 'Carbon',
                    element: lazy(() => import('@/views/MemberInfo/Carbon')),
                  },
                  {
                    path: 'Create',
                    element: lazy(() => import('@/views/MemberInfo/Create')),
                  },
                  {
                    path: 'Finished',
                    element: lazy(() => import('@/views/MemberInfo/Finished')),
                  },
                  // {
                  //   path: 'Profile',
                  //   element: lazy(() => import('@/views/MemberInfo/Profile')),
                  // },
                ],
              },
            ],
          },
          {
            path: 'PermissionManagement',
            element: lazy(
              () =>
                import('@/views/Layout/AdminManagement/PermissionManagement'),
            ),
          },
          {
            path: 'SafetyManagement',
            element: lazy(
              () => import('@/views/Layout/AdminManagement/SafetyManagement'),
            ),
            children: [
              {
                path: 'WaterMarkManagement',
                element: lazy(
                  () =>
                    import(
                      '@/views/Layout/AdminManagement/WaterMarkManagement'
                    ),
                ),
              },
              {
                path: 'OperationManagement',
                element: lazy(
                  () =>
                    import(
                      '@/views/Layout/AdminManagement/OperationManagement'
                    ),
                ),
              },
              {
                path: 'LoginManagement',
                element: lazy(
                  () =>
                    import('@/views/Layout/AdminManagement/LoginManagement'),
                ),
              },
            ],
          },

          {
            path: 'NoteManagement',
            element: lazy(
              () => import('@/views/Layout/AdminManagement/NoteManagement'),
            ),
          },
        ],
      },
      {
        path: 'ProjectDetail',
        element: lazy(() => import('@/views/ProjectDetail')),
        children: [
          {
            path: 'Encephalogram',
            element: lazy(() => import('@/views/Encephalogram')),
          },
          {
            path: 'PrivatePermission',
            element: lazy(
              () =>
                import('@/views/ProjectDetail/components/PrivatePermission'),
            ),
          },
          {
            path: 'Demand',
            element: lazy(() => import('@/views/Demand')),
          },
          {
            path: 'Iteration',
            element: lazy(() => import('@/views/Iteration')),
          },
          {
            path: 'Defect',
            element: lazy(() => import('@/views/IterationDefect')),
          },
          {
            path: 'Affair',
            element: lazy(() => import('@/views/SprintProjectAffair')),
          },
          {
            path: 'Sprint',
            element: lazy(() => import('@/views/SprintProjectSprint')),
          },
          {
            path: 'KanBan',
            element: lazy(() => import('@/views/KanBanBoard')),
          },
          {
            path: 'WorkHours',
            element: lazy(() => import('@/views/WorkingHoursStatistics')),
          },
          {
            path: 'Performance',
            element: lazy(() => import('@/views/PerformanceInsight')),
          },
          {
            path: 'ChildLevel',
            element: lazy(
              () => import('@/views/PerformanceInsight/ChildLevel'),
            ),
          },
          {
            path: 'IterationDetail',
            element: lazy(() => import('@/views/IterationDetail')),
          },
          {
            path: 'Setting',
            element: lazy(() => import('@/views/ProjectSetting')),
            children: [
              {
                path: 'ProjectInfo',
                element: lazy(
                  () => import('@/views/ProjectSetting/components/ProjectInfo'),
                ),
              },
              {
                path: 'ProjectSet',
                element: lazy(
                  () => import('@/views/ProjectSetting/components/ProjectSet'),
                ),
              },
              {
                path: 'ProjectNote',
                element: lazy(
                  () => import('@/views/ProjectSetting/components/ProjectNote'),
                ),
              },
              {
                path: 'TypeConfiguration',
                element: lazy(() => import('@/views/TypeConfiguration')),
              },
              {
                path: 'KanBanSettings',
                element: lazy(
                  () =>
                    import('@/views/ProjectSetting/components/KanBanSetting'),
                ),
              },
              {
                path: 'HomeSettings',
                element: lazy(
                  () => import('@/views/ProjectSetting/components/HomeSetting'),
                ),
              },
              {
                path: 'DailyReportRules',
                element: lazy(
                  () =>
                    import(
                      '@/views/ProjectSetting/components/DailyReportRules'
                    ),
                ),
              },
              {
                path: 'WorkingTimeConfig',
                element: lazy(
                  () =>
                    import('@/views/ProjectSetting/components/WorkTimeConfig'),
                ),
              },
              {
                path: 'ProjectWarning',
                element: lazy(
                  () =>
                    import('@/views/ProjectSetting/components/ProjectWarning'),
                ),
              },
            ],
          },
          {
            path: 'Member',
            element: lazy(
              () => import('@/views/ProjectSetting/components/ProjectMember'),
            ),
          },
          {
            path: 'Department',
            element: lazy(() => import('@/views/Department')),
          },
          {
            path: 'Position',
            element: lazy(() => import('@/views/Position')),
          },
          {
            path: 'MemberInfo',
            element: lazy(() => import('@/views/MemberInfo')),
            children: [
              {
                path: 'Carbon',
                element: lazy(() => import('@/views/MemberInfo/Carbon')),
              },
              {
                path: 'Create',
                element: lazy(() => import('@/views/MemberInfo/Create')),
              },
              {
                path: 'Finished',
                element: lazy(() => import('@/views/MemberInfo/Finished')),
              },
              // {
              //   path: 'Profile',
              //   element: lazy(() => import('@/views/MemberInfo/Profile')),
              // },
            ],
          },
        ],
      },
      // 兼容老路由
      {
        path: 'ProjectManagement/Project',
        element: lazy(() => import('@/views/Layout/Project')),
      },
      {
        path: '/ProjectManagement',
        element: lazy(() => import('@/views/ProjectDetail')),
        children: [
          {
            path: 'Demand',
            element: lazy(() => import('@/views/Demand')),
          },
          {
            path: 'Iteration',
            element: lazy(() => import('@/views/Iteration')),
          },
          {
            path: 'IterationDetail',
            element: lazy(() => import('@/views/IterationDetail')),
          },
          {
            path: 'KanBan',
            element: lazy(() => import('@/views/KanBanBoard')),
          },
          {
            path: 'Defect',
            element: lazy(() => import('@/views/IterationDefect')),
          },
          {
            path: 'ProjectSetting',
            element: lazy(() => import('@/views/ProjectSetting')),
          },
        ],
      },
      {
        path: 'SprintProjectManagement',
        element: lazy(() => import('@/views/ProjectDetail')),
        children: [
          {
            path: 'KanBan',
            element: lazy(() => import('@/views/KanBanBoard')),
          },
          {
            path: 'Sprint',
            element: lazy(() => import('@/views/SprintProjectSprint')),
          },
          {
            path: 'Affair',
            element: lazy(() => import('@/views/SprintProjectAffair')),
          },
          {
            path: 'Setting',
            element: lazy(() => import('@/views/ProjectSetting')),
          },
        ],
      },
    ],
  },
]

export default () => useRoutes(routes)
