import request from '@/utils/request';

/**
 * 量表管理 API
 */

/** 查询量表分页列表 */
export function listScale(query: any) {
  return request({
    url: '/assessment/scale/list',
    method: 'get',
    params: query
  });
}

/** 查询量表详情 */
export function getScale(scaleId: number) {
  return request({
    url: `/assessment/scale/${scaleId}`,
    method: 'get'
  });
}

/** 新增量表 */
export function addScale(data: any) {
  return request({
    url: '/assessment/scale',
    method: 'post',
    data
  });
}

/** 修改量表 */
export function updateScale(data: any) {
  return request({
    url: '/assessment/scale',
    method: 'put',
    data
  });
}

/** 删除量表 */
export function delScale(scaleIds: string) {
  return request({
    url: `/assessment/scale/${scaleIds}`,
    method: 'delete'
  });
}

/** 导出量表 */
export function exportScale(query: any) {
  return request({
    url: '/assessment/scale/export',
    method: 'post',
    params: query,
    responseType: 'blob'
  });
}
