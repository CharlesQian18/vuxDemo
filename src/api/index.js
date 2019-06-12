import request from '@/api/request'

// http://120.236.71.199:8018/report/crmReport
// http://192.168.10.10/api/

// var url = 'http://120.236.71.199:8018/'
// var url = 'http://120.236.71.199:8882/api/'

var url = 'http://192.168.1.75:8888/'

export function images (query, suffix) {
  return request({
    url: url + suffix,
    method: 'post',
    data: query
  })
}
export function get (query, suffix) {
  return request({
    url: suffix,
    method: 'get',
    params: query
  })
}

export function search (query, suffix) {
  return request({
    url: url + suffix,
    method: 'get',
    params: query
  })
}

export function searchALL (suffix) {
  return request({
    url: suffix,
    method: 'get'
    // params: query
  })
}

export function searchNew (query, suffix) {
  // console.log(query)
  return request({
    url: url + suffix,
    method: 'post',
    data: query
  })
}
export function add (query, suffix) {
  // console.log(query)
  return request({
    url: url + suffix,
    method: 'post',
    data: query
  })
}

export function update (query, suffix) {
  return request({
    url: url + suffix + '/' + query.id,
    method: 'patch',
    // headers:{"Content-Type": "application/x-www-form-urlencoded","Cache-Control": "no-cache"},
    data: query
  })
}

export function NewPost (query, suffix) {
  return request({
    url: suffix,
    method: 'post',
    // headers:{"Content-Type": "application/x-www-form-urlencoded","Cache-Control": "no-cache"},
    data: query
  })
}

export function del (query, suffix) {
  return request({
    url: url + suffix,
    method: 'delete',
    data: query
  })
}
export function importExcel (query, suffix) {
  return request({
    url: url + suffix,
    method: 'post',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: query
  })
}
export function getUrl () {
  return url
}
