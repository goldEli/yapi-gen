declare namespace API.Efficiency {
  namespace historyWorkList {
    type Params = {
      id: number
    }
    type Result = {
      id: number
      name: string
      email: string
      avatar: string
      role: {
        id: number
        name: string
      }
      work_record: Array<Models.Efficiency.WorkRecord>
      created_word: Array<Models.Efficiency.CreatedWord>
      word: Array<Models.Efficiency.CreatedWord>
    }
  }
}
