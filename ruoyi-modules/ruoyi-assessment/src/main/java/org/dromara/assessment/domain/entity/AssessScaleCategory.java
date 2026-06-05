package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.tenant.core.TenantEntity;

/**
 * 量表分类 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_scale_category")
public class AssessScaleCategory extends TenantEntity {

    @TableId(value = "category_id", type = IdType.AUTO)
    private Long categoryId;

    /** 父分类ID */
    private Long parentId;

    /** 分类名称 */
    private String categoryName;

    /** 分类编码 */
    private String categoryCode;

    /** 显示顺序 */
    private Integer sortOrder;

    /** 状态（0正常 1停用） */
    private String status;

    /** 分类图标 */
    private String icon;

    /** 备注 */
    private String remark;

    /** 删除标志 */
    @TableLogic
    private String delFlag;
}
