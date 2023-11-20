import Dexie from 'dexie'

const getIndexDb = () => {
  const db = new Dexie('encephalogram')
  db.version(1).stores({
    project: '++id',
    item: 'project_id',
  })
  return db
}

export default getIndexDb()
