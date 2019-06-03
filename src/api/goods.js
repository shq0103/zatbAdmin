import request from '@/utils/request';
export function getGoodsList(query) {
  return request({
    url: '/api/Goods',
    method: 'get',
    params: query
  })
}

export function deleteGoods(id) {
  return request({
    url: `/api/Goods/${id}`,
    method: 'delete'
  })
}
