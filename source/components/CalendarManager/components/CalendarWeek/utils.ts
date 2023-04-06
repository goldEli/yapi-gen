import dayjs from 'dayjs'
import _ from 'lodash'
import { XYCoord } from 'react-dnd'
import { oneHourHeight } from '../../config'
import { v4 as uuidv4 } from 'uuid'

export const handleOffsetDistance = (
  start_timestamp: number,
  end_timestamp: number,
  delta: XYCoord,
) => {
  console.log('==================')
  const offsetTop = Math.round(delta?.y ?? 0)
  console.log('offsetTop', offsetTop)
  const offsetMinute = Math.floor(offsetTop / (oneHourHeight / 60))
  console.log('offsetMinute', offsetMinute)
  // const direction = offsetMinute < 0 ? -1 : 1
  // console.log('direction', direction)
  // 每次移动是15分钟的倍数
  const step = Math.ceil(offsetMinute / 15)
  const moveMinute = step * 15
  console.log('moveMinute', moveMinute)

  const newStartTime = dayjs(start_timestamp).add(moveMinute, 'minute')
  console.log('newStartTime', newStartTime.format('HH:mm'))
  const newEndTime = dayjs(end_timestamp).add(moveMinute, 'minute')
  console.log('newEndTime', newEndTime.format('HH:mm'))
  return {
    newStartTime,
    newEndTime,
  }
}
export const getEndTimeByHeight = (start_timestamp: number, height: number) => {
  // console.log('==================')
  // const offsetTop = Math.round(delta?.y ?? 0)
  // console.log('offsetTop', offsetTop)
  const offsetMinute = Math.floor(height / (oneHourHeight / 60))
  // console.log('offsetMinute', offsetMinute)
  // const direction = offsetMinute < 0 ? -1 : 1
  // console.log('direction', direction)
  // 每次移动是15分钟的倍数
  const step = Math.ceil(offsetMinute / 15)
  const moveMinute = step * 15
  // console.log('moveMinute', moveMinute)

  // const newStartTime = dayjs(start_timestamp).add(moveMinute, 'minute')
  // console.log('newStartTime', newStartTime.format('HH:mm'))
  const newEndTime = dayjs(start_timestamp).add(moveMinute, 'minute')
  console.log(
    'newEndTime',
    dayjs(start_timestamp).format('HH:mm'),
    newEndTime.format('HH:mm'),
  )
  return newEndTime
}

export const getMinutesByDistance = (height: number) => {
  return (oneHourHeight / 60) * height
}

export const addMinutes = (time: number, minutes: number) => {
  return dayjs(time).add(minutes, 'minute')
}

export const getTimeByOffsetDistance = (
  start_timestamp: number,
  end_timestamp: number,
  distance: number,
) => {
  const offset = getMinutesByDistance(distance)
  const newStartTime = addMinutes(start_timestamp, offset)
  const newEndTime = addMinutes(end_timestamp, offset)
  return {
    start_timestamp: newStartTime,
    end_timestamp: newEndTime,
  }
}

export const getTimeByAddDistance = (time: number, distance: number) => {
  const offset = getMinutesByDistance(distance)
  const newTime = addMinutes(time, offset)
  return newTime
}

// 获取元素属性
export function getStyleValue(dom: Element, attr: keyof CSSStyleDeclaration) {
  return parseFloat(getComputedStyle(dom)[attr] + '')
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.substring(1, 3), 16)
  const g = parseInt(hex.substring(3, 5), 16)
  const b = parseInt(hex.substring(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function findConflicts(events: Model.Schedule.Info[]) {
  const conflicts = []

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      if (
        events[i].start_timestamp < events[j].end_timestamp &&
        events[i].end_timestamp > events[j].start_timestamp
      ) {
        conflicts.push([events[i], events[j]])
      }
    }
  }

  return conflicts
}

