// 用于浏览器标题

const useSetTitle = () => {
  const asyncSetTitle = (asyncTitle: any) => {
    document.title = `${asyncTitle} -IFUN AGILE`
  }

  return asyncSetTitle
}

export default useSetTitle
