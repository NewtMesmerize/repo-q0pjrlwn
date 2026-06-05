package org.dromara.assessment.service;

import org.dromara.assessment.domain.bo.AssessPlanBo;
import org.dromara.assessment.domain.vo.AssessPlanVo;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;

import java.util.List;

/**
 * 测评计划 服务接口
 */
public interface IAssessPlanService {

    TableDataInfo<AssessPlanVo> queryPageList(AssessPlanBo bo, PageQuery pageQuery);

    AssessPlanVo queryById(Long planId);

    Boolean insertByBo(AssessPlanBo bo);

    Boolean updateByBo(AssessPlanBo bo);

    Boolean deleteByIds(List<Long> planIds);

    /**
     * 发布测评计划
     */
    Boolean publish(Long planId);

    /**
     * 结束测评计划
     */
    Boolean finish(Long planId);
}
