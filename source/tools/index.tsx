function getIsPermission(arr: any, value: string) {
  return !arr?.filter((i: any) => i.identity === value).length
}

function openDetail(url: string) {
  window.open(`${window.origin}${import.meta.env.__URL_ALIAS__}${url}`)
}

export { getIsPermission, openDetail }
