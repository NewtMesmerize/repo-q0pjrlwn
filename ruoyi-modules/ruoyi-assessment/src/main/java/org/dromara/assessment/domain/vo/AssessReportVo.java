package org.dromara.assessment.domain.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessReport;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 测评报告 视图对象
 */
@Data
@AutoMapper(target = AssessReport.class)
public class AssessReportVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @ExcelProperty(value = "报告ID")
    private Long reportId;

    private Long recordId;

    private Long scaleId;

    /** 量表名称 */
    private String scaleName;

    @ExcelProperty(value = "受测者ID")
    private Long userId;

    /** 受测者姓名 */
    private String userName;

    @ExcelProperty(value = "报告类型")
    private String reportType;

    @ExcelProperty(value = "原始总分")
    private BigDecimal totalRawScore;

    @ExcelProperty(value = "标准总分")
    private BigDecimal totalStdScore;

    @ExcelProperty(value = "风险等级")
    private String riskLevel;

    private String symptomFlag;

    private String traitAnalysis;

    private String suggestion;

    @ExcelProperty(value = "复核状态")
    private String reviewStatus;

    private Long reviewerId;

    private Date reviewTime;

    private String reviewComment;

    private String pdfUrl;

    @ExcelProperty(value = "状态")
    private String status;

    private Date createTime;

    /** 维度得分列表 */
    private List<AssessReportDimensionVo> dimensions;
}
