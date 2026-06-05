import request from '@/utils/request';

/**
 * 风险预警 API
 */

/** 查询风险预警分页列表 */
export function listRiskAlert(query: any) {
  return request({
    url: '/assessment/risk/list',
    method: 'get',
    params: query
  });
}

/** 查询预警详情 */
export function getRiskAlert(alertId: number) {
  return request({
    url: `/assessment/risk/${alertId}`,
    method: 'get'
  });
}

/** 处理预警 */
export function handleRiskAlert(alertId: number, handlerId: number, handleResult: string) {
  return request({
    url: `/assessment/risk/handle/${alertId}`,
    method: 'put',
    params: { handlerId, handleResult }
  });
}

/** 关闭预警 */
export function closeRiskAlert(alertId: number) {
  return request({
    url: `/assessment/risk/close/${alertId}`,
    method: 'put'
  });
}
