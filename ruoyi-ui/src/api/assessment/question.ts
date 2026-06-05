import request from '@/utils/request';

/**
 * 量表题目 API
 */

/** 查询题目分页列表 */
export function listQuestion(query: any) {
  return request({
    url: '/assessment/question/list',
    method: 'get',
    params: query
  });
}

/** 查询量表下所有题目（含选项） */
export function listQuestionByScale(scaleId: number) {
  return request({
    url: `/assessment/question/scale/${scaleId}`,
    method: 'get'
  });
}

/** 查询题目详情 */
export function getQuestion(questionId: number) {
  return request({
    url: `/assessment/question/${questionId}`,
    method: 'get'
  });
}

/** 新增题目 */
export function addQuestion(data: any) {
  return request({
    url: '/assessment/question',
    method: 'post',
    data
  });
}

/** 修改题目 */
export function updateQuestion(data: any) {
  return request({
    url: '/assessment/question',
    method: 'put',
    data
  });
}

/** 删除题目 */
export function delQuestion(questionIds: string) {
  return request({
    url: `/assessment/question/${questionIds}`,
    method: 'delete'
  });
}
