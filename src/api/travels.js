import request from '@/utils/request';

export function postTravelBook(data) {
  return request({
    url: '/api/TravelBook',
    method: 'post',
    data
  })
}

export function getList(query) {
  return request({
    url: '/api/TravelBook',
    method: 'get',
    params: query
  })
}
export function getGoodList(query) {
  return request({
    url: '/api/TravelBook',
    method: 'get',
    params: query
  })
}

export function getTBList(query) {
  return request({
    url: '/api/TravelBook/user',
    method: 'get',
    params: query
  })
}
