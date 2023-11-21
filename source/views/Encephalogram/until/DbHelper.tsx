import db from './MyIndexDb'

export const haveProjectData = async (id: number) => {
  if (!db.isOpen()) {
    await db.open()
  }
  const projectTable = (db as any).project
  let pm
  if (projectTable) {
    pm = new Promise(resolve => {
      projectTable
        .where('projectId')
        .equals(id)
        .count((count: any) => {
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

export const addTaskForTable = async (id: number, tasks: any) => {
  if (!db.isOpen()) {
    await db.open()
  }
  const hasId: any = await haveProjectData(id)
  const projectTable = (db as any).project
  if (projectTable && !hasId) {
    projectTable.add({ projectId: id })
  }
  const table = (db as any).item
  if (table) {
    table.bulkPut(tasks)
  }
}

export const delTaskForTable = async (id: number) => {
  if (!db.isOpen()) {
    await db.open()
  }
  const table = (db as any).item
  if (table) {
    await table.where({ project_id: id }).delete()
  }
}

export const dbs = db
