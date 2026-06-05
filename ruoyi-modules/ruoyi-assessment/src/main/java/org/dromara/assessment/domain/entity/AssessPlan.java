package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.tenant.core.TenantEntity;

import java.util.Date;

/**
 * 测评计划 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_plan")
public class AssessPlan extends TenantEntity {

    @TableId(value = "plan_id", type = IdType.AUTO)
    private Long planId;

    /** 计划名称 */
    private String planName;

    /** 关联量表ID */
    private Long scaleId;

    /** 发布类型（0个人开放 1校园普查 2定向测评） */
    private String planType;

    /** 开始时间 */
    private Date startTime;

    /** 结束时间 */
    private Date endTime;

    /** 最大作答次数 */
    private Integer maxAttempts;

    /** 年龄限制-最小 */
    private Integer ageMin;

    /** 年龄限制-最大 */
    private Integer ageMax;

    /** 参与范围描述 */
    private String targetScope;

    /** 知情同意书内容 */
    private String consentText;

    /** 隐私保密承诺 */
    private String privacyText;

    /** 测评须知 */
    private String instructions;

    /** 报告模板（0标准 1简版 2专业版） */
    private String reportTemplate;

    /** 状态（0草稿 1发布 2已结束 3已归档） */
    private String status;

    /** 备注 */
    private String remark;

    /** 删除标志 */
    @TableLogic
    private String delFlag;
}
