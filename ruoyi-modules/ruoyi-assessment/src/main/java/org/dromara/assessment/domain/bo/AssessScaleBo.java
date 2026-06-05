package org.dromara.assessment.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessScale;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.math.BigDecimal;

/**
 * 量表 业务对象
 */
@Data
@AutoMapper(target = AssessScale.class, reverseConvertGenerate = false)
public class AssessScaleBo extends BaseEntity {

    /** 量表ID */
    private Long scaleId;

    /** 所属分类ID */
    @NotNull(message = "所属分类不能为空")
    private Long categoryId;

    /** 量表名称 */
    @NotBlank(message = "量表名称不能为空")
    @Size(max = 200, message = "量表名称长度不能超过200个字符")
    private String scaleName;

    /** 量表编码 */
    @NotBlank(message = "量表编码不能为空")
    @Size(max = 64, message = "量表编码长度不能超过64个字符")
    private String scaleCode;

    /** 类型 */
    private String scaleType;

    /** 价格 */
    private BigDecimal price;

    /** 简介 */
    private String description;

    /** 信效度说明 */
    private String validityInfo;

    /** 常模来源 */
    private String normSource;

    /** 适用人群 */
    private String targetPopulation;

    /** 测评时长 */
    private Integer durationMinutes;

    /** 题目数量 */
    private Integer questionCount;

    /** 版权备案信息 */
    private String copyrightInfo;

    /** 量表版本 */
    private String version;

    /** 试测体验 */
    private Boolean trialEnabled;

    /** 试测题数 */
    private Integer trialCount;

    /** 封面图片 */
    private String coverImage;

    /** 状态 */
    private String status;

    /** 备注 */
    private String remark;
}
