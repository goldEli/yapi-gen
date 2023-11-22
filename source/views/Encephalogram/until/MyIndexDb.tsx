import Dexie from 'dexie'

const getIndexDb = () => {
  const db = new Dexie('encephalogram')
  db.version(1).stores({
    item: '++id,project_id,group_by',
  })
  return db
}

export default getIndexDb()