type Item = {
  id: string
  start_timestamp: number
  end_timestamp: number
  conflicts: Model.Schedule.Info[]
}
function findConflictsClassify(events: Item[]) {
  const conflicts: Item[] = []
  const usedIds: string[] = []

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const one = events[i]
      const two = events[j]
      if (
        one.start_timestamp < two.end_timestamp &&
        one.end_timestamp > two.start_timestamp
      ) {
        // conflicts.push([events[i], events[j]])
        usedIds.push(one.id, two.id)
        const res = {
          id: uuidv4(),
          start_timestamp: Math.min(one.start_timestamp, two.start_timestamp),
          end_timestamp: Math.max(one.end_timestamp, two.end_timestamp),
          conflicts: _.unionBy(one.conflicts.concat(two.conflicts), 'id'),
        }
        // res.start = dayjs(res.start_timestamp).format('HH:mm')
        // res.end = dayjs(res.end_timestamp).format('HH:mm')
        conflicts.push(res)
      }
    }
  }

  const unConflicts = events.filter(item => !usedIds.includes(item.id))
  return conflicts.concat(unConflicts)
}

export function getConflicts(events: Model.Schedule.Info[]) {
  const conflicts = getClassifyConflicts(events)

  let combineConflicts = findConflictsClassify(conflicts)
  let resultLen = combineConflicts.length

  while (true) {
    const newCombineConflicts = findConflictsClassify(combineConflicts)
    if (newCombineConflicts.length === resultLen) {
      break
    }
    combineConflicts = newCombineConflicts
    resultLen = newCombineConflicts.length
  }
  // console.log({ conflicts, combineConflicts })
  return combineConflicts.map(item => item.conflicts)
}

// export function getClassifyConflicts(events:  Item[]) {
//   const conflicts = findConflictsClassify(events)
//   const classified = []

//   for (const conflict of conflicts) {
//     let found = false

//     for (const category of classified) {
//       if (
//         conflict[0].start_timestamp >= category.start_timestamp &&
//         conflict[0].end_timestamp <= category.end_timestamp &&
//         conflict[1].start_timestamp >= category.start_timestamp &&
//         conflict[1].end_timestamp <= category.end_timestamp
//       ) {
//         category.conflicts.push(conflict)
//         found = true
//         break
//       }
//     }

//     if (!found) {
//       classified.push({
//         start_timestamp: Math.min(conflict[0].start_timestamp, conflict[1].start_timestamp),
//         end_timestamp: Math.max(conflict[0].end_timestamp, conflict[1].end_timestamp),
//         conflicts: [conflict],
//       })
//     }
//   }

//   return classified
// }

export function getClassifyConflicts(events: Model.Schedule.Info[]) {
  const conflicts = findConflicts(events)
  const classified: Item[] = []

  for (const conflict of conflicts) {
    let found = false

    for (const category of classified) {
      if (
        conflict[0].start_timestamp >= category.start_timestamp &&
        conflict[0].end_timestamp <= category.end_timestamp &&
        conflict[1].start_timestamp >= category.start_timestamp &&
        conflict[1].end_timestamp <= category.end_timestamp
      ) {
        category.conflicts.push(...conflict)
        found = true
        break
      }
    }

    if (!found) {
      classified.push({
        id: uuidv4(),
        start_timestamp: Math.min(
          conflict[0].start_timestamp,
          conflict[1].start_timestamp,
        ),
        end_timestamp: Math.max(
          conflict[0].end_timestamp,
          conflict[1].end_timestamp,
        ),
        conflicts: [...conflict],
      })
    }
  }

  return classified
}

interface TimeRange {
  start_timestamp: number
  end_timestamp: number
}

export function getConflictsTimeRange(list: Model.Schedule.Info[]) {
  const res: Model.Schedule.Info[][] = []
  for (let i = 0; i < list.length; ++i) {
    for (let j = i + 1; j < list.length; ++j) {
      if (
        list[i].start_timestamp < list[j].end_timestamp &&
        list[i].end_timestamp > list[j].start_timestamp
      ) {
        res.push([list[i], list[j]])
      }
    }
  }

  for (let i = 0; i < res.length; ++i) {
    const first = res[i]
    for (let j = 0; j < res.length; ++j) {
      const two = res[j]
      if (first.some(item => two.includes(item))) {
        res[i] = []
        res[j] = [...new Set(first.concat(two))]
      }
    }
  }
  return res.filter(item => item.length)
}

export const isSameTime = (time1: number, time2: number) => {
  return dayjs(time1).isSame(dayjs(time2), 'day')
}
