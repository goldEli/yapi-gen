import { useLiveQuery } from 'dexie-react-hooks'
import useProjectId from '../useProjectId'
import { dbs as db } from '@/views/Encephalogram/until/DbHelper'
import {
  buildIntactTree,
  findAllParentForTree,
  formatObjectForRender,
} from '@/views/Encephalogram/until'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from '@store/index'
import moment from 'moment'
import { setLoading } from '@store/encephalogram'

const useMapData = () => {
  const { projectId } = useProjectId()
  const { encephalogramParams, extraInfo } = useSelector(
    store => store.encephalogram,
  )
  const timer = useRef()
  const dispatch = useDispatch()
  const { group_by } = encephalogramParams
  const [filterObject, setFilterObject] = useState<any>({})
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

  useEffect(() => {
    clearTimeout(timer.current)
    setTimeout(() => {
      dispatch(setLoading(true))
      setTimeout(() => {
        setFilterObject({
          allItems,
          person: encephalogramParams.person,
          iterationVal: encephalogramParams.iterationVal,
          state: encephalogramParams.state,
          time: encephalogramParams.time,
          extraInfo,
        })
      }, 0)
    }, 1000)
  }, [
    JSON.stringify(allItems),
    JSON.stringify(encephalogramParams.person),
    JSON.stringify(encephalogramParams.iterationVal),
    JSON.stringify(encephalogramParams.state),
    JSON.stringify(encephalogramParams.time),
    JSON.stringify(extraInfo),
  ])

  const data = useMemo(() => {
    const { allItems, person, iterationVal, state, time } = filterObject
    if (!allItems?.length) {
      return null
    }
    let result: any
    let isExpandAll = false
    if (person.length || iterationVal.length || state.length || time.length) {
      isExpandAll = true
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
      isExpandAll = false
      result = allItems
    }
    const res = buildIntactTree(result, isExpandAll)
    const temp = allItems.find((i: any) => i.node_pid === 0)
    const top = formatObjectForRender(temp, temp, isExpandAll)
    const output = res ? res : top
    // 加入额外项目信息
    if (extraInfo.length && output) {
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
    setTimeout(() => {
      dispatch(setLoading(false))
    }, 1500)
    return output
  }, [JSON.stringify(filterObject)])

  console.log(data, 'datasssss')

  return {
    data: data,
  }
}

export default useMapData
