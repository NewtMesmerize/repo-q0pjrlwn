import request from '@/utils/request';

/**
 * 测评报告 API
 */

/** 查询测评报告分页列表 */
export function listReport(query: any) {
  return request({
    url: '/assessment/report/list',
    method: 'get',
    params: query
  });
}

/** 查询测评报告详情 */
export function getReport(reportId: number) {
  return request({
    url: `/assessment/report/${reportId}`,
    method: 'get'
  });
}

/** 人工复核报告 */
export function reviewReport(reportId: number, reviewComment: string) {
  return request({
    url: `/assessment/report/review/${reportId}`,
    method: 'put',
    params: { reviewComment }
  });
}

/** 删除测评报告 */
export function delReport(reportIds: string) {
  return request({
    url: `/assessment/report/${reportIds}`,
    method: 'delete'
  });
}
