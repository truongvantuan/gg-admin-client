import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

// Create axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api base_url
  timeout: 15000 // Request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // Let each request carry a custom token, please modify it according to the actual situation
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(
  response => {
    /**
     * If the code is not 200, it means throwing an error.
     * You can modify it according to your own business.
     */
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })

      // 401:Not logged in;
      if (res.code === 401) {
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'OK to log out', {
          confirmButtonText: 'Re-register',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // In order to re-instantiate the vue-router object to avoid bugs
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
