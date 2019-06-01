import request from '@/utils/request';
export function getCommentList(query) {
  return request({
    url: '/api/Comment',
    method: 'get',
    params: query
  })
}

export function deleteComment(data) {
  return request({
    url: '/api/Comment',
    method: 'delete',
    data
  })
}
