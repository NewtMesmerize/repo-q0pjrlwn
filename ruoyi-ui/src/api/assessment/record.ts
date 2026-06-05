import request from '@/utils/request';

/**
 * 测评记录 API
 */

/** 查询测评记录分页列表 */
export function listRecord(query: any) {
  return request({
    url: '/assessment/record/list',
    method: 'get',
    params: query
  });
}

/** 查询测评记录详情 */
export function getRecord(recordId: number) {
  return request({
    url: `/assessment/record/${recordId}`,
    method: 'get'
  });
}

/** 删除测评记录 */
export function delRecord(recordIds: string) {
  return request({
    url: `/assessment/record/${recordIds}`,
    method: 'delete'
  });
}
