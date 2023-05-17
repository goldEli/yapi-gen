declare namespace Model.SprintKanBan {
  interface Option {
    key: string
    value: string
    check: boolean
    isDefault?: boolean
    operation?: boolean
  }

  type guideVisible = boolean
}
