package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 测评报告 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_report")
public class AssessReport extends BaseEntity {

    @TableId(value = "report_id", type = IdType.AUTO)
    private Long reportId;

    /** 测评记录ID */
    private Long recordId;

    /** 量表ID */
    private Long scaleId;

    /** 受测者ID */
    private Long userId;

    /** 报告类型（0自动 1人工复核） */
    private String reportType;

    /** 原始总分 */
    private BigDecimal totalRawScore;

    /** 标准总分 */
    private BigDecimal totalStdScore;

    /** 风险等级（0正常 1轻度 2中度 3重度） */
    private String riskLevel;

    /** 症状筛查标记 */
    private String symptomFlag;

    /** 特质解读 */
    private String traitAnalysis;

    /** 建议 */
    private String suggestion;

    /** 复核状态（0待复核 1已复核 2无需复核） */
    private String reviewStatus;

    /** 复核人ID */
    private Long reviewerId;

    /** 复核时间 */
    private Date reviewTime;

    /** 复核意见 */
    private String reviewComment;

    /** 报告加密密钥 */
    private String encryptKey;

    /** PDF报告地址 */
    private String pdfUrl;

    /** 状态（0生成中 1已生成 2生成失败） */
    private String status;

    /** 删除标志 */
    @TableLogic
    private String delFlag;
}
