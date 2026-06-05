package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.math.BigDecimal;

/**
 * 计分规则 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_scoring_rule")
public class AssessScoringRule extends BaseEntity {

    @TableId(value = "rule_id", type = IdType.AUTO)
    private Long ruleId;

    /** 所属量表ID */
    private Long scaleId;

    /** 所属维度ID */
    private Long dimensionId;

    /** 规则名称 */
    private String ruleName;

    /** 规则类型（0直接求和 1加权求和 2公式计算） */
    private String ruleType;

    /** 计分公式 */
    private String formula;

    /** 最低分 */
    private BigDecimal scoreMin;

    /** 最高分 */
    private BigDecimal scoreMax;

    /** 备注 */
    private String remark;
}
