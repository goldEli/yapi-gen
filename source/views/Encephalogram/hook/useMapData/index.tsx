import { useLiveQuery } from 'dexie-react-hooks'
import useProjectId from '../useProjectId'
import { dbs as db } from '@/views/Encephalogram/until/DbHelper'
import {
  buildIntactTree,
  findAllParentForTree,
  formatObjectForRender,
} from '@/views/Encephalogram/until'
import { useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from '@store/index'
import moment from 'moment'
import { setData } from '@store/encephalogram'

const useMapData = () => {
  const { projectId } = useProjectId()
  const dispatch = useDispatch()
  const { encephalogramParams, extraInfo, data } = useSelector(
    store => store.encephalogram,
  )
  const searchParamsRef = useRef<any>({})
  const { group_by, person, iterationVal, state, time } = encephalogramParams

  useEffect(() => {
    searchParamsRef.current.person = person
    searchParamsRef.current.iterationVal = iterationVal
    searchParamsRef.current.state = state
    searchParamsRef.current.time = time
    searchParamsRef.current.extraInfo = extraInfo
  }, [
    JSON.stringify(person),
    JSON.stringify(iterationVal),
    JSON.stringify(state),
    JSON.stringify(time),
    JSON.stringify(extraInfo),
  ])

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

  const getRenderData = useCallback(() => {
    const { person, iterationVal, state, time, extraInfo } =
      searchParamsRef.current
    if (!allItems?.length) {
      return null
    }
    let result: any
    let isExpandAll = false
    const temp = allItems.find((i: any) => i.pid === '0')
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
      if (temp?.group_by === 'user' && person.length) {
        result = result.filter((m: any) => {
          if (m.node_type === 'user') {
            return person.includes(m.user_id)
          }
          return true
        })
      }
    } else {
      isExpandAll = false
      result = allItems
    }
    const res = buildIntactTree(result, isExpandAll)
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
    dispatch(setData(output))
  }, [JSON.stringify(allItems)])

  useEffect(() => {
    getRenderData()
  }, [JSON.stringify(allItems)])

  console.log(data, 'datasssss')

  return {
    data,
    searchParamsRef,
    getRenderData,
  }
}

export default useMapData
