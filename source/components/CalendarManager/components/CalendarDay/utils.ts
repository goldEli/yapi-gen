import dayjs from 'dayjs'
import _ from 'lodash'
import { XYCoord } from 'react-dnd'
import { oneHourHeight } from '../../config'
import { v4 as uuidv4 } from 'uuid'

export const handleOffsetDistance = (
  startTime: number,
  endTime: number,
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

  const newStartTime = dayjs(startTime).add(moveMinute, 'minute')
  console.log('newStartTime', newStartTime.format('hh:mm'))
  const newEndTime = dayjs(endTime).add(moveMinute, 'minute')
  console.log('newEndTime', newEndTime.format('hh:mm'))
  return {
    newStartTime,
    newEndTime,
  }
}
export const getEndTimeByHeight = (startTime: number, height: number) => {
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

  // const newStartTime = dayjs(startTime).add(moveMinute, 'minute')
  // console.log('newStartTime', newStartTime.format('hh:mm'))
  const newEndTime = dayjs(startTime).add(moveMinute, 'minute')
  console.log(
    'newEndTime',
    dayjs(startTime).format('hh:mm'),
    newEndTime.format('hh:mm'),
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
  startTime: number,
  endTime: number,
  distance: number,
) => {
  const offset = getMinutesByDistance(distance)
  const newStartTime = addMinutes(startTime, offset)
  const newEndTime = addMinutes(endTime, offset)
  return {
    startTime: newStartTime,
    endTime: newEndTime,
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
        events[i].startTime < events[j].endTime &&
        events[i].endTime > events[j].startTime
      ) {
        conflicts.push([events[i], events[j]])
      }
    }
  }

  return conflicts
}

type Item = {
  id: string
  startTime: number
  endTime: number
  conflicts: Model.Schedule.Info[]
}
function findConflictsClassify(events: Item[]) {
  const conflicts: Item[] = []
  const usedIds: string[] = []

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const one = events[i]
      const two = events[j]
      if (one.startTime < two.endTime && one.endTime > two.startTime) {
        // conflicts.push([events[i], events[j]])
        usedIds.push(one.id, two.id)
        const res = {
          id: uuidv4(),
          startTime: Math.min(one.startTime, two.startTime),
          endTime: Math.max(one.endTime, two.endTime),
          conflicts: _.unionBy(one.conflicts.concat(two.conflicts), 'id'),
        }
        // res.start = dayjs(res.startTime).format('hh:mm')
        // res.end = dayjs(res.endTime).format('hh:mm')
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
//         conflict[0].startTime >= category.startTime &&
//         conflict[0].endTime <= category.endTime &&
//         conflict[1].startTime >= category.startTime &&
//         conflict[1].endTime <= category.endTime
//       ) {
//         category.conflicts.push(conflict)
//         found = true
//         break
//       }
//     }

//     if (!found) {
//       classified.push({
//         startTime: Math.min(conflict[0].startTime, conflict[1].startTime),
//         endTime: Math.max(conflict[0].endTime, conflict[1].endTime),
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
        conflict[0].startTime >= category.startTime &&
        conflict[0].endTime <= category.endTime &&
        conflict[1].startTime >= category.startTime &&
        conflict[1].endTime <= category.endTime
      ) {
        category.conflicts.push(...conflict)
        found = true
        break
      }
    }

    if (!found) {
      classified.push({
        id: uuidv4(),
        startTime: Math.min(conflict[0].startTime, conflict[1].startTime),
        endTime: Math.max(conflict[0].endTime, conflict[1].endTime),
        conflicts: [...conflict],
      })
    }
  }

  return classified
}
