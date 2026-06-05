package org.dromara.assessment.service;

import org.dromara.assessment.domain.bo.AssessRiskAlertBo;
import org.dromara.assessment.domain.vo.AssessRiskAlertVo;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;

/**
 * 风险预警 服务接口
 */
public interface IAssessRiskAlertService {

    TableDataInfo<AssessRiskAlertVo> queryPageList(AssessRiskAlertBo bo, PageQuery pageQuery);

    AssessRiskAlertVo queryById(Long alertId);

    /**
     * 处理预警（心理师介入）
     */
    Boolean handle(Long alertId, Long handlerId, String handleResult);

    /**
     * 关闭预警
     */
    Boolean close(Long alertId);
}
