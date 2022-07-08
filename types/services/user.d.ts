declare namespace Services.User {
  export type GetUser = (id: string) => Promise<Models.User.User>
}
