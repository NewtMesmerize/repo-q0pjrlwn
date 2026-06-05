package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 作答记录 实体类
 */
@Data
@TableName("assess_answer")
public class AssessAnswer {

    @TableId(value = "answer_id", type = IdType.AUTO)
    private Long answerId;

    /** 测评记录ID */
    private Long recordId;

    /** 题目ID */
    private Long questionId;

    /** 选中选项ID */
    private Long optionId;

    /** 开放式问答内容 */
    private String answerText;

    /** 得分 */
    private BigDecimal score;

    /** 作答时间 */
    private Date answerTime;

    /** 答题耗时(秒) */
    private Integer timeSpent;

    /** 创建时间 */
    private Date createTime;

    /** 更新时间 */
    private Date updateTime;
}
