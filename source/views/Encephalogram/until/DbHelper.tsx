import db from './MyIndexDb'

export const haveHistoryData = async (id: number, group_by: string) => {
  if (!db.isOpen()) {
    await db.open()
  }
  const table = (db as any)[group_by]
  let pm
  if (table) {
    pm = new Promise(resolve => {
      table.where({ project_id: id }).count((count: any) => {
        if (count <= 0) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }
  return pm
}

export const addTaskForTable = async (
  id: number,
  tasks: any,
  group_by: string,
) => {
  if (!db.isOpen()) {
    await db.open()
  }
  const hasId: any = await haveHistoryData(id, group_by)
  const table = (db as any)[group_by]
  if (table && !hasId) {
    table.bulkPut(tasks)
  }
}

export const delTaskForTable = async (id: number, group_by: string) => {
  if (!db.isOpen()) {
    await db.open()
  }
  const table = (db as any)[group_by]
  if (table) {
    await table.where({ project_id: id }).delete()
  }
}

export const dbs = db
