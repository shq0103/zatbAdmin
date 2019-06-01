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
export function deleteTravels(data) {
  return request({
    url: '/api/TravelBook',
    method: 'delete',
    data
  })
}
export function updateTravels(user) {
  return request({
    url: '/api/TravelBook',
    method: 'put',
    data: user
  })
}

export function validTravels(id, status) {
  return request({
    url: '/api/TravelBook/status',
    method: 'put',
    params: { id, status }
  })
}

export function getTravelsDetail(id) {
  return request({
    url: `/api/TravelBook/${id}`,
    method: 'get'
  })
}
