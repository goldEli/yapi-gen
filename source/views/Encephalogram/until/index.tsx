import moment from 'moment'

export const flattenObjectToArray = (
  obj: any,
  group_by: string,
  array: any[] = [],
  deep = 1,
  pid = '0',
) => {
  const idStr = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`
  if (Array.isArray(obj.children)) {
    const temp = {
      ...obj,
      id: idStr,
      node_id: obj.id,
      group_by,
      deep,
      pid,
    }
    delete temp.children
    array.push(temp)
    obj.children.forEach((item: any) => {
      flattenObjectToArray(item, group_by, array, deep + 1, idStr)
    })
  } else {
    array.push({
      ...obj,
      id: idStr,
      node_id: obj.id,
      group_by,
      deep,
      pid,
    })
  }
  return array
}

export const generatorStyleObject = (obj: any, topObj: any) => {
  const temp: any = {}
  temp.stroke = '#D5D6D9'
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
        temp.stroke = ''
        break
      case 'processing':
        temp.fill = '#FFF383'
        temp.stroke = ''
        break
      case 'ended':
        temp.fill = '#BBFFBA'
        temp.stroke = ''
        break
      default:
        temp.fill = '#FFFFFF'
        break
    }
  } else if (obj.node_type === 'story') {
    temp.fill = '#FFC8A0'
    temp.stroke = ''
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

// 将查出来的数据先进行颜色标识等赋值操作 (不带筛选条件默认展开三级，带筛选条件全部展开)
export const formatObjectForRender = (
  obj: any,
  topObj: any,
  isExpandAll: boolean,
) => {
  if (obj) {
    const temp = {
      ...obj,
      collapsed: isExpandAll ? false : obj.deep >= 3,
      name: generatorUserText(obj),
      style: generatorStyleObject(obj, topObj),
    }
    return temp
  }
  return obj
}

// 把叶子变成树
export const buildIntactTree = (tempArr: any[], isExpandAll: boolean) => {
  if (!tempArr) {
    return []
  }
  const topObj = tempArr.find((s: any) => s.pid === '0') ?? {}

  // 格式化数据
  const arr = tempArr.map((item: any) => {
    return formatObjectForRender(item, topObj, isExpandAll)
  })
  // 构建 id 到对象的映射
  let idMap = arr.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})

  // 通过 pid 构建树形结构
  const tree = arr.reduce((tree, item) => {
    const parent = idMap[item.pid]
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
  if (topObj.group_by === 'task') {
    arr.forEach((k: any) => {
      if (
        k.node_type === 'story' &&
        k.group_by === 'task' &&
        idMap[k.id] &&
        !idMap[k.id]?.children?.length
      ) {
        const item = idMap[k.id]
        const tempArr = item?.handlers?.map((i: any) => {
          return {
            ...i,
            id: `${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
            pid: k.id,
            name: `${i.department_name} ${i.position_name} ${i.name}`,
            project_id: k.project_id,
            node_type: 'user',
            collapsed: true,
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
  }

  if (Array.isArray(tree)) {
    idMap = null
    return tree.find((k: any) => k.pid === '0')
  }
  return tree
}

const recursiveSupervisorSearch = (
  array: any[],
  target: any,
  result: any[],
) => {
  result.push(target.id)
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === target.pid) {
      if (array[i]) {
        result.push(array[i]?.id)
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
    return allArr.find((k: any) => k.id === key)
  })
}

// 找出某个节点所有儿子
const recursiveChildrenSearch = (array: any[], target: any, result: any[]) => {
  result.push(target.id)
  for (let i = 0; i < array.length; i++) {
    if (array[i].pid === target.id) {
      if (array[i]) {
        result.push(array[i]?.id)
        recursiveChildrenSearch(array, array[i], result)
      }
    }
  }
}
// 根据筛选出来的叶子反推出所有的父节点并去重
export const findAllChildrenForTree = (arr: any[], allArr: any[]) => {
  const res: any[] = []
  const result: any[] = []
  arr.forEach((item: any) => {
    recursiveChildrenSearch(allArr, item, res)
  })
  res.forEach((item: any) => {
    recursiveSupervisorSearch(allArr, item, result)
  })
  return [...new Set(result)].map((key: string) => {
    return allArr.find((k: any) => k.id === key)
  })
}
