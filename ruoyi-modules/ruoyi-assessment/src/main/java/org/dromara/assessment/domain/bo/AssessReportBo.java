package org.dromara.assessment.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessReport;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.math.BigDecimal;

/**
 * 测评报告 业务对象
 */
@Data
@AutoMapper(target = AssessReport.class, reverseConvertGenerate = false)
public class AssessReportBo extends BaseEntity {

    private Long reportId;

    private Long recordId;

    private Long scaleId;

    private Long userId;

    private String reportType;

    private BigDecimal totalRawScore;

    private BigDecimal totalStdScore;

    private String riskLevel;

    private String symptomFlag;

    private String traitAnalysis;

    private String suggestion;

    private String reviewStatus;

    private Long reviewerId;

    private String reviewComment;

    private String status;
}
