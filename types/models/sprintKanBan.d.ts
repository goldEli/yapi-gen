declare namespace Model.SprintKanBan {
  interface ViewItem {
    key: string
    value: string
    check: boolean
    isDefault?: boolean
    operation?: boolean
  }
}
