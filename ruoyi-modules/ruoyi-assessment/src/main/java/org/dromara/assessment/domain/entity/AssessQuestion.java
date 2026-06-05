package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.mybatis.core.domain.BaseEntity;

/**
 * 量表题目 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_question")
public class AssessQuestion extends BaseEntity {

    @TableId(value = "question_id", type = IdType.AUTO)
    private Long questionId;

    /** 所属量表ID */
    private Long scaleId;

    /** 所属维度ID */
    private Long dimensionId;

    /** 题型（0李克特 1情景选择 2投射测试 3开放问答 4趣味题） */
    private String questionType;

    /** 题目序号 */
    private Integer sortOrder;

    /** 题目内容 */
    private String content;

    /** 题目图片 */
    private String imageUrl;

    /** 是否反向计分 */
    private Boolean isReverse;

    /** 是否必答 */
    private Boolean required;

    /** 备注 */
    private String remark;
}
