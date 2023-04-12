import * as http from '../tools/http'

export const getStatTempList: any = async () => {
  const response = await http.get('statTempList')
  return response.data
}

export const getStatUserList: any = async () => {
  const response = await http.get('statUserList')
  return response.data
}

export const getStatInfo: any = async () => {
  const response = await http.get('statInfo')
  return response.data
}

export const getStatTempUsage: any = async () => {
  const response = await http.get('statTempUsage')
  return response.data
}
