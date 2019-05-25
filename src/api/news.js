import request from '@/utils/request';

export function publishNews(data) {
  return request({
    url: 'api/Newspaper',
    method: 'post',
    data
  })
}
