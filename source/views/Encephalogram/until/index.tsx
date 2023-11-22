import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

export const flattenObjectToArray = (
  obj: any,
  group_by: string,
  array: any[] = [],
) => {
  if (Array.isArray(obj.children)) {
    const temp = { ...obj, id: String(obj.node_key), group_by, ids: obj.id }
    delete temp.children
    array.push(temp)
    obj.children.forEach((item: any) => {
      flattenObjectToArray(item, group_by, array)
    })
  } else {
    array.push({ ...obj, ids: obj.id, id: String(obj.node_key), group_by })
  }
  return array
}

export const generatorStyleObject = (obj: any, topObj: any) => {
  const temp: any = {}
  switch (obj.node_type) {
    case 'project':
      temp.fontSize = 18
      break
    case 'class':
    case 'user':
      if (obj.level === 1) {
        temp.fontSize = 16
      } else {
        temp.fontSize = 14
      }
      break
    case 'story':
      temp.fontSize = 14
      break
    default:
      temp.fontSize = 14
      break
  }
  if (
    obj.node_type === 'story' &&
    (moment(obj.expected_end_at).isAfter(topObj.sys_time) ||
      obj.expected_end_at === null)
  ) {
    switch (obj.progress_status) {
      case 'new':
        temp.fill = '#E4D8FF'
        break
      case 'processing':
        temp.fill = '#FFF383'
        break
      case 'ended':
        temp.fill = '#BBFFBA'
        break
      default:
        temp.fill = '#FFFFFF'
        break
    }
  } else if (obj.node_type === 'story') {
    temp.fill = '#FFC8A0'
  } else {
    temp.fill = '#FFFFFF'
  }

  return temp
}

export const generatorUserText = (obj: any) => {
  if (obj.node_type === 'user') {
    return `${obj.department_name} ${obj.position_name} ${obj.name}`
  }
  return obj.name
}

// 将查出来的数据先进行颜色标识等赋值操作
export const formatObjectForRender = (obj: any, topObj: any) => {
  if (obj) {
    const temp = {
      ...obj,
      name: generatorUserText(obj),
      style: generatorStyleObject(obj, topObj),
    }
    return temp
  }
  return obj
}

// 把叶子变成树
export const buildIntactTree = (tempArr: any[]) => {
  if (!tempArr) {
    return []
  }
  const topObj = tempArr.find((s: any) => s.node_pid === 0) ?? {}

  // 格式化数据
  const arr = tempArr.map((item: any) => {
    return formatObjectForRender(item, topObj)
  })
  // 构建 node_key 到对象的映射
  const idMap = arr.reduce((map, item) => {
    map[item.node_key] = item
    return map
  }, {})

  // 通过 node_pid 构建树形结构
  const tree = arr.reduce((tree, item) => {
    const parent = idMap[item.node_pid]
    if (parent) {
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    } else {
      tree.push(item)
    }
    return tree
  }, [])
  arr.forEach((k: any) => {
    if (
      k.node_type === 'story' &&
      k.group_by === 'task' &&
      idMap[k.node_key] &&
      !idMap[k.node_key]?.children?.length
    ) {
      const item = idMap[k.node_key]
      const tempArr = item?.handlers?.map((i: any) => {
        return {
          ...i,
          id: uuidv4(),
          node_key: String(uuidv4()),
          node_pid: k.node_key,
          name: `${i.department_name} ${i.position_name} ${i.name}`,
          project_id: k.project_id,
          node_type: 'user',
          style: {
            fontSize: 14,
            fill: '#FFFFFF',
          },
        }
      })
      if (tempArr?.length) {
        item.children = tempArr
      }
    }
  })
  if (Array.isArray(tree)) {
    return tree.find((k: any) => k.node_pid === 0)
  }
  return tree
}

const recursiveSupervisorSearch = (
  array: any[],
  target: any,
  result: any[],
) => {
  result.push(target.node_key)
  for (let i = 0; i < array.length; i++) {
    if (array[i].node_key === target.node_pid) {
      if (array[i]) {
        result.push(array[i]?.node_key)
        recursiveSupervisorSearch(array, array[i], result)
      }
    }
  }
}

// 根据筛选出来的叶子反推出所有的父节点并去重
export const findAllParentForTree = (arr: any[], allArr: any[]) => {
  const result: any[] = []
  arr.forEach((item: any) => {
    recursiveSupervisorSearch(allArr, item, result)
  })
  return [...new Set(result)].map((key: string) => {
    return allArr.find((k: any) => k.node_key === key)
  })
}
