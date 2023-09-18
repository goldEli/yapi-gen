// 用于浏览器标题

const useSetTitle = () => {
  const asyncSetTitle = (asyncTitle: any) => {
    document.title = `${asyncTitle} -iFUN AGILE`
  }

  return asyncSetTitle
}

export default useSetTitle
