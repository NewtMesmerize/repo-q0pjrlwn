package org.dromara.assessment.domain.vo;

import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessQuestionOption;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 题目选项 视图对象
 */
@Data
@AutoMapper(target = AssessQuestionOption.class)
public class AssessQuestionOptionVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long optionId;

    private Long questionId;

    private String label;

    private String content;

    private BigDecimal score;

    private Integer sortOrder;
}
