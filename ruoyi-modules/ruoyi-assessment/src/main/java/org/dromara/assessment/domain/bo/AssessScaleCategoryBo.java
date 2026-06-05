package org.dromara.assessment.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessScaleCategory;
import org.dromara.common.mybatis.core.domain.BaseEntity;

/**
 * 量表分类 业务对象
 */
@Data
@AutoMapper(target = AssessScaleCategory.class, reverseConvertGenerate = false)
public class AssessScaleCategoryBo extends BaseEntity {

    /** 分类ID */
    private Long categoryId;

    /** 父分类ID */
    private Long parentId;

    /** 分类名称 */
    @NotBlank(message = "分类名称不能为空")
    @Size(max = 100, message = "分类名称长度不能超过100个字符")
    private String categoryName;

    /** 分类编码 */
    @NotBlank(message = "分类编码不能为空")
    @Size(max = 64, message = "分类编码长度不能超过64个字符")
    private String categoryCode;

    /** 显示顺序 */
    private Integer sortOrder;

    /** 状态 */
    private String status;

    /** 图标 */
    private String icon;

    /** 备注 */
    private String remark;
}
