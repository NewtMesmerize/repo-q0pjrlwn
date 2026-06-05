package org.dromara.assessment.service;

import org.dromara.assessment.domain.bo.AssessScaleBo;
import org.dromara.assessment.domain.vo.AssessScaleVo;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;

import java.util.List;

/**
 * 量表 服务接口
 */
public interface IAssessScaleService {

    /**
     * 查询量表分页列表
     */
    TableDataInfo<AssessScaleVo> queryPageList(AssessScaleBo bo, PageQuery pageQuery);

    /**
     * 查询量表列表
     */
    List<AssessScaleVo> queryList(AssessScaleBo bo);

    /**
     * 查询量表详情
     */
    AssessScaleVo queryById(Long scaleId);

    /**
     * 新增量表
     */
    Boolean insertByBo(AssessScaleBo bo);

    /**
     * 修改量表
     */
    Boolean updateByBo(AssessScaleBo bo);

    /**
     * 删除量表
     */
    Boolean deleteByIds(List<Long> scaleIds);
}
