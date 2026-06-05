package org.dromara.assessment.service;

import org.dromara.assessment.domain.bo.AssessQuestionBo;
import org.dromara.assessment.domain.vo.AssessQuestionVo;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;

import java.util.List;

/**
 * 量表题目 服务接口
 */
public interface IAssessQuestionService {

    /**
     * 查询题目分页列表
     */
    TableDataInfo<AssessQuestionVo> queryPageList(AssessQuestionBo bo, PageQuery pageQuery);

    /**
     * 查询量表下所有题目（含选项）
     */
    List<AssessQuestionVo> queryListByScaleId(Long scaleId);

    /**
     * 查询题目详情
     */
    AssessQuestionVo queryById(Long questionId);

    /**
     * 新增题目
     */
    Boolean insertByBo(AssessQuestionBo bo);

    /**
     * 修改题目
     */
    Boolean updateByBo(AssessQuestionBo bo);

    /**
     * 删除题目
     */
    Boolean deleteByIds(List<Long> questionIds);
}
