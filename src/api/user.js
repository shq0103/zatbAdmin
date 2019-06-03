import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function mlogin(data) {
  return request({
    url: '/api/auth',
    method: 'post',
    data
  })
}

export function mGetInfo() {
  return request({
    url: '/api/Auth/user',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getList(query) {
  return request({
    url: '/api/User',
    method: 'get',
    params: query
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/User',
    method: 'delete',
    data
  })
}

export function updateUser(user) {
  return request({
    url: '/api/User',
    method: 'put',
    data: user
  })
}
export function getUserDetail(id) {
  return request({
    url: `/api/User/${id}`,
    method: 'get'
  })
}
