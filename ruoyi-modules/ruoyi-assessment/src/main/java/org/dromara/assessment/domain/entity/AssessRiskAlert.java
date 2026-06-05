package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.util.Date;

/**
 * 风险预警记录 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_risk_alert")
public class AssessRiskAlert extends BaseEntity {

    @TableId(value = "alert_id", type = IdType.AUTO)
    private Long alertId;

    /** 报告ID */
    private Long reportId;

    /** 测评记录ID */
    private Long recordId;

    /** 受测者ID */
    private Long userId;

    /** 风险等级（1轻度 2中度 3重度） */
    private String riskLevel;

    /** 风险详情 */
    private String riskDetail;

    /** 处理状态（0待处理 1已介入 2已关闭） */
    private String handleStatus;

    /** 处理人ID（心理师） */
    private Long handlerId;

    /** 处理时间 */
    private Date handleTime;

    /** 处理结果 */
    private String handleResult;
}
