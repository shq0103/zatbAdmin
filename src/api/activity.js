import request from '@/utils/request';

export function publicActivity(data) {
  return request({
    url: 'api/Activity',
    method: 'post',
    data
  })
}

export function getActivityList(query) {
  return request({
    url: '/api/Activity',
    method: 'get',
    params: query
  })
}
export function getJoinList(query) {
  return request({
    url: '/api/ActivityJion',
    method: 'get',
    params: query
  })
}
export function deleteActivity(data) {
  return request({
    url: '/api/Activity',
    method: 'delete',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: `/api/ActivityJion/${id}`,
    method: 'delete'
  })
}
export function validActivity(id, status) {
  return request({
    url: '/api/Activity/status',
    method: 'put',
    params: { id, status }
  })
}
export function validUser(id, status) {
  return request({
    url: '/api/ActivityJion',
    method: 'put',
    params: { id, status }
  })
}
export function updateActivity(user) {
  return request({
    url: '/api/Activity',
    method: 'put',
    data: user
  })
}
export function getAcDetail(id) {
  return request({
    url: `/api/Activity/${id}`,
    method: 'get'
  })
}

export function putActivity(data) {
  return request({
    url: `/api/Activity`,
    method: 'put',
    data
  })
}
