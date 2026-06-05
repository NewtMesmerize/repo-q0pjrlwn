package org.dromara.assessment.service;

import org.dromara.assessment.domain.bo.AssessReportBo;
import org.dromara.assessment.domain.vo.AssessReportVo;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;

import java.util.List;

/**
 * 测评报告 服务接口
 */
public interface IAssessReportService {

    TableDataInfo<AssessReportVo> queryPageList(AssessReportBo bo, PageQuery pageQuery);

    AssessReportVo queryById(Long reportId);

    /**
     * 人工复核报告
     */
    Boolean review(Long reportId, String reviewComment);

    Boolean deleteByIds(List<Long> reportIds);
}
