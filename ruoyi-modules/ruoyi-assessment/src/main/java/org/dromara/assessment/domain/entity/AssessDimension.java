package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.mybatis.core.domain.BaseEntity;

/**
 * 量表维度 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_dimension")
public class AssessDimension extends BaseEntity {

    @TableId(value = "dimension_id", type = IdType.AUTO)
    private Long dimensionId;

    /** 所属量表ID */
    private Long scaleId;

    /** 维度名称 */
    private String dimensionName;

    /** 维度编码 */
    private String dimensionCode;

    /** 维度描述 */
    private String description;

    /** 显示顺序 */
    private Integer sortOrder;
}
