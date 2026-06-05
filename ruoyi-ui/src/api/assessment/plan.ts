import request from '@/utils/request';

/**
 * 测评计划 API
 */

/** 查询测评计划分页列表 */
export function listPlan(query: any) {
  return request({
    url: '/assessment/plan/list',
    method: 'get',
    params: query
  });
}

/** 查询测评计划详情 */
export function getPlan(planId: number) {
  return request({
    url: `/assessment/plan/${planId}`,
    method: 'get'
  });
}

/** 新增测评计划 */
export function addPlan(data: any) {
  return request({
    url: '/assessment/plan',
    method: 'post',
    data
  });
}

/** 修改测评计划 */
export function updatePlan(data: any) {
  return request({
    url: '/assessment/plan',
    method: 'put',
    data
  });
}

/** 删除测评计划 */
export function delPlan(planIds: string) {
  return request({
    url: `/assessment/plan/${planIds}`,
    method: 'delete'
  });
}

/** 发布测评计划 */
export function publishPlan(planId: number) {
  return request({
    url: `/assessment/plan/publish/${planId}`,
    method: 'put'
  });
}

/** 结束测评计划 */
export function finishPlan(planId: number) {
  return request({
    url: `/assessment/plan/finish/${planId}`,
    method: 'put'
  });
}
