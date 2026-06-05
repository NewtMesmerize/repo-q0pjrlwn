package org.dromara.assessment.domain.vo;

import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessQuestion;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 量表题目 视图对象
 */
@Data
@AutoMapper(target = AssessQuestion.class)
public class AssessQuestionVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long questionId;

    private Long scaleId;

    private Long dimensionId;

    /** 维度名称 */
    private String dimensionName;

    private String questionType;

    private Integer sortOrder;

    private String content;

    private String imageUrl;

    private Boolean isReverse;

    private Boolean required;

    private String remark;

    private Date createTime;

    /** 选项列表 */
    private List<AssessQuestionOptionVo> options;
}
