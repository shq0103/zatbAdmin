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

export function deleteActivity(data) {
  return request({
    url: '/api/Activity/${id}',
    method: 'delete',
    data
  })
}
