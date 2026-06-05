package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.tenant.core.TenantEntity;

import java.math.BigDecimal;

/**
 * 量表主表 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_scale")
public class AssessScale extends TenantEntity {

    @TableId(value = "scale_id", type = IdType.AUTO)
    private Long scaleId;

    /** 所属分类ID */
    private Long categoryId;

    /** 量表名称 */
    private String scaleName;

    /** 量表编码 */
    private String scaleCode;

    /** 类型（0免费 1付费 2团体定向） */
    private String scaleType;

    /** 价格 */
    private BigDecimal price;

    /** 量表简介 */
    private String description;

    /** 信效度说明 */
    private String validityInfo;

    /** 常模来源 */
    private String normSource;

    /** 适用人群 */
    private String targetPopulation;

    /** 测评时长(分钟) */
    private Integer durationMinutes;

    /** 题目数量 */
    private Integer questionCount;

    /** 版权备案信息 */
    private String copyrightInfo;

    /** 量表版本 */
    private String version;

    /** 是否开启试测体验 */
    private Boolean trialEnabled;

    /** 试测体验题目数 */
    private Integer trialCount;

    /** 封面图片 */
    private String coverImage;

    /** 状态 */
    private String status;

    /** 备注 */
    private String remark;

    /** 删除标志 */
    @TableLogic
    private String delFlag;
}
