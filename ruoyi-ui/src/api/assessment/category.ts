import request from '@/utils/request';

/**
 * 量表分类 API
 */

/** 查询分类树形列表 */
export function listCategoryTree(query?: any) {
  return request({
    url: '/assessment/category/tree',
    method: 'get',
    params: query
  });
}

/** 查询分类详情 */
export function getCategory(categoryId: number) {
  return request({
    url: `/assessment/category/${categoryId}`,
    method: 'get'
  });
}

/** 新增分类 */
export function addCategory(data: any) {
  return request({
    url: '/assessment/category',
    method: 'post',
    data
  });
}

/** 修改分类 */
export function updateCategory(data: any) {
  return request({
    url: '/assessment/category',
    method: 'put',
    data
  });
}

/** 删除分类 */
export function delCategory(categoryId: number) {
  return request({
    url: `/assessment/category/${categoryId}`,
    method: 'delete'
  });
}
