import moment from 'moment'

export const flattenObjectToArray = (
  obj: any,
  group_by: string,
  array: any[] = [],
) => {
  if (Array.isArray(obj.children)) {
    const temp = { ...obj, id: String(obj.id), group_by }
    delete temp.children
    array.push(temp)
    obj.children.forEach((item: any) => {
      flattenObjectToArray(item, group_by, array)
    })
  } else {
    array.push({ ...obj, id: String(obj.id), group_by })
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

  if (tree) {
    return tree[0]
  }
  return tree
}
