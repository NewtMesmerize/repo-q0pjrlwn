package org.dromara.assessment.domain.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 报告维度得分 视图对象
 */
@Data
public class AssessReportDimensionVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;

    private Long reportId;

    private Long dimensionId;

    /** 维度名称 */
    private String dimensionName;

    private BigDecimal rawScore;

    private BigDecimal stdScore;

    private String normCompare;

    private String riskLevel;

    private String interpretation;
}
