package org.dromara.assessment.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessPlan;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.util.Date;

/**
 * 测评计划 业务对象
 */
@Data
@AutoMapper(target = AssessPlan.class, reverseConvertGenerate = false)
public class AssessPlanBo extends BaseEntity {

    private Long planId;

    @NotBlank(message = "计划名称不能为空")
    private String planName;

    @NotNull(message = "关联量表不能为空")
    private Long scaleId;

    private String planType;

    private Date startTime;

    private Date endTime;

    private Integer maxAttempts;

    private Integer ageMin;

    private Integer ageMax;

    private String targetScope;

    private String consentText;

    private String privacyText;

    private String instructions;

    private String reportTemplate;

    private String status;

    private String remark;
}
