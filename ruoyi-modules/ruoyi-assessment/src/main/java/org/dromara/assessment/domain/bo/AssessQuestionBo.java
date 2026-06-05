package org.dromara.assessment.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessQuestion;
import org.dromara.common.mybatis.core.domain.BaseEntity;

/**
 * 量表题目 业务对象
 */
@Data
@AutoMapper(target = AssessQuestion.class, reverseConvertGenerate = false)
public class AssessQuestionBo extends BaseEntity {

    private Long questionId;

    @NotNull(message = "所属量表不能为空")
    private Long scaleId;

    private Long dimensionId;

    private String questionType;

    private Integer sortOrder;

    @NotBlank(message = "题目内容不能为空")
    private String content;

    private String imageUrl;

    private Boolean isReverse;

    private Boolean required;

    private String remark;
}
