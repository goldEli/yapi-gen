const generateTransparentSVG = (params?: { width?: number; height?: number }) =>
  `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
      params?.width ?? 1
    } ${params?.height ?? 1}"/>`,
  )}`

export default generateTransparentSVG
