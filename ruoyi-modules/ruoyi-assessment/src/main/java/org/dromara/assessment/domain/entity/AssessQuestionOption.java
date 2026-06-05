package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.math.BigDecimal;

/**
 * 题目选项 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_question_option")
public class AssessQuestionOption extends BaseEntity {

    @TableId(value = "option_id", type = IdType.AUTO)
    private Long optionId;

    /** 所属题目ID */
    private Long questionId;

    /** 选项标签(A/B/C...) */
    private String label;

    /** 选项内容 */
    private String content;

    /** 选项分值 */
    private BigDecimal score;

    /** 显示顺序 */
    private Integer sortOrder;
}
