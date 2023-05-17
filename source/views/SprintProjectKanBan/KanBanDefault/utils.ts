export const handleId = (groupId: number, id: number) => {
  return `${groupId}-${id}`
}

// id: groupId-id
export const getId = (idStr: string) => {
  const [groupId, id] = idStr.split('-')

  return {
    groupId: parseInt(groupId, 10),
    id: parseInt(id, 10),
  }
}
