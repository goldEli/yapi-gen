import Dexie from 'dexie'

const getIndexDb = () => {
  const db = new Dexie('encephalogram')
  db.version(1).stores({
    user: '++id,project_id',
    task: '++id,project_id',
  })
  return db
}

export default getIndexDb()
