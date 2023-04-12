export function addIdToScheduleList(data: API.Schedule.GetScheduleList.Result) {
  for (const key in data) {
    const item = data[key]
    item.forEach(i => {
      i.id = i.schedule_id + key
    })
  }
  return data
}
