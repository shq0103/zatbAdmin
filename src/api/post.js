import request from '@/utils/request';
export function getPostList(query) {
  return request({
    url: '/api/Post',
    method: 'get',
    params: query
  })
}

export function deletePost(data) {
  return request({
    url: '/api/Post',
    method: 'delete',
    data
  })
}
