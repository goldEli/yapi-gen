import { useLiveQuery } from 'dexie-react-hooks'
import useProjectId from '../useProjectId'
import { dbs as db } from '@/views/Encephalogram/until/DbHelper'
import {
  buildIntactTree,
  findAllParentForTree,
  formatObjectForRender,
} from '@/views/Encephalogram/until'
import { useMemo } from 'react'
import { useSelector } from '@store/index'
import moment from 'moment'

const useMapData = () => {
  const { projectId } = useProjectId()
  const { encephalogramParams, extraInfo } = useSelector(
    store => store.encephalogram,
  )
  const { group_by, person, iterationVal, state, time } = encephalogramParams
  const allItems: any[] = useLiveQuery(() => {
    if (projectId) {
      const allList = (db as any)[encephalogramParams.group_by]
        .where({
          project_id: projectId,
        })
        .toArray()
      return allList
    }
    return []
  }, [projectId, group_by])

  const data = useMemo(() => {
    if (!allItems) {
      return null
    }
    let result: any
    if (person.length || iterationVal.length || state.length || time.length) {
      const filterItems = allItems.filter((item: any) => {
        if (item.node_type === 'story') {
          let isNeed = true
          if (iterationVal.length) {
            if (iterationVal.includes(item.iterate_id)) {
              isNeed = true
            } else {
              return false
            }
          }
          if (person.length) {
            const handlers = item?.handlers?.map?.((k: any) => k.id)
            if (handlers.some((t: any) => person.includes(t))) {
              isNeed = true
            } else {
              return false
            }
          }
          if (state.length) {
            if (state.includes(item.category_status_id)) {
              isNeed = true
            } else {
              return false
            }
          }
          if (time.length) {
            if (
              (item.expected_start_at &&
                moment(item.expected_start_at).isSameOrAfter(moment(time[0])) &&
                moment(item.expected_start_at).isSameOrBefore(
                  moment(time[1]),
                )) ||
              (item.expected_end_at &&
                moment(item.expected_end_at).isSameOrAfter(moment(time[0])) &&
                moment(item.expected_end_at).isSameOrBefore(moment(time[1])))
            ) {
              isNeed = true
            } else {
              return false
            }
          }
          return isNeed
        }
        return false
      })
      result = findAllParentForTree(filterItems, allItems)
    } else {
      result = allItems
    }
    const res = buildIntactTree(result)
    const temp = allItems.find((i: any) => i.node_pid === 0)
    const top = formatObjectForRender(temp, temp)
    const output = res ? res : top
    // 加入额外项目信息
    if (extraInfo.length) {
      output.extra = extraInfo.map((i: any) => {
        return {
          name: `${i.department_name} ${i.expect_day ?? 0}天 (${
            i.actual ?? 0
          }天)`,
          id: `${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
          fill:
            i.expect_day === i.actual
              ? '#BBFFBA'
              : i.expect_day > i.actual
              ? '#FFF383'
              : '#FFC8A0',
          color: '#323233',
        }
      })
    }
    return output
  }, [
    JSON.stringify(allItems),
    JSON.stringify(person),
    JSON.stringify(iterationVal),
    JSON.stringify(state),
    JSON.stringify(time),
    JSON.stringify(extraInfo),
  ])
  console.log(data, 'datasssss')

  return {
    data: data,
  }
}

export default useMapData
