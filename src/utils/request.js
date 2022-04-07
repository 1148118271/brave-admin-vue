import axios from 'axios'
import { Message } from 'element-ui'
import { TokenKey } from '@/utils/auth'
import Vue from 'vue'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers[TokenKey] = Vue.ls.get(TokenKey)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const data = response.data
    if (data.code === 999) {
      Vue.ls.clear()
      Message.error(response.data.msg)
      location.reload()
      return response
    }
    const token = Vue.ls.get(TokenKey)
    if (!token) {
      const token = response.headers['token']
      Vue.ls.set(TokenKey, token)
    }
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
