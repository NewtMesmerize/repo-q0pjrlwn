package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.math.BigDecimal;

/**
 * 常模数据 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_norm")
public class AssessNorm extends BaseEntity {

    @TableId(value = "norm_id", type = IdType.AUTO)
    private Long normId;

    /** 所属量表ID */
    private Long scaleId;

    /** 所属维度ID */
    private Long dimensionId;

    /** 常模名称 */
    private String normName;

    /** 适用人群 */
    private String population;

    /** 最小年龄 */
    private Integer ageMin;

    /** 最大年龄 */
    private Integer ageMax;

    /** 性别（0不限 1男 2女） */
    private String gender;

    /** 均值 */
    private BigDecimal meanScore;

    /** 标准差 */
    private BigDecimal stdDeviation;

    /** 样本量 */
    private Integer sampleSize;

    /** 数据来源 */
    private String source;

    /** 备注 */
    private String remark;
}
