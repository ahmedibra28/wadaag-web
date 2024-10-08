import axios from 'axios'

let baseUrl = ''

// check i'm in development mode or production mode
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:3000/api'
} else {
  baseUrl = 'https://wadaag.app/api'
}

export const userInfo = () => {
  return {
    userInfo:
      typeof window !== 'undefined' && localStorage.getItem('userInfo')
        ? JSON.parse(
            typeof window !== 'undefined' &&
              (localStorage.getItem('userInfo') as string | any)
          )
        : null,
  }
}

export const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo()?.userInfo?.token}`,
    },
  }
}

const axiosApi = async (method: string, url: string, obj = {}) => {
  try {
    switch (method) {
      case 'GET':
        return await axios
          .get(`${baseUrl}/${url}`, config())
          .then((res) => res.data)

      case 'POST':
        return await axios
          .post(`${baseUrl}/${url}`, obj, config())
          .then((res) => res.data)

      case 'PUT':
        return await axios
          .put(`${baseUrl}/${url}`, obj, config())
          .then((res) => res.data)

      case 'DELETE':
        return await axios
          .delete(`${baseUrl}/${url}`, config())
          .then((res) => res.data)
    }
  } catch (error: any) {
    throw error?.response?.data?.error
  }
}

export default axiosApi
