import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改  'Bearer ' +

  config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded' // application/json
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// respone interceptor
service.interceptors.response.use(
  // response => response,
  response => {
    const res = response.data
    // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    if (res.code === 401 || res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // 请自行在引入 MessageBox
      // import { Message, MessageBox } from 'element-ui'

      // return Promise.reject('error')
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug

    return Promise.reject(error)
  })
export default service
