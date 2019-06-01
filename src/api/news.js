import request from '@/utils/request';

export function publishNews(data) {
  return request({
    url: 'api/Newspaper',
    method: 'post',
    data
  })
}

export function getList(query) {
  return request({
    url: '/api/Newspaper',
    method: 'get',
    params: query
  })
}

export function deleteNews(data) {
  return request({
    url: 'api/Newspaper',
    method: 'delete',
    data
  })
}

export function getNewsDetail(id) {
  return request({
    url: `/api/Newspaper/${id}`,
    method: 'get'
  })
}
