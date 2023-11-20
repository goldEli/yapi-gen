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
