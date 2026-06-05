package org.dromara.assessment.service;

import org.dromara.assessment.domain.bo.AssessScaleCategoryBo;
import org.dromara.assessment.domain.vo.AssessScaleCategoryVo;

import java.util.List;

/**
 * 量表分类 服务接口
 */
public interface IAssessScaleCategoryService {

    /**
     * 查询分类树形列表
     */
    List<AssessScaleCategoryVo> queryTree(AssessScaleCategoryBo bo);

    /**
     * 查询分类详情
     */
    AssessScaleCategoryVo queryById(Long categoryId);

    /**
     * 新增分类
     */
    Boolean insertByBo(AssessScaleCategoryBo bo);

    /**
     * 修改分类
     */
    Boolean updateByBo(AssessScaleCategoryBo bo);

    /**
     * 删除分类
     */
    Boolean deleteById(Long categoryId);
}
