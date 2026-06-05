package org.dromara.assessment.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessRiskAlert;
import org.dromara.common.mybatis.core.domain.BaseEntity;

/**
 * 风险预警 业务对象
 */
@Data
@AutoMapper(target = AssessRiskAlert.class, reverseConvertGenerate = false)
public class AssessRiskAlertBo extends BaseEntity {

    private Long alertId;

    private Long reportId;

    private Long recordId;

    private Long userId;

    private String riskLevel;

    private String riskDetail;

    private String handleStatus;

    private Long handlerId;

    private String handleResult;
}
