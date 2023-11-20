export const flattenObjectToArray = (obj: any, array: any[] = []) => {
  if (Array.isArray(obj.children)) {
    const temp = { ...obj }
    delete temp.children
    array.push(temp)
    obj.children.forEach((item: any) => {
      flattenObjectToArray(item, array)
    })
  } else {
    array.push(obj)
  }
  return array
}

export const buildIntactTree = (arr: any[]) => {
  // 构建 id 到对象的映射
  const idMap = arr.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})

  // 通过 parent_id 构建树形结构
  const tree = arr.reduce((tree, item) => {
    const parent = idMap[item.parent_id]
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

  return tree
}

export const filerMapData = () => {}
